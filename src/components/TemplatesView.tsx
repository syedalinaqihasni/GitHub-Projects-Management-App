import React from 'react';
import { Folder, Plus, ArrowRight } from 'lucide-react';
import { getProjectTemplates } from '../utils/helpers';

interface TemplatesViewProps {
  onCreateFromTemplate: (templateId: string) => void;
}

export function TemplatesView({ onCreateFromTemplate }: TemplatesViewProps) {
  const templates = getProjectTemplates();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Project Templates</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Start your project with a pre-configured template
        </p>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <div
            key={template.id}
            className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all duration-200 hover:shadow-md"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                    <Folder className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {template.name}
                    </h3>
                  </div>
                </div>
              </div>

              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {template.description}
              </p>

              {/* Template Details */}
              <div className="space-y-3 mb-6">
                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Columns ({template.columns.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.columns.slice(0, 3).map((column, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                      >
                        <div 
                          className="w-2 h-2 rounded-full mr-1"
                          style={{ backgroundColor: column.color }}
                        />
                        {column.title}
                      </span>
                    ))}
                    {template.columns.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{template.columns.length - 3} more
                      </span>
                    )}
                  </div>
                </div>

                <div>
                  <div className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Labels ({template.labels.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {template.labels.slice(0, 3).map((label, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded text-xs font-medium"
                        style={{
                          backgroundColor: `${label.color}20`,
                          color: label.color,
                        }}
                      >
                        {label.name}
                      </span>
                    ))}
                    {template.labels.length > 3 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{template.labels.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onCreateFromTemplate(template.id)}
                className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors group"
              >
                <Plus className="w-4 h-4 mr-2" />
                Use Template
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ))}

        {/* Custom Template Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
          <div className="p-6 text-center">
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Blank Project
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Start with a clean slate and build your own workflow
            </p>
            <button
              onClick={() => onCreateFromTemplate('')}
              className="inline-flex items-center px-4 py-2 text-blue-600 dark:text-blue-400 border border-blue-600 dark:border-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Blank Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}