export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  username: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  bio?: string;
  location?: string;
  website?: string;
  company?: string;
  joinedAt: Date;
  lastActive: Date;
  isOnline: boolean;
  permissions: Permission[];
}

export interface Permission {
  id: string;
  name: string;
  description: string;
  scope: 'project' | 'team' | 'organization';
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  avatar?: string;
  slug: string;
  privacy: 'public' | 'private';
  members: TeamMember[];
  projects: string[]; // Project IDs
  repositories: Repository[];
  createdAt: Date;
  updatedAt: Date;
  settings: TeamSettings;
}

export interface TeamMember {
  user: User;
  role: 'maintainer' | 'member';
  joinedAt: Date;
  permissions: Permission[];
}

export interface TeamSettings {
  allowMemberInvites: boolean;
  requireApprovalForNewMembers: boolean;
  defaultMemberRole: 'maintainer' | 'member';
  visibility: 'public' | 'private';
}

export interface Repository {
  id: string;
  name: string;
  description?: string;
  url: string;
  isPrivate: boolean;
  language: string;
  stars: number;
  forks: number;
  issues: number;
  pullRequests: number;
  lastCommit: Date;
}

export interface Issue {
  id: string;
  number: number;
  title: string;
  description?: string;
  state: 'open' | 'closed' | 'draft';
  type: 'bug' | 'feature' | 'enhancement' | 'documentation' | 'question' | 'task';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  severity: 'minor' | 'major' | 'critical' | 'blocker';
  assignees: User[];
  labels: Label[];
  milestone?: Milestone;
  project?: string; // Project ID
  repository?: string; // Repository ID
  author: User;
  createdAt: Date;
  updatedAt: Date;
  closedAt?: Date;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  comments: Comment[];
  linkedIssues: LinkedIssue[];
  attachments: Attachment[];
  watchers: User[];
  reactions: Reaction[];
}

export interface LinkedIssue {
  id: string;
  type: 'blocks' | 'blocked_by' | 'relates_to' | 'duplicates' | 'duplicated_by';
  issue: Issue;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedBy: User;
  uploadedAt: Date;
}

export interface Reaction {
  id: string;
  emoji: string;
  user: User;
  createdAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  state: 'open' | 'closed';
  dueDate?: Date;
  progress: number;
  issues: string[]; // Issue IDs
  createdAt: Date;
  updatedAt: Date;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  description?: string;
  isDefault: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: Date;
  updatedAt?: Date;
  isEdited: boolean;
  reactions: Reaction[];
  mentions: User[];
}

export interface Card {
  id: string;
  title: string;
  description?: string;
  assignees: User[];
  labels: Label[];
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  status: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  comments: Comment[];
  position: number;
  linkedIssue?: string; // Issue ID
  attachments: Attachment[];
  watchers: User[];
  customFields: CustomField[];
}

export interface CustomField {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'url';
  value: any;
  options?: string[]; // For select/multiselect fields
}

export interface Column {
  id: string;
  title: string;
  color: string;
  cards: Card[];
  position: number;
  isCollapsed: boolean;
  limits?: ColumnLimits;
  automation?: ColumnAutomation[];
}

export interface ColumnLimits {
  minCards?: number;
  maxCards?: number;
  warnAt?: number;
}

export interface ColumnAutomation {
  id: string;
  trigger: 'card_added' | 'card_moved' | 'card_updated' | 'due_date_approaching';
  action: 'assign_user' | 'add_label' | 'send_notification' | 'move_to_column' | 'set_priority';
  conditions: AutomationCondition[];
  parameters: Record<string, any>;
  isActive: boolean;
}

export interface AutomationCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
  value: any;
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  visibility: 'public' | 'private';
  owner: User;
  team?: Team;
  members: ProjectMember[];
  columns: Column[];
  labels: Label[];
  milestones: Milestone[];
  createdAt: Date;
  updatedAt: Date;
  template?: string;
  settings: ProjectSettings;
  integrations: Integration[];
  customFields: CustomFieldDefinition[];
}

