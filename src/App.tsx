import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { ProjectsView } from './components/ProjectsView';
import { ProjectBoard } from './components/ProjectBoard';
import { ActivityView } from './components/ActivityView';
import { TemplatesView } from './components/TemplatesView';
import { TeamsView } from './components/TeamsView';
import { IssuesView } from './components/IssuesView';
import { APIDocumentation } from './components/APIDocumentation';
import { CreateProjectModal } from './components/CreateProjectModal';
import { CreateTeamModal } from './components/CreateTeamModal';
import { CreateIssueModal } from './components/CreateIssueModal';
import { useProjects } from './hooks/useProjects';
import { useTeams } from './hooks/useTeams';
import { useIssues } from './hooks/useIssues';
import { useNotifications } from './hooks/useNotifications';
import { Project, Card, Team, Issue } from './types';
import { exportToJSON, getProjectTemplates } from './utils/helpers';
import { exportProjectAsJSON, importProjectFromJSON } from './utils/api';

type View = 'projects' | 'board' | 'activity' | 'templates' | 'teams' | 'issues' | 'api';

function App() {
  const [currentView, setCurrentView] = useState<View>('projects');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const [showCreateIssueModal, setShowCreateIssueModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  const {
    projects,
    activities,
    currentUser,
    createProject,
    updateProject,
    deleteProject,
    createCard,
    updateCard,
    moveCard,
    addComment,
    exportProject,
    importProject,
  } = useProjects();

  const {
    teams,
    createTeam,
    updateTeam,
    deleteTeam,
    addTeamMember,
    removeTeamMember,
    updateMemberRole,
  } = useTeams();

  const {
    issues,
    createIssue,
    updateIssue,
    closeIssue,
    reopenIssue,
    addComment: addIssueComment,
    assignIssue,
    bulkUpdateIssues,
  } = useIssues();

  const {
    notifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    notifyMention,
    notifyAssignment,
    notifyComment,
  } = useNotifications();

  const handleViewChange = (view: string) => {
    setCurrentView(view as View);
    if (view !== 'board') {
      setSelectedProject(null);
    }
    if (view !== 'teams') {
      setSelectedTeam(null);
    }
    if (view !== 'issues') {
      setSelectedIssue(null);
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentView('board');
  };

  const handleCreateProject = (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'columns' | 'labels'>) => {
    const newProject = createProject(projectData);
    
    // Apply template if selected
    if (selectedTemplate) {
      const templates = getProjectTemplates();
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        // Update project with template structure
        updateProject(newProject.id, {
          columns: template.columns.map((col, index) => ({
            ...col,
            id: `col_${index}_${Date.now()}`,
            cards: [],
          })),
          labels: template.labels.map((label, index) => ({
            ...label,
            id: `label_${index}_${Date.now()}`,
          })),
        });
      }
    }
    
    setSelectedTemplate('');
  };

  const handleCreateTeam = (teamData: Omit<Team, 'id' | 'createdAt' | 'updatedAt' | 'members' | 'projects' | 'repositories'>) => {
    createTeam(teamData);
    setShowCreateTeamModal(false);
  };

  const handleCreateIssue = (issueData: Omit<Issue, 'id' | 'number' | 'createdAt' | 'updatedAt' | 'comments' | 'linkedIssues' | 'attachments' | 'watchers' | 'reactions'>) => {
    createIssue(issueData);
    setShowCreateIssueModal(false);
  };

  const handleCreateFromTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
    setShowCreateModal(true);
  };

  const handleExportProject = async (projectId: string) => {
    try {
      await exportProjectAsJSON(projectId);
    } catch (error) {
      // Fallback to local export
      const exportData = exportProject(projectId);
      if (exportData) {
        const project = projects.find(p => p.id === projectId);
        const filename = `${project?.title.replace(/\s+/g, '_').toLowerCase()}_export.json`;
        exportToJSON(exportData, filename);
      }
    }
  };

  const handleExportAPI = async (projectId: string, format: 'json' | 'csv' | 'xml') => {
    try {
      await exportProjectAsJSON(projectId);
    } catch (error) {
      console.error('API export failed:', error);
    }
  };

  const handleImportAPI = async (data: any, options: any) => {
    try {
      await importProjectFromJSON(data, options);
    } catch (error) {
      console.error('API import failed:', error);
    }
  };

  const renderContent = () => {
    switch (currentView) {
      case 'board':
        return selectedProject ? (
          <ProjectBoard
            project={selectedProject}
            onBack={() => setCurrentView('projects')}
            onUpdateCard={(cardId, updates) => updateCard(selectedProject.id, cardId, updates)}
            onMoveCard={(cardId, sourceColumnId, targetColumnId, targetPosition) =>
              moveCard(selectedProject.id, cardId, sourceColumnId, targetColumnId, targetPosition)
            }
            onCreateCard={(columnId, cardData) => createCard(selectedProject.id, columnId, cardData)}
            onAddComment={(cardId, content) => addComment(selectedProject.id, cardId, content)}
            onExport={() => handleExportProject(selectedProject.id)}
          />
        ) : null;
      
      case 'teams':
        return (
          <TeamsView
            teams={teams}
            currentUser={currentUser}
            onCreateTeam={() => setShowCreateTeamModal(true)}
            onSelectTeam={setSelectedTeam}
            onEditTeam={(team) => {
              setSelectedTeam(team);
              setShowCreateTeamModal(true);
            }}
            onDeleteTeam={deleteTeam}
          />
        );
      
      case 'issues':
        return (
          <IssuesView
            issues={issues}
            currentUser={currentUser}
            onCreateIssue={() => setShowCreateIssueModal(true)}
            onSelectIssue={setSelectedIssue}
            onUpdateIssue={updateIssue}
          />
        );
      
      case 'activity':
        return <ActivityView activities={activities} />;
      
      case 'templates':
        return <TemplatesView onCreateFromTemplate={handleCreateFromTemplate} />;
      
      case 'api':
        return (
          <APIDocumentation
            onExportAPI={handleExportAPI}
            onImportAPI={handleImportAPI}
          />
        );
      
      default:
        return (
          <ProjectsView
            projects={projects}
            onSelectProject={handleSelectProject}
            onCreateProject={handleCreateProject}
            onEditProject={updateProject}
            onDeleteProject={deleteProject}
            onExportProject={exportProject}
            onImportProject={importProject}
          />
        );
    }
  };

  return (
    <Layout
      currentView={currentView}
      onViewChange={handleViewChange}
      onCreateProject={() => setShowCreateModal(true)}
      notifications={notifications}
      unreadCount={getUnreadCount()}
      onMarkAsRead={markAsRead}
      onMarkAllAsRead={markAllAsRead}
      onDeleteNotification={deleteNotification}
      onClearAllNotifications={clearAllNotifications}
    >
      {renderContent()}
      
      {showCreateModal && (
        <CreateProjectModal
          onClose={() => {
            setShowCreateModal(false);
            setSelectedTemplate('');
          }}
          onCreate={(projectData) => {
            handleCreateProject(projectData);
            setShowCreateModal(false);
          }}
        />
      )}
      
      {showCreateTeamModal && (
        <CreateTeamModal
          team={selectedTeam}
          onClose={() => {
            setShowCreateTeamModal(false);
            setSelectedTeam(null);
          }}
          onCreate={handleCreateTeam}
        />
      )}
      
      {showCreateIssueModal && (
        <CreateIssueModal
          projects={projects}
          currentUser={currentUser}
          onClose={() => setShowCreateIssueModal(false)}
          onCreate={handleCreateIssue}
        />
      )}
    </Layout>
  );
}

export default App;