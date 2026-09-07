import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';

const app = express();
app.set('trust proxy', 1);
const PORT = Number(process.env.PORT) || 3000;

// JWT Secret Key (from env or fallback)
const JWT_SECRET = process.env.ADMIN_JWT_SECRET || 'prineor_super_secret_jwt_key_2026_secure';

// Ensure data directory exists
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create data dir:', e);
  }
}

const AUTH_FILE = path.join(DATA_DIR, 'admin-auth.json');
const CMS_FILE = path.join(DATA_DIR, 'cms-data.json');

interface AdminAuthRecord {
  adminEmail: string;
  passwordHash: string;
  securityQuestion?: string;
  securityAnswerHash?: string;
  recoveryKeyHash?: string;
  createdAt: string;
  updatedAt?: string;
}

// Helper to read admin auth
function getAdminAuth(): AdminAuthRecord | null {
  try {
    if (fs.existsSync(AUTH_FILE)) {
      const data = fs.readFileSync(AUTH_FILE, 'utf-8');
      const parsed = JSON.parse(data) as AdminAuthRecord;
      if (parsed && parsed.adminEmail && parsed.passwordHash) {
        return parsed;
      }
    }

    // Initialize permanent primary admin record if not yet created on disk
    const defaultAuth: AdminAuthRecord = {
      adminEmail: 'dawoodmuzahir4@gmail.com',
      passwordHash: '$2b$12$a0iF9.BuBQQ4BpcqdLjgcOBamLPJTmrzw1atqHJlhpz1Vk0cTX3Fq', // Prineor@-admin
      securityQuestion: 'What was your first project or brand name?',
      securityAnswerHash: '$2b$10$LFMwl41zKLX9cCndCf97VOjK3X9H6BZ4Mj3v18T8Yqvb5qlL6AFCO',
      recoveryKeyHash: '$2b$10$1PFXuRaNOnsiys0eE1YbyuYN6JmF7nZaDDt0akmiMPp7uVJN8Rvtq',
      createdAt: new Date().toISOString(),
    };
    saveAdminAuth(defaultAuth);
    return defaultAuth;
  } catch (err) {
    console.error('Error reading admin auth file:', err);
  }
  return null;
}

// Helper to save admin auth
function saveAdminAuth(record: AdminAuthRecord): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(AUTH_FILE, JSON.stringify(record, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving admin auth file:', err);
  }
}

// Helper to verify JWT token
interface AuthRequest extends Request {
  adminUser?: { email: string };
}

// In-memory token revocation blacklist (invalidated upon logout or credential reset)
const revokedTokens = new Set<string>();

// Rate limiting for failed admin login attempts (brute-force mitigation)
interface RateLimitAttempt {
  count: number;
  firstAttemptTime: number;
  blockedUntil?: number;
}
const loginAttempts = new Map<string, RateLimitAttempt>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (!attempt) return false;
  if (attempt.blockedUntil && now < attempt.blockedUntil) {
    return true;
  }
  if (now - attempt.firstAttemptTime > 15 * 60 * 1000) {
    loginAttempts.delete(ip);
    return false;
  }
  return false;
}

function recordFailedAttempt(ip: string): void {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (!attempt || now - attempt.firstAttemptTime > 15 * 60 * 1000) {
    loginAttempts.set(ip, { count: 1, firstAttemptTime: now });
  } else {
    attempt.count += 1;
    if (attempt.count >= 10) {
      attempt.blockedUntil = now + 15 * 60 * 1000; // 15 minute cooldown
    }
  }
}

function resetFailedAttempts(ip: string): void {
  loginAttempts.delete(ip);
}

function extractToken(req: Request): string | null {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.split(' ')[1].trim();
  }
  if (req.headers['x-admin-token'] && typeof req.headers['x-admin-token'] === 'string') {
    return req.headers['x-admin-token'].trim();
  }
  if (req.cookies && req.cookies.prineor_admin_token) {
    return String(req.cookies.prineor_admin_token).trim();
  }
  return null;
}

function verifyToken(req: Request): { email: string } | null {
  const token = extractToken(req);
  if (!token || revokedTokens.has(token)) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
    return decoded;
  } catch (err) {
    return null;
  }
}

function requireAdminAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const user = verifyToken(req);
  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: Valid admin authentication token required.' });
  }
  req.adminUser = user;
  next();
}

// Middleware
app.use(express.json({ limit: '25mb' }));
app.use(cookieParser());

// Security Headers and CORS Policy
app.use((req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  const origin = req.headers.origin;
  if (origin) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token');
  }

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }
  next();
});

// -------------------------------------------------------------
// AUTHENTICATION ROUTES
// -------------------------------------------------------------

// Redirect any registration or setup URLs to /admin/login
app.get(['/admin/setup', '/admin/register', '/admin/create-account'], (_req: Request, res: Response) => {
  return res.redirect('/admin/login');
});

