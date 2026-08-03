import React from 'react';
import { Calendar, Users, Activity, MoreHorizontal, Download, Upload, Trash2, Edit } from 'lucide-react';
import { Project } from '../types';
import { formatRelativeTime } from '../utils/helpers';

interface ProjectCardProps {
  project: Project;
  onSelect: (project: Project) => void;
  onEdit: (project: Project) => void;
  onDelete: (projectId: string) => void;
  onExport: (projectId: string) => void;
}

export function ProjectCard({ project, onSelect, onEdit, onDelete, onExport }: ProjectCardProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const totalCards = project.columns.reduce((sum, column) => sum + column.cards.length, 0);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <h3 
              className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              onClick={() => onSelect(project)}
            >
              {project.title}
            </h3>
            {project.description && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
          
          <div className="relative ml-4">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onEdit(project);
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Project
                  </button>
                  <button
                    onClick={() => {
                      onExport(project.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 w-full text-left"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Project
                  </button>
                  <hr className="my-1 border-gray-200 dark:border-gray-600" />
                  <button
                    onClick={() => {
                      onDelete(project.id);
                      setShowMenu(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 w-full text-left"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Project
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Activity className="w-4 h-4 mr-1" />
              <span>{totalCards} cards</span>
            </div>
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              <span>{project.members.length} members</span>
            </div>
          </div>
          
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>Updated {formatRelativeTime(project.updatedAt)}</span>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              project.visibility === 'public' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {project.visibility}
            </span>
          </div>

          <div className="flex -space-x-2">
            {project.members.slice(0, 3).map((member, index) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800"
                title={member.name}
              />
            ))}
            {project.members.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  +{project.members.length - 3}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}