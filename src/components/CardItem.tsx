import React from 'react';
import { Clock, MessageCircle, User, AlertCircle } from 'lucide-react';
import { Card, Project } from '../types';
import { formatRelativeTime } from '../utils/helpers';

interface CardItemProps {
  card: Card;
  onClick: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  project: Project;
}

export function CardItem({ card, onClick, onDragStart, onDragOver, onDrop, project }: CardItemProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'high': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/20';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'low': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const isOverdue = card.dueDate && new Date(card.dueDate) < new Date();

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onClick={onClick}
      className="bg-white dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 p-3 cursor-pointer hover:shadow-md transition-shadow group"
    >
      {/* Labels */}
      {card.labels.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-2">
          {card.labels.slice(0, 3).map((label) => (
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
          {card.labels.length > 3 && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              +{card.labels.length - 3} more
            </span>
          )}
        </div>
      )}

      {/* Title */}
      <h4 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2">
        {card.title}
      </h4>

      {/* Description */}
      {card.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
          {card.description}
        </p>
      )}

      {/* Priority and Due Date */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(card.priority)}`}>
          {card.priority === 'urgent' && <AlertCircle className="w-3 h-3 mr-1" />}
          {card.priority}
        </span>
        
        {card.dueDate && (
          <div className={`flex items-center text-xs ${isOverdue ? 'text-red-600 dark:text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
            <Clock className="w-3 h-3 mr-1" />
            {formatRelativeTime(new Date(card.dueDate))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {card.comments.length > 0 && (
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <MessageCircle className="w-3 h-3 mr-1" />
              <span className="text-xs">{card.comments.length}</span>
            </div>
          )}
        </div>

        {/* Assignees */}
        <div className="flex -space-x-1">
          {card.assignees.slice(0, 3).map((assignee) => (
            <img
              key={assignee.id}
              src={assignee.avatar}
              alt={assignee.name}
              className="w-5 h-5 rounded-full border border-white dark:border-gray-700"
              title={assignee.name}
            />
          ))}
          {card.assignees.length > 3 && (
            <div className="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-600 border border-white dark:border-gray-700 flex items-center justify-center">
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                +{card.assignees.length - 3}
              </span>
            </div>
          )}
          {card.assignees.length === 0 && (
            <div className="w-5 h-5 rounded-full bg-gray-100 dark:bg-gray-600 border border-white dark:border-gray-700 flex items-center justify-center">
              <User className="w-3 h-3 text-gray-400" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}