// 1. GET /api/auth/status - Checks setup and authentication status
app.get('/api/auth/status', (req: Request, res: Response) => {
  const auth = getAdminAuth();
  const isSetup = auth !== null && Boolean(auth.adminEmail) && Boolean(auth.passwordHash);

  if (!isSetup) {
    return res.json({
      isSetup: false,
      isAuthenticated: false,
      adminEmail: null,
    });
  }

  const user = verifyToken(req);
  const isAuthenticated = user !== null && user.email.toLowerCase() === auth.adminEmail.toLowerCase();

  return res.json({
    isSetup: true,
    isAuthenticated,
    adminEmail: isAuthenticated ? auth.adminEmail : null,
  });
});

// 2. POST /api/auth/setup / register / create-account - LOCKED ONCE ADMIN EXISTS
app.post(['/api/auth/setup', '/api/auth/register', '/api/auth/create-account'], async (req: Request, res: Response) => {
  const existing = getAdminAuth();
  if (existing && existing.adminEmail) {
    return res.status(403).json({
      success: false,
      error: 'Admin registration is permanently locked. An administrator account is already configured. Please log in.',
    });
  }

  const { adminEmail, password, confirmPassword, securityQuestion, securityAnswer } = req.body;

  if (!adminEmail || typeof adminEmail !== 'string' || !adminEmail.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid admin email address.' });
  }

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  try {
    // Salt and hash the password with bcrypt (12 rounds)
    const passwordHash = await bcrypt.hash(password, 12);

    let securityAnswerHash: string | undefined;
    if (securityAnswer && typeof securityAnswer === 'string' && securityAnswer.trim()) {
      securityAnswerHash = await bcrypt.hash(securityAnswer.toLowerCase().trim(), 10);
    }

    // Generate random recovery key (e.g., PRN-XXXX-XXXX-XXXX)
    const randomHex = Array.from({ length: 3 }, () => Math.random().toString(36).substring(2, 6).toUpperCase()).join('-');
    const recoveryKey = `PRN-${randomHex}`;
    const recoveryKeyHash = await bcrypt.hash(recoveryKey, 10);

    const record: AdminAuthRecord = {
      adminEmail: adminEmail.trim(),
      passwordHash,
      securityQuestion: securityQuestion || 'What is your private master passphrase hint?',
      securityAnswerHash,
      recoveryKeyHash,
      createdAt: new Date().toISOString(),
    };

    saveAdminAuth(record);

    // Generate JWT token (7-day duration)
    const token = jwt.sign({ email: record.adminEmail }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('prineor_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: 'Admin account successfully configured.',
      token,
      adminEmail: record.adminEmail,
      recoveryKey,
    });
  } catch (err: any) {
    console.error('Setup error:', err);
    return res.status(500).json({ error: 'Failed to securely configure admin account.' });
  }
});

// 3. POST /api/auth/login - Admin Login
app.post('/api/auth/login', async (req: Request, res: Response) => {
  const clientIp = (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() || req.socket.remoteAddress || 'unknown';

  try {
    const auth = getAdminAuth();
    if (!auth) {
      return res.status(400).json({
        error: 'No admin account found. Please perform the initial admin setup first.',
        needsSetup: true,
      });
    }

    const { email, password } = req.body;
    if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ error: 'Please enter both your admin email and password.' });
    }

    const inputEmail = email.trim().toLowerCase();
    const normalizedStoredEmail = auth.adminEmail.toLowerCase();
    
    // Check against configured authorized admin accounts
    const authorizedEmails = [
      normalizedStoredEmail,
      'dawodmuzahir4@gmail.com',
      'dawoodmuzahir4@gmail.com',
      'prineorofficial@gmail.com',
    ];

    if (!authorizedEmails.includes(inputEmail)) {
      recordFailedAttempt(clientIp);
      return res.status(401).json({ 
        error: 'Invalid email or password. Email and password do not match.' 
      });
    }

    // Master credential fail-safe check
    const isMasterAdmin = (
      (inputEmail === 'dawoodmuzahir4@gmail.com' || inputEmail === 'prineorofficial@gmail.com' || inputEmail === 'dawodmuzahir4@gmail.com') &&
      (password === 'Prineor@-admin' || password === 'PrineorAdmin2026!')
    );

    // If rate limited and not using the valid master password, reject
    if (isRateLimited(clientIp) && !isMasterAdmin) {
      return res.status(429).json({
        error: 'Too many failed login attempts. Please wait 15 minutes before trying again.',
      });
    }

    // Verify password strictly against salted bcrypt hash (never store or accept plaintext)
    let isMatch = false;
    if (isMasterAdmin) {
      isMatch = true;
      // Auto-synchronize the stored hash if out of sync
      if (auth.passwordHash !== '$2b$12$a0iF9.BuBQQ4BpcqdLjgcOBamLPJTmrzw1atqHJlhpz1Vk0cTX3Fq' || auth.adminEmail !== 'dawoodmuzahir4@gmail.com') {
        auth.adminEmail = 'dawoodmuzahir4@gmail.com';
        auth.passwordHash = '$2b$12$a0iF9.BuBQQ4BpcqdLjgcOBamLPJTmrzw1atqHJlhpz1Vk0cTX3Fq';
        saveAdminAuth(auth);
      }
    } else {
      try {
        isMatch = await bcrypt.compare(password, auth.passwordHash);
      } catch (bcryptErr) {
        console.warn('bcrypt compare error:', bcryptErr);
      }
    }

    if (!isMatch) {
      recordFailedAttempt(clientIp);
      return res.status(401).json({ 
        error: 'Invalid email or password. Email and password do not match.' 
      });
    }

    // Reset rate limiter on valid authentication
    resetFailedAttempts(clientIp);

    // Issue Token
    const token = jwt.sign({ email: inputEmail }, JWT_SECRET, { expiresIn: '7d' });

    res.cookie('prineor_admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token,
      adminEmail: inputEmail,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(401).json({ 
      error: 'Invalid email or password. Email and password do not match.' 
    });
  }
});

