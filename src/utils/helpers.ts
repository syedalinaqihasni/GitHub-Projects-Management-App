import { User, Project, Label, Card, Column, ProjectTemplate } from '../types';

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInMinutes < 1) return 'just now';
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays < 7) return `${diffInDays}d ago`;
  
  return formatDate(date);
}

export function generateMockData() {
  const users: User[] = [
    {
      id: generateId(),
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      role: 'admin',
    },
    {
      id: generateId(),
      name: 'Jane Smith',
      email: 'jane@example.com',
      avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      role: 'member',
    },
    {
      id: generateId(),
      name: 'Mike Johnson',
      email: 'mike@example.com',
      avatar: 'https://images.pexels.com/photos/697509/pexels-photo-697509.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop&crop=face',
      role: 'member',
    },
  ];

  return {
    currentUser: users[0],
    users,
  };
}

export function getProjectTemplates(): ProjectTemplate[] {
  return [
    {
      id: 'kanban',
      name: 'Kanban Board',
      description: 'Simple kanban board with To Do, In Progress, and Done columns',
      columns: [
        { title: 'To Do', color: '#6b7280', position: 0, isCollapsed: false },
        { title: 'In Progress', color: '#3b82f6', position: 1, isCollapsed: false },
        { title: 'Done', color: '#10b981', position: 2, isCollapsed: false },
      ],
      labels: [
        { name: 'bug', color: '#ef4444', description: 'Something isn\'t working' },
        { name: 'enhancement', color: '#3b82f6', description: 'New feature or request' },
      ],
    },
    {
      id: 'scrum',
      name: 'Scrum Board',
      description: 'Agile development board with sprint planning',
      columns: [
        { title: 'Backlog', color: '#6b7280', position: 0, isCollapsed: false },
        { title: 'Sprint Planning', color: '#f59e0b', position: 1, isCollapsed: false },
        { title: 'In Progress', color: '#3b82f6', position: 2, isCollapsed: false },
        { title: 'Review', color: '#8b5cf6', position: 3, isCollapsed: false },
        { title: 'Done', color: '#10b981', position: 4, isCollapsed: false },
      ],
      labels: [
        { name: 'story', color: '#10b981', description: 'User story' },
        { name: 'epic', color: '#8b5cf6', description: 'Epic story' },
        { name: 'bug', color: '#ef4444', description: 'Bug fix' },
        { name: 'spike', color: '#f59e0b', description: 'Research task' },
      ],
    },
    {
      id: 'feature-development',
      name: 'Feature Development',
      description: 'Feature development workflow with design and testing phases',
      columns: [
        { title: 'Ideas', color: '#6b7280', position: 0, isCollapsed: false },
        { title: 'Design', color: '#f59e0b', position: 1, isCollapsed: false },
        { title: 'Development', color: '#3b82f6', position: 2, isCollapsed: false },
        { title: 'Testing', color: '#8b5cf6', position: 3, isCollapsed: false },
        { title: 'Ready for Release', color: '#10b981', position: 4, isCollapsed: false },
      ],
      labels: [
        { name: 'frontend', color: '#3b82f6', description: 'Frontend development' },
        { name: 'backend', color: '#059669', description: 'Backend development' },
        { name: 'design', color: '#f59e0b', description: 'Design work' },
        { name: 'testing', color: '#8b5cf6', description: 'Testing required' },
      ],
    },
  ];
}

export function exportToJSON(data: any, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function importFromJSON<T>(file: File): Promise<T> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Error reading file'));
    reader.readAsText(file);
  });
}