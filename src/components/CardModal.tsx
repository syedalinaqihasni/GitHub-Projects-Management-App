import React, { useState } from 'react';
import { X, Calendar, User, Tag, MessageCircle, Clock, AlertCircle, Save } from 'lucide-react';
import { Card, Project, Comment } from '../types';
import { formatDate, formatRelativeTime } from '../utils/helpers';

interface CardModalProps {
  card: Card;
  project: Project;
  onClose: () => void;
  onUpdate: (updates: Partial<Card>) => void;
  onAddComment: (content: string) => void;
}

export function CardModal({ card, project, onClose, onUpdate, onAddComment }: CardModalProps) {
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');
  const [priority, setPriority] = useState(card.priority);
  const [dueDate, setDueDate] = useState(card.dueDate ? new Date(card.dueDate).toISOString().split('T')[0] : '');
  const [newComment, setNewComment] = useState('');
  const [selectedLabels, setSelectedLabels] = useState(card.labels.map(l => l.id));
  const [selectedAssignees, setSelectedAssignees] = useState(card.assignees.map(a => a.id));

  const handleSave = () => {
    onUpdate({
      title,
      description: description || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      labels: project.labels.filter(l => selectedLabels.includes(l.id)),
      assignees: project.members.filter(m => selectedAssignees.includes(m.id)),
    });
  };

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment.trim());
      setNewComment('');
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Card</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleSave}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex overflow-hidden h-full">
          {/* Main Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {/* Title */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Card title"
              />
            </div>

            {/* Description */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Add a description..."
              />
            </div>

            {/* Comments */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Comments ({card.comments.length})
              </h3>
              
              {/* Add Comment */}
              <div className="mb-4">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a comment..."
                />
                <button
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Add Comment
                </button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {card.comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3">
                    <img
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-medium text-gray-900 dark:text-white">
                            {comment.author.name}
                          </span>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {formatRelativeTime(comment.createdAt)}
                          </span>
                        </div>
                        <p className="text-gray-700 dark:text-gray-300">{comment.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 overflow-y-auto">
            {/* Priority */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <AlertCircle className="w-4 h-4 mr-2" />
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
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Assignees */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <User className="w-4 h-4 mr-2" />
                Assignees
              </label>
              <div className="space-y-2">
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

            {/* Labels */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
                <Tag className="w-4 h-4 mr-2" />
                Labels
              </label>
              <div className="space-y-2">
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

            {/* Metadata */}
            <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
                <div>Created: {formatDate(card.createdAt)}</div>
                <div>Updated: {formatDate(card.updatedAt)}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}