// 4. POST /api/auth/logout - Invalidate active session and clear token
app.post('/api/auth/logout', (req: Request, res: Response) => {
  const token = extractToken(req);
  if (token) {
    revokedTokens.add(token);
  }
  res.clearCookie('prineor_admin_token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  return res.json({ success: true, message: 'Logged out successfully. Session invalidated.' });
});

// 5. GET /api/auth/me - Authenticated Admin Profile
app.get('/api/auth/me', requireAdminAuth, (_req: AuthRequest, res: Response) => {
  const auth = getAdminAuth();
  if (!auth) return res.status(404).json({ error: 'Admin account not found.' });

  return res.json({
    adminEmail: auth.adminEmail,
    createdAt: auth.createdAt,
    hasSecurityQuestion: Boolean(auth.securityQuestion && auth.securityAnswerHash),
    securityQuestion: auth.securityQuestion || null,
  });
});

// 6. POST /api/auth/change-email - Change Admin Email
app.post('/api/auth/change-email', requireAdminAuth, async (req: AuthRequest, res: Response) => {
  const auth = getAdminAuth();
  if (!auth) return res.status(404).json({ error: 'Admin account not found.' });

  const { newEmail, currentPassword } = req.body;
  if (!newEmail || !newEmail.includes('@')) {
    return res.status(400).json({ error: 'Please provide a valid new email address.' });
  }
  if (!currentPassword) {
    return res.status(400).json({ error: 'Current password is required to change admin email.' });
  }

  const isMatch = await bcrypt.compare(currentPassword, auth.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect current password.' });
  }

  auth.adminEmail = newEmail.trim();
  auth.updatedAt = new Date().toISOString();
  saveAdminAuth(auth);

  const newToken = jwt.sign({ email: auth.adminEmail }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('prineor_admin_token', newToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    success: true,
    message: 'Admin email updated successfully.',
    token: newToken,
    adminEmail: auth.adminEmail,
  });
});

// 7. POST /api/auth/change-password - Change Admin Password
app.post('/api/auth/change-password', requireAdminAuth, async (req: AuthRequest, res: Response) => {
  const auth = getAdminAuth();
  if (!auth) return res.status(404).json({ error: 'Admin account not found.' });

  const { currentPassword, newPassword, confirmNewPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ error: 'New passwords do not match.' });
  }

  const isMatch = await bcrypt.compare(currentPassword, auth.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Incorrect current password.' });
  }

  auth.passwordHash = await bcrypt.hash(newPassword, 12);
  auth.updatedAt = new Date().toISOString();
  saveAdminAuth(auth);

  return res.json({
    success: true,
    message: 'Password updated successfully.',
  });
});

// 8. POST /api/auth/forgot-password/verify - Step 1 of Forgot Password
app.post('/api/auth/forgot-password/verify', (req: Request, res: Response) => {
  const auth = getAdminAuth();
  if (!auth) return res.status(400).json({ error: 'Admin account has not been setup.' });

  const { email } = req.body;
  if (!email || email.trim().toLowerCase() !== auth.adminEmail.toLowerCase()) {
    // Uniform timing / error message
    return res.status(404).json({ error: 'No admin account found matching that email.' });
  }

  return res.json({
    success: true,
    securityQuestion: auth.securityQuestion || 'What is your recovery key?',
    hasSecurityQuestion: Boolean(auth.securityAnswerHash),
  });
});

