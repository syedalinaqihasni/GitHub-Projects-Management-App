import React, { useState } from 'react';
import { Plus, MoreHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import { Column, Card, Project } from '../types';
import { CardItem } from './CardItem';

interface BoardColumnProps {
  column: Column;
  onCardClick: (card: Card) => void;
  onCreateCard: () => void;
  onMoveCard: (cardId: string, sourceColumnId: string, targetColumnId: string, targetPosition: number) => void;
  project: Project;
}

export function BoardColumn({ column, onCardClick, onCreateCard, onMoveCard, project }: BoardColumnProps) {
  const [isCollapsed, setIsCollapsed] = useState(column.isCollapsed);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverIndex(null);
    
    const dragData = e.dataTransfer.getData('application/json');
    if (!dragData) return;
    
    const { cardId, sourceColumnId } = JSON.parse(dragData);
    
    if (sourceColumnId !== column.id || targetIndex !== dragOverIndex) {
      onMoveCard(cardId, sourceColumnId, column.id, targetIndex);
    }
  };

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        {/* Column Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
              <div className="flex items-center space-x-2">
                <div 
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: column.color }}
                />
                <h3 className="font-medium text-gray-900 dark:text-white">{column.title}</h3>
                <span className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 text-xs font-medium px-2 py-1 rounded-full">
                  {column.cards.length}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-1">
              <button
                onClick={onCreateCard}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title="Add card"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Column Content */}
        {!isCollapsed && (
          <div className="p-3 space-y-3 max-h-96 overflow-y-auto">
            {column.cards
              .sort((a, b) => a.position - b.position)
              .map((card, index) => (
                <div key={card.id}>
                  {dragOverIndex === index && (
                    <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded mb-3 opacity-50" />
                  )}
                  <CardItem
                    card={card}
                    onClick={() => onCardClick(card)}
                    onDragStart={(e) => {
                      e.dataTransfer.setData('application/json', JSON.stringify({
                        cardId: card.id,
                        sourceColumnId: column.id
                      }));
                    }}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                    project={project}
                  />
                </div>
              ))}
            
            {dragOverIndex === column.cards.length && (
              <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded opacity-50" />
            )}
            
            {/* Drop zone for empty column or after last card */}
            <div
              onDragOver={(e) => handleDragOver(e, column.cards.length)}
              onDrop={(e) => handleDrop(e, column.cards.length)}
              className="h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg flex items-center justify-center text-gray-500 dark:text-gray-400 hover:border-gray-400 dark:hover:border-gray-500 transition-colors"
            >
              {column.cards.length === 0 ? (
                <span className="text-sm">Drop cards here</span>
              ) : (
                <Plus className="w-5 h-5" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}