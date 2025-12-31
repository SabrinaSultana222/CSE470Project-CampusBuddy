// Simple API helper for auth token management and authenticated fetch
export const TOKEN_KEY = 'campusbuddy.token';
export const USER_KEY = 'campusbuddy.user';
export const API_BASE_URL = 'http://localhost:5001';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
  const raw = localStorage.getItem(USER_KEY);
  try {
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    return null;
  }
}

export async function authFetch(path, options = {}) {
  const token = getToken();
  const headers = options.headers ? { ...options.headers } : {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
    options.body = JSON.stringify(options.body);
  }
  // Prepend base URL if path is relative
  const url = path.startsWith('http') ? path : `${API_BASE_URL}${path}`;
  const res = await fetch(url, { ...options, headers });
  const contentType = res.headers.get('content-type') || '';

  // Check if response has content
  const text = await res.text();

  if (contentType.includes('application/json') && text) {
    try {
      const data = JSON.parse(text);
      if (!res.ok) throw data;
      return data;
    } catch (err) {
      if (!res.ok) throw new Error('Request failed');
      throw err;
    }
  }

  if (!res.ok) throw new Error(text || 'Request failed');
  return null;
}

// Add these notification API methods (APPEND TO END OF FILE)
export const discussionNotificationApi = {
  getMyNotifications: () => authFetch('/api/discussion-notifications/my-notifications'),
  getUnreadCount: () => authFetch('/api/discussion-notifications/unread-count'),
  markAsRead: (id) => authFetch(`/api/discussion-notifications/${id}/read`, {
    method: 'PATCH'
  }),
};

// ✅ NEW: Club Notifications API (APPEND ONLY - does not affect discussion)
export const clubNotificationApi = {
  getMyNotifications: () => authFetch('/api/club-notifications/my-notifications'),
  getUnreadCount: () => authFetch('/api/club-notifications/unread-count'),
  markAsRead: (id) => authFetch(`/api/club-notifications/${id}/read`, {
    method: 'PATCH'
  }),
};