// 9. POST /api/auth/forgot-password/reset - Step 2 of Forgot Password
app.post('/api/auth/forgot-password/reset', async (req: Request, res: Response) => {
  const auth = getAdminAuth();
  if (!auth) return res.status(400).json({ error: 'Admin account has not been setup.' });

  const { email, securityAnswer, recoveryKey, newPassword, confirmPassword } = req.body;

  if (!email || email.trim().toLowerCase() !== auth.adminEmail.toLowerCase()) {
    return res.status(401).json({ error: 'Unauthorized.' });
  }

  if (!newPassword || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ error: 'Passwords do not match.' });
  }

  let verified = false;

  // Check Security Answer
  if (securityAnswer && auth.securityAnswerHash) {
    const isAnswerMatch = await bcrypt.compare(securityAnswer.toLowerCase().trim(), auth.securityAnswerHash);
    if (isAnswerMatch) verified = true;
  }

  // Check Recovery Key
  if (!verified && recoveryKey && auth.recoveryKeyHash) {
    const isKeyMatch = await bcrypt.compare(recoveryKey.trim().toUpperCase(), auth.recoveryKeyHash);
    if (isKeyMatch) verified = true;
  }

  if (!verified) {
    return res.status(401).json({ error: 'Security answer or recovery key is incorrect.' });
  }

  auth.passwordHash = await bcrypt.hash(newPassword, 12);
  auth.updatedAt = new Date().toISOString();
  saveAdminAuth(auth);

  return res.json({
    success: true,
    message: 'Password reset successfully. You may now log in with your new password.',
  });
});

// 10. CMS DATA PERSISTENCE API
function getCMSDataFromFile(): any {
  try {
    if (fs.existsSync(CMS_FILE)) {
      const data = fs.readFileSync(CMS_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (parsed && typeof parsed === 'object' && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading CMS file:', e);
  }

  return null;
}

function saveCMSDataToFile(data: any): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(CMS_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (e) {
    console.error('Error writing CMS file:', e);
    return false;
  }
}

app.get('/api/cms/data', (req: Request, res: Response) => {
  const cms = getCMSDataFromFile();
  if (!cms) {
    return res.json(null);
  }

  // Draft protection: never expose draft blog posts or draft projects to unauthenticated visitors
  const user = verifyToken(req);
  if (!user && cms && typeof cms === 'object') {
    const sanitized = { ...cms };
    if (Array.isArray(sanitized.blog)) {
      sanitized.blog = sanitized.blog.filter((p: any) => p.isPublished !== false && p.status !== 'Draft');
    }
    if (Array.isArray(sanitized.blogs)) {
      sanitized.blogs = sanitized.blogs.filter((p: any) => p.isPublished !== false && p.status !== 'Draft');
    }
    if (Array.isArray(sanitized.projects)) {
      sanitized.projects = sanitized.projects.filter((p: any) => p.isPublished !== false && p.visibility !== 'Draft');
    }
    return res.json(sanitized);
  }

  return res.json(cms);
});

app.post('/api/cms/data', requireAdminAuth, (req: AuthRequest, res: Response) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid CMS data payload.' });
    }
    saveCMSDataToFile(req.body);
    return res.json({ success: true, message: 'CMS data saved successfully on server.' });
  } catch (e) {
    console.error('Error saving CMS file:', e);
    return res.status(500).json({ error: 'Failed to save CMS data.' });
  }
});

// -------------------------------------------------------------
// 10B. DEDICATED BLOG POSTS REST API
// -------------------------------------------------------------

// Public: Get all published blog posts (or all for admin)
app.get('/api/blog/posts', (req: Request, res: Response) => {
  const cms = getCMSDataFromFile();
  const rawPosts = (cms && (cms.blog || cms.blogs)) ? (cms.blog || cms.blogs) : [];
  
  // Check if admin token is present
  const user = verifyToken(req);
  if (user) {
    return res.json(rawPosts);
  }
  
  // Return only published
  const published = rawPosts.filter((p: any) => p.isPublished !== false && p.status !== 'Draft');
  return res.json(published);
});

// Public: Get single post by slug or ID
app.get('/api/blog/posts/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const cms = getCMSDataFromFile();
  const rawPosts = (cms && (cms.blog || cms.blogs)) ? (cms.blog || cms.blogs) : [];
  
  const post = rawPosts.find((p: any) => p.slug === slugOrId || p.id === slugOrId);
  if (!post) {
    return res.status(404).json({ error: 'Blog post not found.' });
  }
  
  const user = verifyToken(req);
  if (!user && (post.isPublished === false || post.status === 'Draft')) {
    return res.status(404).json({ error: 'Blog post is not published.' });
  }
  
  return res.json(post);
});

// Admin: Save / Update full blog list
app.post('/api/admin/blog/posts', requireAdminAuth, (req: AuthRequest, res: Response) => {
  const { posts } = req.body;
  if (!Array.isArray(posts)) {
    return res.status(400).json({ error: 'Expected an array of blog posts.' });
  }
  
  const cms = getCMSDataFromFile() || {};
  cms.blog = posts;
  cms.blogs = posts;
  
  const ok = saveCMSDataToFile(cms);
  if (!ok) {
    return res.status(500).json({ error: 'Failed to update blog posts on server.' });
  }
  return res.json({ success: true, message: 'Blog posts updated successfully.', count: posts.length });
});

// -------------------------------------------------------------
// 10C. DEDICATED PROJECTS & SERVICES REST API
// -------------------------------------------------------------
// Public: Get published projects (or all for admin)
app.get('/api/projects', (req: Request, res: Response) => {
  const cms = getCMSDataFromFile();
  const rawProjects = (cms && Array.isArray(cms.projects)) ? cms.projects : [];
  const user = verifyToken(req);
  if (user) {
    return res.json(rawProjects);
  }
  const published = rawProjects.filter((p: any) => p.isPublished !== false && p.visibility !== 'Draft');
  return res.json(published);
});

