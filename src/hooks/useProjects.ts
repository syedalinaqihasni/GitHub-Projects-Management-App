import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { Project, Card, Column, Activity, User, Label, Comment, ExportData } from '../types';
import { generateId, generateMockData } from '../utils/helpers';

export function useProjects() {
  const [projects, setProjects] = useLocalStorage<Project[]>('github-projects', []);
  const [activities, setActivities] = useLocalStorage<Activity[]>('project-activities', []);
  const [currentUser] = useLocalStorage<User>('current-user', generateMockData().currentUser);

  const addActivity = useCallback((activity: Omit<Activity, 'id' | 'timestamp'>) => {
    const newActivity: Activity = {
      ...activity,
      id: generateId(),
      timestamp: new Date(),
    };
    setActivities(prev => [newActivity, ...prev].slice(0, 100)); // Keep last 100 activities
  }, [setActivities]);

  const createProject = useCallback((projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt' | 'columns' | 'labels'>) => {
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      columns: [
        { id: generateId(), title: 'To Do', color: '#6b7280', cards: [], position: 0, isCollapsed: false },
        { id: generateId(), title: 'In Progress', color: '#3b82f6', cards: [], position: 1, isCollapsed: false },
        { id: generateId(), title: 'Done', color: '#10b981', cards: [], position: 2, isCollapsed: false },
      ],
      labels: [
        { id: generateId(), name: 'bug', color: '#ef4444', description: 'Something isn\'t working' },
        { id: generateId(), name: 'enhancement', color: '#3b82f6', description: 'New feature or request' },
        { id: generateId(), name: 'documentation', color: '#6b7280', description: 'Improvements or additions to documentation' },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects(prev => [...prev, newProject]);
    return newProject;
  }, [setProjects]);

  const updateProject = useCallback((projectId: string, updates: Partial<Project>) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId 
        ? { ...project, ...updates, updatedAt: new Date() }
        : project
    ));
  }, [setProjects]);

  const deleteProject = useCallback((projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  }, [setProjects]);

  const createCard = useCallback((projectId: string, columnId: string, cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'position' | 'comments'>) => {
    const newCard: Card = {
      ...cardData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date(),
      position: 0,
      comments: [],
    };

    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        const updatedProject = {
          ...project,
          columns: project.columns.map(column => {
            if (column.id === columnId) {
              return {
                ...column,
                cards: [newCard, ...column.cards.map(card => ({ ...card, position: card.position + 1 }))]
              };
            }
            return column;
          }),
          updatedAt: new Date(),
        };
        
        addActivity({
          type: 'card_created',
          actor: currentUser,
          target: { type: 'card', id: newCard.id, title: newCard.title },
        });

        return updatedProject;
      }
      return project;
    }));

    return newCard;
  }, [setProjects, addActivity, currentUser]);

  const updateCard = useCallback((projectId: string, cardId: string, updates: Partial<Card>) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          columns: project.columns.map(column => ({
            ...column,
            cards: column.cards.map(card => 
              card.id === cardId 
                ? { ...card, ...updates, updatedAt: new Date() }
                : card
            )
          })),
          updatedAt: new Date(),
        };
      }
      return project;
    }));

    addActivity({
      type: 'card_updated',
      actor: currentUser,
      target: { type: 'card', id: cardId, title: updates.title || 'Card' },
    });
  }, [setProjects, addActivity, currentUser]);

  const moveCard = useCallback((projectId: string, cardId: string, sourceColumnId: string, targetColumnId: string, targetPosition: number) => {
    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        let cardToMove: Card | null = null;
        
        // Remove card from source column
        const columnsWithoutCard = project.columns.map(column => {
          if (column.id === sourceColumnId) {
            const cardIndex = column.cards.findIndex(card => card.id === cardId);
            if (cardIndex >= 0) {
              cardToMove = column.cards[cardIndex];
              return {
                ...column,
                cards: column.cards.filter(card => card.id !== cardId)
              };
            }
          }
          return column;
        });

        if (!cardToMove) return project;

        // Add card to target column
        const updatedColumns = columnsWithoutCard.map(column => {
          if (column.id === targetColumnId) {
            const newCards = [...column.cards];
            newCards.splice(targetPosition, 0, { ...cardToMove!, position: targetPosition });
            // Update positions
            return {
              ...column,
              cards: newCards.map((card, index) => ({ ...card, position: index }))
            };
          }
          return column;
        });

        addActivity({
          type: 'card_moved',
          actor: currentUser,
          target: { type: 'card', id: cardId, title: cardToMove.title },
          metadata: { from: sourceColumnId, to: targetColumnId },
        });

        return { ...project, columns: updatedColumns, updatedAt: new Date() };
      }
      return project;
    }));
  }, [setProjects, addActivity, currentUser]);

  const addComment = useCallback((projectId: string, cardId: string, content: string) => {
    const newComment: Comment = {
      id: generateId(),
      content,
      author: currentUser,
      createdAt: new Date(),
    };

    setProjects(prev => prev.map(project => {
      if (project.id === projectId) {
        return {
          ...project,
          columns: project.columns.map(column => ({
            ...column,
            cards: column.cards.map(card => 
              card.id === cardId 
                ? { ...card, comments: [...card.comments, newComment], updatedAt: new Date() }
                : card
            )
          })),
          updatedAt: new Date(),
        };
      }
      return project;
    }));

    addActivity({
      type: 'comment_added',
      actor: currentUser,
      target: { type: 'card', id: cardId, title: 'Card' },
    });
  }, [setProjects, addActivity, currentUser]);

  const exportProject = useCallback((projectId: string): ExportData | null => {
    const project = projects.find(p => p.id === projectId);
    if (!project) return null;

    const projectActivities = activities.filter(activity => 
      activity.target.type === 'project' && activity.target.id === projectId ||
      project.columns.some(column => 
        column.cards.some(card => card.id === activity.target.id)
      )
    );

    return {
      project,
      activities: projectActivities,
      exportedAt: new Date(),
      version: '1.0.0',
    };
  }, [projects, activities]);

  const importProject = useCallback((data: ExportData) => {
    const importedProject = {
      ...data.project,
      id: generateId(), // Generate new ID to avoid conflicts
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects(prev => [...prev, importedProject]);
    
    addActivity({
      type: 'card_created',
      actor: currentUser,
      target: { type: 'project', id: importedProject.id, title: importedProject.title },
    });

    return importedProject;
  }, [setProjects, addActivity, currentUser]);

  return {
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
  };
}