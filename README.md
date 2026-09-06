# PRINEOR — Digital Brand & Solutions

This project is a modern, high-performance web application crafted with React, TypeScript, Tailwind CSS, Lucide Icons, Motion animations, and an Express fullstack backend.

## Hostinger Deployment Guide

### Method 1: Git Deployment (Recommended)
1. In AI Studio, click the top-right menu -> **Export to GitHub**.
2. In Hostinger hPanel -> **Git** or **Deploy Web App**:
   - Repository: your prineor repository
   - Branch: `main`
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Click **Deploy**.

### Method 2: Hostinger File Manager (public_html)
1. Download the ZIP from AI Studio.
2. In Hostinger hPanel -> **File Manager** -> go to `public_html`.
3. Upload and extract the ZIP.
4. If files are inside a subfolder or `dist`, move the contents of `dist` (`index.html`, `assets/`, `.htaccess`) directly into `public_html`.
5. Your website is instantly live!
