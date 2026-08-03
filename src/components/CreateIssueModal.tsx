import React, { useState } from 'react';
import { X, Plus, Bug, Lightbulb, FileText, HelpCircle, CheckSquare, AlertCircle } from 'lucide-react';
import { Issue, User, Label, Milestone, Project } from '../types';

interface CreateIssueModalProps {
  issue?: Issue | null;
  projects: Project[];
  currentUser: User;
  onClose: () => void;
  onCreate: (issueData: Omit<Issue, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'comments' | 'linkedIssues' | 'attachments' | 'watchers' | 'reactions'>) => void;
}

export function CreateIssueModal({ issue, projects, currentUser, onClose, onCreate }: CreateIssueModalProps) {
  const [title, setTitle] = useState(issue?.title || '');
  const [description, setDescription] = useState(issue?.description || '');
  const [type, setType] = useState<Issue['type']>(issue?.type || 'bug');
  const [priority, setPriority] = useState<Issue['priority']>(issue?.priority || 'medium');
  const [severity, setSeverity] = useState<Issue['severity']>(issue?.severity || 'minor');
  const [selectedProject, setSelectedProject] = useState(issue?.project || '');
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>(issue?.assignees.map(a => a.id) || []);
  const [selectedLabels, setSelectedLabels] = useState<string[]>(issue?.labels.map(l => l.id) || []);
  const [dueDate, setDueDate] = useState(issue?.dueDate ? new Date(issue.dueDate).toISOString().split('T')[0] : '');
  const [estimatedHours, setEstimatedHours] = useState(issue?.estimatedHours?.toString() || '');

  const isEditing = !!issue;
  const selectedProjectData = projects.find(p => p.id === selectedProject);

  const getTypeIcon = (type: Issue['type']) => {
    switch (type) {
      case 'bug': return <Bug className="w-4 h-4" />;
      case 'feature': return <Lightbulb className="w-4 h-4" />;
      case 'enhancement': return <CheckSquare className="w-4 h-4" />;
      case 'documentation': return <FileText className="w-4 h-4" />;
      case 'question': return <HelpCircle className="w-4 h-4" />;
      case 'task': return <CheckSquare className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const projectData = selectedProjectData;
    const assignees = projectData ? projectData.members
      .filter(m => selectedAssignees.includes(m.user.id))
      .map(m => m.user) : [];
    const labels = projectData ? projectData.labels
      .filter(l => selectedLabels.includes(l.id)) : [];

    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      state: 'open',
      type,
      priority,
      severity,
      assignees,
      labels,
      milestone: undefined,
      project: selectedProject || undefined,
      repository: undefined,
      author: currentUser,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
      actualHours: undefined,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            {isEditing ? 'Edit Issue' : 'Create New Issue'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex overflow-hidden h-full">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Title */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter issue title"
                required
              />
            </div>

            {/* Description */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe the issue in detail..."
              />
            </div>

            {/* Type */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(['bug', 'feature', 'enhancement', 'documentation', 'question', 'task'] as const).map((typeOption) => (
                  <label key={typeOption} className="flex items-center p-3 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="radio"
                      value={typeOption}
                      checked={type === typeOption}
                      onChange={(e) => setType(e.target.value as Issue['type'])}
                      className="sr-only"
                    />
                    <div className={`flex items-center space-x-2 ${type === typeOption ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}`}>
                      {getTypeIcon(typeOption)}
                      <span className="text-sm font-medium capitalize">{typeOption}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Project */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Project
              </label>
              <select
                value={selectedProject}
                onChange={(e) => setSelectedProject(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">No project</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Assignees */}
            {selectedProjectData && selectedProjectData.members.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Assignees
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedProjectData.members.map((member) => (
                    <label key={member.user.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedAssignees.includes(member.user.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedAssignees([...selectedAssignees, member.user.id]);
                          } else {
                            setSelectedAssignees(selectedAssignees.filter(id => id !== member.user.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <img
                        src={member.user.avatar}
                        alt={member.user.name}
                        className="w-6 h-6 rounded-full ml-2 mr-2"
                      />
                      <span className="text-sm text-gray-900 dark:text-white">{member.user.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Labels */}
            {selectedProjectData && selectedProjectData.labels.length > 0 && (
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Labels
                </label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {selectedProjectData.labels.map((label) => (
                    <label key={label.id} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedLabels.includes(label.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedLabels([...selectedLabels, label.id]);
                          } else {
                            setSelectedLabels(selectedLabels.filter(id => id !== label.id));
                          }
                        }}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <div
                        className="w-4 h-4 rounded ml-2 mr-2"
                        style={{ backgroundColor: label.color }}
                      />
                      <span className="text-sm text-gray-900 dark:text-white">{label.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
            {/* Priority */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Issue['priority'])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Severity */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Severity
              </label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value as Issue['severity'])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="minor">Minor</option>
                <option value="major">Major</option>
                <option value="critical">Critical</option>
                <option value="blocker">Blocker</option>
              </select>
            </div>

            {/* Due Date */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Estimated Hours */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Estimated Hours
              </label>
              <input
                type="number"
                value={estimatedHours}
                onChange={(e) => setEstimatedHours(e.target.value)}
                min="0"
                step="0.5"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              <button
                type="submit"
                disabled={!title.trim()}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                {isEditing ? 'Update Issue' : 'Create Issue'}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}