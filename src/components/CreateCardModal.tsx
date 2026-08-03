import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { Project, Card } from '../types';

interface CreateCardModalProps {
  project: Project;
  columnId: string;
  onClose: () => void;
  onCreate: (cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'position' | 'comments'>) => void;
}

export function CreateCardModal({ project, columnId, onClose, onCreate }: CreateCardModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Card['priority']>('medium');
  const [dueDate, setDueDate] = useState('');
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const column = project.columns.find(c => c.id === columnId);
    if (!column) return;

    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      priority,
      status: column.title,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      labels: project.labels.filter(l => selectedLabels.includes(l.id)),
      assignees: project.members.filter(m => selectedAssignees.includes(m.id)),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Card</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
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
              placeholder="Enter card title"
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
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Add a description..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as Card['priority'])}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Due Date */}
            <div>
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
          </div>

          {/* Assignees */}
          {project.members.length > 0 && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Assignees
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {project.members.map((member) => (
                  <label key={member.id} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={selectedAssignees.includes(member.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedAssignees([...selectedAssignees, member.id]);
                        } else {
                          setSelectedAssignees(selectedAssignees.filter(id => id !== member.id));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-6 h-6 rounded-full ml-2 mr-2"
                    />
                    <span className="text-sm text-gray-900 dark:text-white">{member.name}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Labels */}
          {project.labels.length > 0 && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Labels
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {project.labels.map((label) => (
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

          {/* Actions */}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Card
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}