export interface ProjectMember {
  user: User;
  role: 'admin' | 'write' | 'read';
  joinedAt: Date;
  permissions: Permission[];
}

export interface ProjectSettings {
  allowPublicView: boolean;
  requireApprovalForNewMembers: boolean;
  enableAutomation: boolean;
  enableTimeTracking: boolean;
  defaultView: 'board' | 'table' | 'timeline' | 'calendar';
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  slackIntegration?: string;
  discordIntegration?: string;
}

export interface Integration {
  id: string;
  type: 'github' | 'slack' | 'discord' | 'jira' | 'trello' | 'asana' | 'webhook';
  name: string;
  config: Record<string, any>;
  isActive: boolean;
  createdAt: Date;
}

export interface CustomFieldDefinition {
  id: string;
  name: string;
  type: 'text' | 'number' | 'date' | 'select' | 'multiselect' | 'checkbox' | 'url';
  isRequired: boolean;
  options?: string[];
  defaultValue?: any;
}

export interface Activity {
  id: string;
  type: 'card_created' | 'card_moved' | 'card_updated' | 'card_deleted' | 'comment_added' | 
        'member_added' | 'member_removed' | 'project_created' | 'project_updated' | 
        'issue_created' | 'issue_closed' | 'milestone_created' | 'team_created';
  actor: User;
  target: {
    type: 'card' | 'column' | 'project' | 'issue' | 'milestone' | 'team' | 'user';
    id: string;
    title: string;
  };
  metadata?: Record<string, any>;
  timestamp: Date;
  project?: string;
  team?: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: 'software' | 'marketing' | 'design' | 'research' | 'general';
  columns: Omit<Column, 'id' | 'cards'>[];
  labels: Omit<Label, 'id'>[];
  customFields: CustomFieldDefinition[];
  automations: ColumnAutomation[];
  isPublic: boolean;
  usageCount: number;
  rating: number;
  author: User;
  createdAt: Date;
}

export interface FilterOptions {
  assignee?: string;
  labels?: string[];
  priority?: string;
  status?: string;
  search?: string;
  dueDate?: 'overdue' | 'today' | 'week' | 'month';
  milestone?: string;
  author?: string;
  type?: string;
  team?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export interface ExportData {
  project: Project;
  issues: Issue[];
  activities: Activity[];
  exportedAt: Date;
  version: string;
  metadata: {
    totalCards: number;
    totalIssues: number;
    totalMembers: number;
    exportFormat: 'full' | 'minimal';
  };
}

export interface ImportOptions {
  includeActivities: boolean;
  includeComments: boolean;
  includeAttachments: boolean;
  mergeStrategy: 'replace' | 'merge' | 'skip_existing';
  teamMapping?: Record<string, string>;
  userMapping?: Record<string, string>;
}

export interface Notification {
  id: string;
  type: 'mention' | 'assignment' | 'comment' | 'due_date' | 'milestone' | 'team_invite';
  title: string;
  message: string;
  recipient: User;
  sender?: User;
  relatedEntity: {
    type: 'project' | 'issue' | 'card' | 'team';
    id: string;
    title: string;
  };
  isRead: boolean;
  createdAt: Date;
  actionUrl?: string;
}

export interface TimeEntry {
  id: string;
  user: User;
  issue?: string;
  card?: string;
  project: string;
  description?: string;
  hours: number;
  date: Date;
  createdAt: Date;
  billable: boolean;
  approved: boolean;
}

export interface Report {
  id: string;
  name: string;
  type: 'burndown' | 'velocity' | 'time_tracking' | 'team_performance' | 'issue_analytics';
  project?: string;
  team?: string;
  dateRange: {
    start: Date;
    end: Date;
  };
  data: any;
  generatedAt: Date;
  generatedBy: User;
}

export interface APIEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  parameters?: APIParameter[];
  response: any;
}

export interface APIParameter {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'array';
  required: boolean;
  description: string;
  example?: any;
}