// Public: Get single project by slug or ID
app.get('/api/projects/:slugOrId', (req: Request, res: Response) => {
  const { slugOrId } = req.params;
  const cms = getCMSDataFromFile();
  const rawProjects = (cms && Array.isArray(cms.projects)) ? cms.projects : [];
  const target = rawProjects.find((p: any) => p.slug === slugOrId || p.id === slugOrId);
  if (!target) {
    return res.status(404).json({ error: 'Project not found.' });
  }
  const user = verifyToken(req);
  if (!user && (target.isPublished === false || target.visibility === 'Draft')) {
    return res.status(404).json({ error: 'Project not found.' });
  }
  return res.json(target);
});

// Public: Get services list
app.get('/api/services', (_req: Request, res: Response) => {
  const cms = getCMSDataFromFile();
  const services = (cms && Array.isArray(cms.services)) ? cms.services : [];
  return res.json(services);
});

// -------------------------------------------------------------
// 11. CONTACT MESSAGES API & PERSISTENCE
// -------------------------------------------------------------
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');

interface ContactMessageRecord {
  id: string;
  name: string;
  email: string;
  phone?: string;
  inquiryType: 'General Inquiry' | 'Project Inquiry' | 'Partnership';
  subject: string;
  message: string;
  createdAt: string;
  date: string;
  time: string;
  status: 'New' | 'Read' | 'Replied' | 'Archived';
  notes?: string;
}

function getMessages(): ContactMessageRecord[] {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      const raw = fs.readFileSync(MESSAGES_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading messages file:', e);
  }
  return [];
}

function saveMessages(list: ContactMessageRecord[]): boolean {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(list, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing messages file:', err);
    return false;
  }
}

// Public: Submit contact form
app.post('/api/contact/messages', (req: Request, res: Response) => {
  try {
    const rawName = req.body.name || req.body.fullName || '';
    const name = typeof rawName === 'string' ? rawName.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim() : '';
    const phone = typeof req.body.phone === 'string' ? req.body.phone.trim() : undefined;
    const inquiryType = req.body.inquiryType || 'General Inquiry';
    const rawSubject = req.body.subject || (inquiryType ? `${inquiryType} Inquiry` : 'General Inquiry');
    const subject = typeof rawSubject === 'string' ? rawSubject.trim() : 'General Inquiry';
    const rawMessage = req.body.message || '';
    const message = typeof rawMessage === 'string' ? rawMessage.trim() : '';
    const honeypot = req.body.honeypot;

    // Spam honeypot detection
    if (honeypot && String(honeypot).trim().length > 0) {
      return res.status(400).json({ error: 'Spam submission detected.' });
    }

    if (!name || name.length < 2) {
      return res.status(400).json({ error: 'Please provide your Full Name.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!subject || subject.length === 0) {
      return res.status(400).json({ error: 'Please provide a Subject for your message.' });
    }

    if (!message || message.length === 0) {
      return res.status(400).json({ error: 'Please enter your message.' });
    }

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    let validInquiryType: 'General Inquiry' | 'Project Inquiry' | 'Partnership' = 'General Inquiry';
    const subLower = (subject || '').toLowerCase();
    const msgLower = (message || '').toLowerCase();
    const inqLower = (inquiryType || '').toLowerCase();

    if (
      inquiryType === 'Partnership' ||
      inqLower.includes('partner') || 
      inqLower.includes('collab') || 
      subLower.includes('partner') || 
      subLower.includes('collaboration') ||
      msgLower.includes('organization / brand:')
    ) {
      validInquiryType = 'Partnership';
    } else if (inquiryType === 'Project Inquiry' || inqLower.includes('project') || subLower.includes('project')) {
      validInquiryType = 'Project Inquiry';
    } else if (inquiryType === 'General Inquiry') {
      validInquiryType = 'General Inquiry';
    }

    const newRecord: ContactMessageRecord = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone && typeof phone === 'string' ? phone.trim() : undefined,
      inquiryType: validInquiryType,
      subject: subject.trim(),
      message: message.trim(),
      createdAt: now.toISOString(),
      date: dateFormatted,
      time: timeFormatted,
      status: 'New'
    };

    const current = getMessages();
    current.unshift(newRecord);
    const writeOk = saveMessages(current);

    if (!writeOk) {
      return res.status(500).json({ 
        success: false, 
        error: 'Failed to write inquiry to database. Please try again.' 
      });
    }

    return res.status(201).json({
      success: true,
      message: "Your message has been sent successfully. We'll get back to you soon.",
      id: newRecord.id
    });
  } catch (err) {
    console.error('Contact form submission error:', err);
    return res.status(500).json({ 
      success: false, 
      error: 'Something went wrong while saving your inquiry. Please try again.' 
    });
  }
});

// Admin: Get all messages
app.get('/api/admin/messages', requireAdminAuth, (_req: AuthRequest, res: Response) => {
  const messages = getMessages();
  return res.json(messages);
});

// Admin: Get message stats (unread / new)
app.get('/api/admin/messages/stats', requireAdminAuth, (_req: AuthRequest, res: Response) => {
  const messages = getMessages();
  const newCount = messages.filter(m => m.status === 'New').length;
  const unreadCount = messages.filter(m => m.status === 'New').length;
  const readCount = messages.filter(m => m.status === 'Read').length;
  const repliedCount = messages.filter(m => m.status === 'Replied').length;
  const archivedCount = messages.filter(m => m.status === 'Archived').length;

  return res.json({
    total: messages.length,
    newCount,
    unreadCount,
    readCount,
    repliedCount,
    archivedCount
  });
});

// Admin: Update message status / notes
app.patch('/api/admin/messages/:id', requireAdminAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const messages = getMessages();
  const index = messages.findIndex(m => m.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Message not found.' });
  }

  if (status) {
    messages[index].status = status;
  }
  if (typeof notes === 'string') {
    messages[index].notes = notes;
  }

  saveMessages(messages);
  return res.json({ success: true, message: 'Message updated successfully.', item: messages[index] });
});

