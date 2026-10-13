import { AdminUser, ActiveSession, AuditLog, UserRole } from '../types';

const TOKEN_KEY = 'plush_comfort_admin_token';
const USER_KEY = 'plush_comfort_admin_user';

export const adminAuthService = {
  getToken(): string | null {
    return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string, remember = false): void {
    sessionStorage.setItem(TOKEN_KEY, token);
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token);
    }
  },

  clearToken(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(USER_KEY);
    localStorage.removeItem(USER_KEY);
  },

  getStoredUser(): AdminUser | null {
    const raw = sessionStorage.getItem(USER_KEY) || localStorage.getItem(USER_KEY);
    try {
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  setStoredUser(user: AdminUser, remember = false): void {
    const json = JSON.stringify(user);
    sessionStorage.setItem(USER_KEY, json);
    if (remember) {
      localStorage.setItem(USER_KEY, json);
    }
  },

  async getStatus(): Promise<{ initialized: boolean; authenticated: boolean; user: AdminUser | null }> {
    try {
      const token = this.getToken();
      const res = await fetch('/api/auth/status', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Backend status check failed, using fallback:', err);
    }
    return { initialized: false, authenticated: false, user: null };
  },

  async initMaster(name: string, email: string, password: string): Promise<{
    success: boolean;
    recoveryKey?: string;
    token?: string;
    user?: AdminUser;
    error?: string;
  }> {
    try {
      const res = await fetch('/api/auth/init-master', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.setToken(data.token, true);
        this.setStoredUser(data.user, true);
        return data;
      }
      return { success: false, error: data.error || 'Initialization failed' };
    } catch (err: any) {
      return { success: false, error: err.message || 'Network error' };
    }
  },

  async login(email: string, password: string, remember = false): Promise<{
    success: boolean;
    token?: string;
    user?: AdminUser;
    error?: string;
    waitMinutes?: number;
  }> {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        this.setToken(data.token, remember);
        this.setStoredUser(data.user, remember);
        return data;
      }
      return {
        success: false,
        error: data.error || 'Invalid login credentials',
        waitMinutes: data.waitMinutes,
      };
    } catch (err: any) {
      return { success: false, error: err.message || 'Login connection failed' };
    }
  },

  async logout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      try {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (err) {
        console.warn('Logout request failed:', err);
      }
    }
    this.clearToken();
  },

  async logoutOtherDevices(): Promise<{ success: boolean; revokedCount?: number; error?: string }> {
    const token = this.getToken();
    if (!token) return { success: false, error: 'Not authenticated' };
    try {
      const res = await fetch('/api/auth/logout-other-devices', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      return await res.json();
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async getActiveSessions(): Promise<ActiveSession[]> {
    const token = this.getToken();
    if (!token) return [];
    try {
      const res = await fetch('/api/auth/active-sessions', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.sessions || [];
      }
    } catch (err) {
      console.warn('Failed to fetch active sessions:', err);
    }
    return [];
  },

  async revokeSession(sessionId: string): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;
    try {
      const res = await fetch(`/api/auth/sessions/${sessionId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async recoverPassword(email: string, recoveryKey: string, newPassword: string): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch('/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, recoveryKey, newPassword }),
      });
      const data = await res.json();
      return { success: res.ok, message: data.message, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message || 'Recovery failed' };
    }
  },

  async getUsers(): Promise<AdminUser[]> {
    const token = this.getToken();
    if (!token) return [];
    try {
      const res = await fetch('/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        return data.users || [];
      }
    } catch (err) {
      console.warn('Failed to fetch users:', err);
    }
    return [];
  },

  async createUser(user: { email: string; name: string; password: string; role: UserRole; permissions: string[] }): Promise<{ success: boolean; user?: AdminUser; error?: string }> {
    const token = this.getToken();
    try {
      const res = await fetch('/api/auth/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(user),
      });
      const data = await res.json();
      return { success: res.ok, user: data.user, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },

  async updateUser(id: string, updates: Partial<AdminUser> & { password?: string }): Promise<boolean> {
    const token = this.getToken();
    try {
      const res = await fetch(`/api/auth/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async deleteUser(id: string): Promise<boolean> {
    const token = this.getToken();
    try {
      const res = await fetch(`/api/auth/users/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  async getAuditLogs(params: { page?: number; limit?: number; search?: string; category?: string; action?: string } = {}): Promise<{
    logs: AuditLog[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const token = this.getToken();
    const query = new URLSearchParams();
    if (params.page) query.set('page', String(params.page));
    if (params.limit) query.set('limit', String(params.limit));
    if (params.search) query.set('search', params.search);
    if (params.category) query.set('category', params.category);
    if (params.action) query.set('action', params.action);

    try {
      const res = await fetch(`/api/audit-logs?${query.toString()}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (err) {
      console.warn('Failed to fetch audit logs:', err);
    }
    return { logs: [], total: 0, page: 1, totalPages: 1 };
  },

  async exportAuditLogsCsv(): Promise<void> {
    const token = this.getToken();
    try {
      const res = await fetch('/api/audit-logs/export', {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `plush-comfort-audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Failed to export audit logs:', err);
    }
  },

  async logAudit(action: string, category: string, target: string, details: string, beforeAfter?: Record<string, { before: any; after: any }>): Promise<void> {
    const token = this.getToken();
    if (!token) return;
    try {
      await fetch('/api/audit-logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ action, category, target, details, beforeAfter }),
      });
    } catch (err) {
      console.warn('Could not record audit log:', err);
    }
  },

  async uploadImage(base64Data: string, filename: string, alt?: string): Promise<{ success: boolean; url?: string; filename?: string; error?: string }> {
    const token = this.getToken();
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: base64Data, filename, alt }),
      });
      const data = await res.json();
      return { success: res.ok, url: data.url, filename: data.filename, error: data.error };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  },
};
