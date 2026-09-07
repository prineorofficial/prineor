export function getAdminAuthToken(): string {
  try {
    const sessionToken = sessionStorage.getItem('prineor_admin_jwt');
    if (sessionToken && sessionToken.trim()) return sessionToken.trim();

    const localToken = localStorage.getItem('prineor_admin_jwt');
    if (localToken && localToken.trim()) return localToken.trim();

    const fallbackSession = sessionStorage.getItem('admin_token');
    if (fallbackSession && fallbackSession.trim()) return fallbackSession.trim();

    const fallbackLocal = localStorage.getItem('admin_token');
    if (fallbackLocal && fallbackLocal.trim()) return fallbackLocal.trim();

    // Check cookie
    if (typeof document !== 'undefined' && document.cookie) {
      const match = document.cookie.match(/(?:^|;\s*)prineor_admin_token=([^;]+)/);
      if (match && match[1]) {
        return decodeURIComponent(match[1]);
      }
    }

    return '';
  } catch {
    return '';
  }
}

export function getAdminAuthHeaders(extraHeaders: Record<string, string> = {}): Record<string, string> {
  const token = getAdminAuthToken();
  const headers: Record<string, string> = { ...extraHeaders };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
    headers['x-admin-token'] = token;
  }
  return headers;
}

export function adminFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const headers = getAdminAuthHeaders(
    (init.headers as Record<string, string>) || {}
  );

  return fetch(input, {
    ...init,
    credentials: 'include',
    headers,
  });
}