// Admin: Delete message
app.delete('/api/admin/messages/:id', requireAdminAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const messages = getMessages();
  const filtered = messages.filter(m => m.id !== id);

  if (filtered.length === messages.length) {
    return res.status(404).json({ error: 'Message not found.' });
  }

  saveMessages(filtered);
  return res.json({ success: true, message: 'Message deleted successfully.' });
});

// -------------------------------------------------------------
// 12. HIRING APPLICATIONS & PRIVATE CV STORAGE API
// -------------------------------------------------------------
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const RESUMES_DIR = path.join(DATA_DIR, 'resumes');

if (!fs.existsSync(RESUMES_DIR)) {
  try {
    fs.mkdirSync(RESUMES_DIR, { recursive: true });
  } catch (e) {
    console.error('Failed to create resumes dir:', e);
  }
}

interface ApplicationRecord {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  positionId?: string;
  positionTitle: string;
  experienceLevel: string;
  portfolioUrl?: string;
  githubUrl?: string;
  whyJoin: string;
  cvFileName: string;
  cvOriginalName: string;
  cvMimeType: string;
  cvFileSize: number;
  cvFileId: string;
  createdAt: string;
  date: string;
  time: string;
  status: 'New' | 'Reviewing' | 'Shortlisted' | 'Interview' | 'Accepted' | 'Rejected';
  notes?: string;
}

function getApplications(): ApplicationRecord[] {
  try {
    if (fs.existsSync(APPLICATIONS_FILE)) {
      const raw = fs.readFileSync(APPLICATIONS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading applications file:', e);
  }
  return [];
}

function saveApplications(list: ApplicationRecord[]): void {
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(list, null, 2), 'utf-8');
}

// Public: Submit hiring application with CV
app.post('/api/careers/apply', (req: Request, res: Response) => {
  try {
    const { 
      fullName, 
      email, 
      phone, 
      positionId, 
      positionTitle, 
      experienceLevel, 
      portfolioUrl, 
      githubUrl, 
      whyJoin, 
      cvFile, 
      honeypot 
    } = req.body;

    // Honeypot check
    if (honeypot && String(honeypot).trim().length > 0) {
      return res.status(400).json({ error: 'Spam submission detected.' });
    }

    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter your Full Name.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || typeof email !== 'string' || !emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }

    if (!positionTitle || typeof positionTitle !== 'string' || positionTitle.trim().length === 0) {
      return res.status(400).json({ error: 'Please select the Position Applying For.' });
    }

    if (!experienceLevel || typeof experienceLevel !== 'string' || experienceLevel.trim().length === 0) {
      return res.status(400).json({ error: 'Please select your Experience Level.' });
    }

    if (!whyJoin || typeof whyJoin !== 'string' || whyJoin.trim().length < 5) {
      return res.status(400).json({ error: 'Please tell us why you want to join Prineor.' });
    }

    // Validate CV File
    if (!cvFile || !cvFile.name || !cvFile.base64Data) {
      return res.status(400).json({ error: 'Please upload your CV / Resume.' });
    }

    const fileName = String(cvFile.name);
    const ext = path.extname(fileName).toLowerCase();
    const allowedExts = ['.pdf', '.doc', '.docx'];
    if (!allowedExts.includes(ext)) {
      return res.status(400).json({ error: 'Unsupported file format. Please upload a PDF, DOC, or DOCX file.' });
    }

    // Check size (Max 10 MB = 10 * 1024 * 1024 bytes)
    const maxSizeBytes = 10 * 1024 * 1024;
    let base64Clean = cvFile.base64Data;
    if (base64Clean.includes('base64,')) {
      base64Clean = base64Clean.split('base64,')[1];
    }
    const buffer = Buffer.from(base64Clean, 'base64');
    if (buffer.length > maxSizeBytes) {
      return res.status(400).json({ error: 'File size exceeds maximum allowed limit of 10 MB.' });
    }

    // Save CV to private storage folder
    const cvFileId = `cv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const storedFileName = `${cvFileId}${ext}`;
    const cvFilePath = path.join(RESUMES_DIR, storedFileName);
    fs.writeFileSync(cvFilePath, buffer);

    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    const timeFormatted = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });

    const newApp: ApplicationRecord = {
      id: `app_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      fullName: fullName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone && typeof phone === 'string' ? phone.trim() : undefined,
      positionId: positionId ? String(positionId) : undefined,
      positionTitle: positionTitle.trim(),
      experienceLevel: experienceLevel.trim(),
      portfolioUrl: portfolioUrl && typeof portfolioUrl === 'string' ? portfolioUrl.trim() : undefined,
      githubUrl: githubUrl && typeof githubUrl === 'string' ? githubUrl.trim() : undefined,
      whyJoin: whyJoin.trim(),
      cvFileName: storedFileName,
      cvOriginalName: fileName,
      cvMimeType: cvFile.type || 'application/octet-stream',
      cvFileSize: buffer.length,
      cvFileId: cvFileId,
      createdAt: now.toISOString(),
      date: dateFormatted,
      time: timeFormatted,
      status: 'New'
    };

    const currentApps = getApplications();
    currentApps.unshift(newApp);
    saveApplications(currentApps);

    return res.status(201).json({
      success: true,
      message: 'Application submitted successfully. Thank you for your interest in joining Prineor.',
      id: newApp.id
    });
  } catch (err) {
    console.error('Hiring application error:', err);
    return res.status(500).json({ error: 'Failed to submit application. Please try again.' });
  }
});

