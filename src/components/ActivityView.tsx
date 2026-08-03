import React from 'react';
import { Activity as ActivityIcon, Clock, Users, GitCommit, MessageCircle, Plus, Trash2 } from 'lucide-react';
import { Activity } from '../types';
import { formatRelativeTime } from '../utils/helpers';

interface ActivityViewProps {
  activities: Activity[];
}

export function ActivityView({ activities }: ActivityViewProps) {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'card_created': return <Plus className="w-4 h-4" />;
      case 'card_moved': return <GitCommit className="w-4 h-4" />;
      case 'card_updated': return <ActivityIcon className="w-4 h-4" />;
      case 'card_deleted': return <Trash2 className="w-4 h-4" />;
      case 'comment_added': return <MessageCircle className="w-4 h-4" />;
      case 'member_added': return <Users className="w-4 h-4" />;
      default: return <ActivityIcon className="w-4 h-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'card_created': return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/20';
      case 'card_moved': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/20';
      case 'card_updated': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20';
      case 'card_deleted': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/20';
      case 'comment_added': return 'text-purple-600 bg-purple-100 dark:text-purple-400 dark:bg-purple-900/20';
      case 'member_added': return 'text-indigo-600 bg-indigo-100 dark:text-indigo-400 dark:bg-indigo-900/20';
      default: return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getActivityDescription = (activity: Activity) => {
    switch (activity.type) {
      case 'card_created':
        return `created card "${activity.target.title}"`;
      case 'card_moved':
        return `moved card "${activity.target.title}"`;
      case 'card_updated':
        return `updated card "${activity.target.title}"`;
      case 'card_deleted':
        return `deleted card "${activity.target.title}"`;
      case 'comment_added':
        return `commented on "${activity.target.title}"`;
      case 'member_added':
        return `added member to project`;
      default:
        return `performed an action on "${activity.target.title}"`;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Activity Feed</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Track all project activities and team collaboration
        </p>
      </div>

      {/* Activity List */}
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {/* Actor Avatar */}
                <img
                  src={activity.actor.avatar}
                  alt={activity.actor.name}
                  className="w-10 h-10 rounded-full"
                />

                {/* Activity Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {activity.actor.name}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      {getActivityDescription(activity)}
                    </span>
                  </div>
                  
                  {activity.metadata && (
                    <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                      {activity.type === 'card_moved' && activity.metadata.from && activity.metadata.to && (
                        <span>from column to column</span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center mt-2 space-x-3">
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getActivityColor(activity.type)}`}>
                      {getActivityIcon(activity.type)}
                      <span className="ml-1 capitalize">{activity.type.replace('_', ' ')}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-4 h-4 mr-1" />
                      {formatRelativeTime(activity.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ActivityIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
          <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No activity yet</div>
          <div className="text-gray-400 dark:text-gray-500">
            Activity will appear here as you work on projects
          </div>
        </div>
      )}
    </div>
  );
}