import React, { useState } from 'react';
import { Plus, Download, Upload, Search } from 'lucide-react';
import { Project, ExportData } from '../types';
import { ProjectCard } from './ProjectCard';
import { CreateProjectModal } from './CreateProjectModal';
import { ImportModal } from './ImportModal';
import { exportToJSON } from '../utils/helpers';

interface ProjectsViewProps {
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onCreateProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'columns' | 'labels'>) => void;
  onEditProject: (projectId: string, updates: Partial<Project>) => void;
  onDeleteProject: (projectId: string) => void;
  onExportProject: (projectId: string) => ExportData | null;
  onImportProject: (data: ExportData) => void;
}

export function ProjectsView({ 
  projects, 
  onSelectProject, 
  onCreateProject, 
  onEditProject,
  onDeleteProject, 
  onExportProject,
  onImportProject 
}: ProjectsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleExport = (projectId: string) => {
    const exportData = onExportProject(projectId);
    if (exportData) {
      const project = projects.find(p => p.id === projectId);
      const filename = `${project?.title.replace(/\s+/g, '_').toLowerCase()}_export.json`;
      exportToJSON(exportData, filename);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setShowCreateModal(true);
  };

  const handleCreateOrUpdate = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'columns' | 'labels'>) => {
    if (editingProject) {
      onEditProject(editingProject.id, projectData);
      setEditingProject(null);
    } else {
      onCreateProject(projectData);
    }
    setShowCreateModal(false);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Projects</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your projects and track progress across teams
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowImportModal(true)}
            className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 rounded-lg hover:text-gray-900 dark:hover:text-white hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Import
          </button>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>
      </div>

      {/* Search and Stats */}
      <div className="flex items-center justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {filteredProjects.length} of {projects.length} projects
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onSelect={onSelectProject}
              onEdit={handleEdit}
              onDelete={onDeleteProject}
              onExport={handleExport}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-lg mb-4">
            {searchQuery ? 'No projects found matching your search' : 'No projects yet'}
          </div>
          {!searchQuery && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create your first project
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      {showCreateModal && (
        <CreateProjectModal
          project={editingProject}
          onClose={() => {
            setShowCreateModal(false);
            setEditingProject(null);
          }}
          onCreate={handleCreateOrUpdate}
        />
      )}

      {showImportModal && (
        <ImportModal
          onClose={() => setShowImportModal(false)}
          onImport={onImportProject}
        />
      )}
    </div>
  );
}