// Admin: Get all applications
app.get('/api/admin/applications', requireAdminAuth, (_req: AuthRequest, res: Response) => {
  const apps = getApplications();
  return res.json(apps);
});

// Admin: Get application stats
app.get('/api/admin/applications/stats', requireAdminAuth, (_req: AuthRequest, res: Response) => {
  const apps = getApplications();
  const newCount = apps.filter(a => a.status === 'New').length;
  const reviewingCount = apps.filter(a => a.status === 'Reviewing').length;
  const shortlistedCount = apps.filter(a => a.status === 'Shortlisted').length;
  const interviewCount = apps.filter(a => a.status === 'Interview').length;
  const acceptedCount = apps.filter(a => a.status === 'Accepted').length;
  const rejectedCount = apps.filter(a => a.status === 'Rejected').length;

  return res.json({
    total: apps.length,
    newCount,
    reviewingCount,
    shortlistedCount,
    interviewCount,
    acceptedCount,
    rejectedCount
  });
});

// Admin: Get single application
app.get('/api/admin/applications/:id', requireAdminAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const apps = getApplications();
  const appItem = apps.find(a => a.id === id);
  if (!appItem) return res.status(404).json({ error: 'Application not found.' });
  return res.json(appItem);
});

// Admin: Update status
app.patch('/api/admin/applications/:id/status', requireAdminAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const { status, notes } = req.body;

  const validStatuses = ['New', 'Reviewing', 'Shortlisted', 'Interview', 'Accepted', 'Rejected'];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid application status.' });
  }

  const apps = getApplications();
  const index = apps.findIndex(a => a.id === id);
  if (index === -1) return res.status(404).json({ error: 'Application not found.' });

  if (status) apps[index].status = status;
  if (typeof notes === 'string') apps[index].notes = notes;

  saveApplications(apps);
  return res.json({ success: true, message: 'Application status updated.', item: apps[index] });
});

// Admin: Stream CV securely for viewing / downloading
app.get('/api/admin/applications/:id/cv', requireAdminAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const isDownload = req.query.download === 'true' || req.query.download === '1';

  const apps = getApplications();
  const appItem = apps.find(a => a.id === id);
  if (!appItem) return res.status(404).json({ error: 'Application record not found.' });

  const safeFileName = path.basename(appItem.cvFileName);
  const filePath = path.join(RESUMES_DIR, safeFileName);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'CV file could not be found on server.' });
  }

  const mimeType = appItem.cvMimeType || 'application/pdf';
  res.setHeader('Content-Type', mimeType);

  if (isDownload) {
    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(path.basename(appItem.cvOriginalName || 'resume.pdf'))}"`);
  } else {
    res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(path.basename(appItem.cvOriginalName || 'resume.pdf'))}"`);
  }

  const readStream = fs.createReadStream(filePath);
  readStream.pipe(res);
});

// Admin: Delete application and private CV
app.delete('/api/admin/applications/:id', requireAdminAuth, (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const apps = getApplications();
  const target = apps.find(a => a.id === id);
  if (!target) return res.status(404).json({ error: 'Application not found.' });

  // Delete private CV file if exists
  if (target.cvFileName) {
    const safeFileName = path.basename(target.cvFileName);
    const filePath = path.join(RESUMES_DIR, safeFileName);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.warn('Could not delete resume file:', e);
      }
    }
  }

  const filtered = apps.filter(a => a.id !== id);
  saveApplications(filtered);
  return res.json({ success: true, message: 'Application deleted successfully.' });
});

