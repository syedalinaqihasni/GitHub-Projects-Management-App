import { Project, Issue, Team, ExportData, ImportOptions } from '../types';

const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.yourapp.com' 
  : 'http://localhost:3001/api';

class APIClient {
  private baseURL: string;
  private token: string | null = null;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
    this.token = localStorage.getItem('api_token');
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('api_token', token);
  }

  private async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Projects API
  async getProjects(params?: { page?: number; limit?: number; search?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);
    
    const query = searchParams.toString();
    return this.request<{ projects: Project[]; pagination: any }>(`/projects${query ? `?${query}` : ''}`);
  }

  async getProject(id: string) {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) {
    return this.request<Project>('/projects', {
      method: 'POST',
      body: JSON.stringify(project),
    });
  }

  async updateProject(id: string, updates: Partial<Project>) {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteProject(id: string) {
    return this.request<{ success: boolean }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  async exportProject(id: string, format: 'json' | 'csv' | 'xml' = 'json') {
    return this.request<ExportData>(`/projects/${id}/export?format=${format}`);
  }

  async importProject(data: ExportData, options: ImportOptions) {
    return this.request<Project>('/projects/import', {
      method: 'POST',
      body: JSON.stringify({ data, options }),
    });
  }

  // Cards API
  async getCards(projectId: string, columnId?: string) {
    const query = columnId ? `?column=${columnId}` : '';
    return this.request<{ cards: any[]; total: number }>(`/projects/${projectId}/cards${query}`);
  }

  async createCard(projectId: string, card: any) {
    return this.request<any>(`/projects/${projectId}/cards`, {
      method: 'POST',
      body: JSON.stringify(card),
    });
  }

  async updateCard(projectId: string, cardId: string, updates: any) {
    return this.request<any>(`/projects/${projectId}/cards/${cardId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async moveCard(projectId: string, cardId: string, targetColumnId: string, position: number) {
    return this.request<any>(`/projects/${projectId}/cards/${cardId}/move`, {
      method: 'POST',
      body: JSON.stringify({ targetColumnId, position }),
    });
  }

  // Issues API
  async getIssues(params?: { state?: string; assignee?: string; labels?: string[]; page?: number }) {
    const searchParams = new URLSearchParams();
    if (params?.state) searchParams.append('state', params.state);
    if (params?.assignee) searchParams.append('assignee', params.assignee);
    if (params?.labels) params.labels.forEach(label => searchParams.append('labels', label));
    if (params?.page) searchParams.append('page', params.page.toString());
    
    const query = searchParams.toString();
    return this.request<{ issues: Issue[]; total: number }>(`/issues${query ? `?${query}` : ''}`);
  }

  async getIssue(id: string) {
    return this.request<Issue>(`/issues/${id}`);
  }

  async createIssue(issue: Omit<Issue, 'id' | 'number' | 'createdAt' | 'updatedAt'>) {
    return this.request<Issue>('/issues', {
      method: 'POST',
      body: JSON.stringify(issue),
    });
  }

  async updateIssue(id: string, updates: Partial<Issue>) {
    return this.request<Issue>(`/issues/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async closeIssue(id: string) {
    return this.request<Issue>(`/issues/${id}/close`, {
      method: 'POST',
    });
  }

  async addIssueComment(id: string, content: string) {
    return this.request<any>(`/issues/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // Teams API
  async getTeams(params?: { privacy?: string }) {
    const searchParams = new URLSearchParams();
    if (params?.privacy) searchParams.append('privacy', params.privacy);
    
    const query = searchParams.toString();
    return this.request<{ teams: Team[]; total: number }>(`/teams${query ? `?${query}` : ''}`);
  }

  async getTeam(id: string) {
    return this.request<Team>(`/teams/${id}`);
  }

  async createTeam(team: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'members'>) {
    return this.request<Team>('/teams', {
      method: 'POST',
      body: JSON.stringify(team),
    });
  }

  async updateTeam(id: string, updates: Partial<Team>) {
    return this.request<Team>(`/teams/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async addTeamMember(teamId: string, userId: string, role: 'maintainer' | 'member') {
    return this.request<any>(`/teams/${teamId}/members`, {
      method: 'POST',
      body: JSON.stringify({ userId, role }),
    });
  }

  async removeTeamMember(teamId: string, userId: string) {
    return this.request<any>(`/teams/${teamId}/members/${userId}`, {
      method: 'DELETE',
    });
  }

  // Webhooks API
  async createWebhook(url: string, events: string[], secret?: string) {
    return this.request<any>('/webhooks', {
      method: 'POST',
      body: JSON.stringify({ url, events, secret }),
    });
  }

  async getWebhooks() {
    return this.request<any[]>('/webhooks');
  }

  async deleteWebhook(id: string) {
    return this.request<any>(`/webhooks/${id}`, {
      method: 'DELETE',
    });
  }

  // Bulk Operations
  async bulkExport(projectIds: string[], format: 'json' | 'csv' | 'xml' = 'json') {
    return this.request<any>('/bulk/export', {
      method: 'POST',
      body: JSON.stringify({ projectIds, format }),
    });
  }

  async bulkImport(data: any[], options: ImportOptions) {
    return this.request<any>('/bulk/import', {
      method: 'POST',
      body: JSON.stringify({ data, options }),
    });
  }

  // Analytics API
  async getProjectAnalytics(projectId: string, dateRange?: { start: Date; end: Date }) {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('start', dateRange.start.toISOString());
      params.append('end', dateRange.end.toISOString());
    }
    
    const query = params.toString();
    return this.request<any>(`/projects/${projectId}/analytics${query ? `?${query}` : ''}`);
  }

  async getTeamAnalytics(teamId: string, dateRange?: { start: Date; end: Date }) {
    const params = new URLSearchParams();
    if (dateRange) {
      params.append('start', dateRange.start.toISOString());
      params.append('end', dateRange.end.toISOString());
    }
    
    const query = params.toString();
    return this.request<any>(`/teams/${teamId}/analytics${query ? `?${query}` : ''}`);
  }
}

export const apiClient = new APIClient();

// Export utility functions for common operations
export const exportProjectAsJSON = async (projectId: string) => {
  try {
    const data = await apiClient.exportProject(projectId, 'json');
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `project-${projectId}-export.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Export failed:', error);
    throw error;
  }
};

export const importProjectFromJSON = async (file: File, options: ImportOptions) => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    return await apiClient.importProject(data, options);
  } catch (error) {
    console.error('Import failed:', error);
    throw error;
  }
};

export const syncWithAPI = async (localData: any, endpoint: string) => {
  try {
    // Compare local data with server data and sync differences
    const serverData = await apiClient.request(endpoint);
    
    // Implement conflict resolution logic here
    // This is a simplified example
    return serverData;
  } catch (error) {
    console.error('Sync failed:', error);
    throw error;
  }
};