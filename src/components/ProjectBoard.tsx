import React, { useState } from 'react';
import { Plus, Filter, ArrowLeft, Users, Settings, Download, Upload } from 'lucide-react';
import { Project, Card, FilterOptions } from '../types';
import { BoardColumn } from './BoardColumn';
import { CardModal } from './CardModal';
import { CreateCardModal } from './CreateCardModal';
import { FilterPanel } from './FilterPanel';

interface ProjectBoardProps {
  project: Project;
  onBack: () => void;
  onUpdateCard: (cardId: string, updates: Partial<Card>) => void;
  onMoveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, targetPosition: number) => void;
  onCreateCard: (columnId: string, cardData: Omit<Card, 'id' | 'createdAt' | 'updatedAt' | 'position' | 'comments'>) => void;
  onAddComment: (cardId: string, content: string) => void;
  onExport: () => void;
}

export function ProjectBoard({ 
  project, 
  onBack, 
  onUpdateCard, 
  onMoveCard, 
  onCreateCard, 
  onAddComment,
  onExport 
}: ProjectBoardProps) {
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [createCardColumn, setCreateCardColumn] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});

  const filterCards = (cards: Card[]): Card[] => {
    return cards.filter(card => {
      if (filters.assignee && !card.assignees.some(assignee => assignee.id === filters.assignee)) {
        return false;
      }
      if (filters.labels && filters.labels.length > 0 && !filters.labels.some(labelId => card.labels.some(label => label.id === labelId))) {
        return false;
      }
      if (filters.priority && card.priority !== filters.priority) {
        return false;
      }
      if (filters.search && !card.title.toLowerCase().includes(filters.search.toLowerCase()) && !card.description?.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  };

  const filteredProject = {
    ...project,
    columns: project.columns.map(column => ({
      ...column,
      cards: filterCards(column.cards)
    }))
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Projects
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{project.title}</h1>
            {project.description && (
              <p className="text-gray-600 dark:text-gray-400">{project.description}</p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              showFilters 
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>

          <button
            onClick={onExport}
            className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-600 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>

          <div className="flex -space-x-2">
            {project.members.slice(0, 4).map((member, index) => (
              <img
                key={member.id}
                src={member.avatar}
                alt={member.name}
                className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-900"
                title={member.name}
              />
            ))}
            {project.members.length > 4 && (
              <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-900 flex items-center justify-center">
                <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                  +{project.members.length - 4}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel
          project={project}
          filters={filters}
          onFiltersChange={setFilters}
          onClose={() => setShowFilters(false)}
        />
      )}

      {/* Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex space-x-6 h-full min-w-max pb-6">
          {filteredProject.columns
            .sort((a, b) => a.position - b.position)
            .map((column) => (
              <BoardColumn
                key={column.id}
                column={column}
                onCardClick={setSelectedCard}
                onCreateCard={() => setCreateCardColumn(column.id)}
                onMoveCard={onMoveCard}
                project={project}
              />
            ))}
        </div>
      </div>

      {/* Modals */}
      {selectedCard && (
        <CardModal
          card={selectedCard}
          project={project}
          onClose={() => setSelectedCard(null)}
          onUpdate={(updates) => onUpdateCard(selectedCard.id, updates)}
          onAddComment={(content) => onAddComment(selectedCard.id, content)}
        />
      )}

      {createCardColumn && (
        <CreateCardModal
          project={project}
          columnId={createCardColumn}
          onClose={() => setCreateCardColumn(null)}
          onCreate={(cardData) => {
            onCreateCard(createCardColumn, cardData);
            setCreateCardColumn(null);
          }}
        />
      )}
    </div>
  );
}