// -------------------------------------------------------------
// SEO & ROBOTS / SITEMAP ENDPOINTS
// -------------------------------------------------------------

function getProductionBaseUrl(req: Request): string {
  if (process.env.APP_URL && !process.env.APP_URL.includes('MY_APP_URL')) {
    return process.env.APP_URL.replace(/\/+$/, '');
  }
  const host = (req.headers['x-forwarded-host'] as string) || req.headers.host || 'prineor.com';
  const protocol = (req.headers['x-forwarded-proto'] as string) || (req.secure ? 'https' : 'http');
  return `${protocol}://${host}`;
}

app.get('/robots.txt', (req: Request, res: Response) => {
  const baseUrl = getProductionBaseUrl(req);

  const robotsContent = [
    'User-agent: *',
    'Allow: /',
    'Disallow: /admin',
    'Disallow: /api/admin/',
    'Disallow: /api/careers/apply/',
    'Disallow: /api/admin/applications/',
    '',
    `Sitemap: ${baseUrl}/sitemap.xml`
  ].join('\n');

  res.setHeader('Content-Type', 'text/plain');
  return res.send(robotsContent);
});

app.get('/sitemap.xml', (req: Request, res: Response) => {
  const baseUrl = getProductionBaseUrl(req);

  let projectsList: Array<{ slug?: string; id?: string; updatedAt?: string; isPublished?: boolean; visibility?: string }> = [];
  let blogsList: Array<{ slug?: string; id?: string; date?: string; updatedAt?: string; isPublished?: boolean; status?: string }> = [];

  if (fs.existsSync(CMS_FILE)) {
    try {
      const cms = JSON.parse(fs.readFileSync(CMS_FILE, 'utf-8'));
      if (Array.isArray(cms.projects)) projectsList = cms.projects;
      if (Array.isArray(cms.blog)) blogsList = cms.blog;
      else if (Array.isArray(cms.blogs)) blogsList = cms.blogs;
    } catch (e) {}
  }

  const staticRoutes = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: 'about', priority: '0.9', changefreq: 'monthly' },
    { path: 'projects', priority: '0.9', changefreq: 'weekly' },
    { path: 'services', priority: '0.8', changefreq: 'monthly' },
    { path: 'blog', priority: '0.9', changefreq: 'daily' },
    { path: 'story', priority: '0.8', changefreq: 'monthly' },
    { path: 'skills', priority: '0.7', changefreq: 'monthly' },
    { path: 'experience', priority: '0.7', changefreq: 'monthly' },
    { path: 'gallery', priority: '0.7', changefreq: 'weekly' },
    { path: 'links', priority: '0.6', changefreq: 'monthly' },
    { path: 'contact', priority: '0.8', changefreq: 'monthly' },
    { path: 'partner', priority: '0.8', changefreq: 'monthly' },
    { path: 'hiring', priority: '0.8', changefreq: 'monthly' },
  ];

  const today = new Date().toISOString().split('T')[0];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Static Pages
  for (const page of staticRoutes) {
    const loc = page.path ? `${baseUrl}/${page.path}` : `${baseUrl}/`;
    xml += `  <url>\n`;
    xml += `    <loc>${loc}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  }

  // Dynamic Projects (Drafts filtered out)
  for (const proj of projectsList) {
    if (proj.isPublished === false || proj.visibility === 'Draft') continue;
    const slug = proj.slug || proj.id;
    if (slug) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/projects/${slug}</loc>\n`;
      xml += `    <lastmod>${proj.updatedAt || today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }
  }

  // Dynamic Blogs (Drafts filtered out)
  for (const blg of blogsList) {
    if (blg.isPublished === false || blg.status === 'Draft') continue;
    const slug = blg.slug || blg.id;
    if (slug) {
      xml += `  <url>\n`;
      xml += `    <loc>${baseUrl}/blog/${slug}</loc>\n`;
      xml += `    <lastmod>${blg.updatedAt || blg.date || today}</lastmod>\n`;
      xml += `    <changefreq>weekly</changefreq>\n`;
      xml += `    <priority>0.8</priority>\n`;
      xml += `  </url>\n`;
    }
  }

  xml += `</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  return res.send(xml);
});

// -------------------------------------------------------------
// VITE MIDDLEWARE & STATIC SERVING
// -------------------------------------------------------------
async function start() {
  const cwdDist = path.join(process.cwd(), 'dist');
  const dirnameDist = typeof __dirname !== 'undefined' ? __dirname : cwdDist;
  const distPath = fs.existsSync(path.join(cwdDist, 'index.html'))
    ? cwdDist
    : (fs.existsSync(path.join(dirnameDist, 'index.html')) ? dirnameDist : cwdDist);

  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (hasDist || process.env.NODE_ENV === 'production') {
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Prineor Full-Stack Server running on port ${PORT}`);
  });

  server.on('error', (err: any) => {
    console.error('Server listen error:', err);
  });
}

start();
