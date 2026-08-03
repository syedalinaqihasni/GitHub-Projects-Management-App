import React, { useState } from 'react';
import { Plus, Search, Filter, Bug, Lightbulb, FileText, HelpCircle, CheckSquare, AlertCircle, Clock, User, Tag } from 'lucide-react';
import { Issue, User as UserType, Label, FilterOptions } from '../types';
import { formatRelativeTime } from '../utils/helpers';

interface IssuesViewProps {
  issues: Issue[];
  currentUser: UserType;
  onCreateIssue: () => void;
  onSelectIssue: (issue: Issue) => void;
  onUpdateIssue: (issueId: string, updates: Partial<Issue>) => void;
}

export function IssuesView({ issues, currentUser, onCreateIssue, onSelectIssue, onUpdateIssue }: IssuesViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({});
  const [showFilters, setShowFilters] = useState(false);

  const getIssueIcon = (type: Issue['type']) => {
    switch (type) {
      case 'bug': return <Bug className="w-4 h-4 text-red-600" />;
      case 'feature': return <Lightbulb className="w-4 h-4 text-yellow-600" />;
      case 'enhancement': return <CheckSquare className="w-4 h-4 text-blue-600" />;
      case 'documentation': return <FileText className="w-4 h-4 text-green-600" />;
      case 'question': return <HelpCircle className="w-4 h-4 text-purple-600" />;
      case 'task': return <CheckSquare className="w-4 h-4 text-gray-600" />;
      default: return <AlertCircle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: Issue['priority']) => {
    switch (priority) {
      case 'critical': return 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'urgent': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getStateColor = (state: Issue['state']) => {
    switch (state) {
      case 'open': return 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'closed': return 'text-purple-700 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      case 'draft': return 'text-gray-700 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const filteredIssues = issues.filter(issue => {
    if (searchQuery && !issue.title.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !issue.description?.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.assignee && !issue.assignees.some(a => a.id === filters.assignee)) {
      return false;
    }
    if (filters.labels && filters.labels.length > 0 && 
        !filters.labels.some(labelId => issue.labels.some(l => l.id === labelId))) {
      return false;
    }
    if (filters.priority && issue.priority !== filters.priority) {
      return false;
    }
    if (filters.status && issue.state !== filters.status) {
      return false;
    }
    if (filters.type && issue.type !== filters.type) {
      return false;
    }
    return true;
  });

  const openIssues = filteredIssues.filter(i => i.state === 'open');
  const closedIssues = filteredIssues.filter(i => i.state === 'closed');

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Issues</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track bugs, feature requests, and tasks across your projects
          </p>
        </div>
        
        <button
          onClick={onCreateIssue}
          className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          New Issue
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
              <AlertCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{openIssues.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Open</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
              <CheckSquare className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{closedIssues.length}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Closed</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-100 dark:bg-red-900/20 rounded-lg flex items-center justify-center mr-3">
              <Bug className="w-4 h-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {issues.filter(i => i.type === 'bug' && i.state === 'open').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Bugs</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mr-3">
              <Lightbulb className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {issues.filter(i => i.type === 'feature' && i.state === 'open').length}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Features</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search issues..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              showFilters 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredIssues.length} of {issues.length} issues
        </div>
      </div>

      {/* Issues List */}
      {filteredIssues.length > 0 ? (
        <div className="space-y-3">
          {filteredIssues.map((issue) => (
            <div
              key={issue.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-sm cursor-pointer"
              onClick={() => onSelectIssue(issue)}
            >
              <div className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIssueIcon(issue.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {issue.title}
                        </h3>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            #{issue.number}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            opened {formatRelativeTime(issue.createdAt)} by {issue.author.name}
                          </span>
                        </div>
                        
                        {issue.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                            {issue.description}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStateColor(issue.state)}`}>
                          {issue.state}
                        </span>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                          {issue.priority}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center space-x-4">
                        {/* Labels */}
                        {issue.labels.length > 0 && (
                          <div className="flex items-center space-x-1">
                            <Tag className="w-3 h-3 text-gray-400" />
                            <div className="flex space-x-1">
                              {issue.labels.slice(0, 3).map((label) => (
                                <span
                                  key={label.id}
                                  className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                                  style={{
                                    backgroundColor: `${label.color}20`,
                                    color: label.color,
                                  }}
                                >
                                  {label.name}
                                </span>
                              ))}
                              {issue.labels.length > 3 && (
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  +{issue.labels.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                        
                        {/* Comments */}
                        {issue.comments.length > 0 && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <span>{issue.comments.length} comments</span>
                          </div>
                        )}
                        
                        {/* Due Date */}
                        {issue.dueDate && (
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Clock className="w-3 h-3 mr-1" />
                            <span>Due {formatRelativeTime(issue.dueDate)}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Assignees */}
                      <div className="flex items-center space-x-2">
                        {issue.assignees.length > 0 ? (
                          <div className="flex -space-x-1">
                            {issue.assignees.slice(0, 3).map((assignee) => (
                              <img
                                key={assignee.id}
                                src={assignee.avatar}
                                alt={assignee.name}
                                className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                                title={assignee.name}
                              />
                            ))}
                            {issue.assignees.length > 3 && (
                              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                                  +{issue.assignees.length - 3}
                                </span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <User className="w-3 h-3 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <AlertCircle className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">
            {searchQuery ? 'No issues found matching your search' : 'No issues yet'}
          </div>
          {!searchQuery && (
            <button
              onClick={onCreateIssue}
              className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create your first issue
            </button>
          )}
        </div>
      )}
    </div>
  );
}