'use client';

import { useState } from 'react';
import type { Milestone } from '@/types/milestone';

interface MilestoneCardProps {
  milestone: Milestone;
  onEdit?: (milestone: Milestone) => void;
  onDelete?: (id: string) => void;
  onProgressUpdate?: (id: string, progress: number) => void;
  showProjectInfo?: boolean;
  compact?: boolean;
}

const MilestoneCard = ({ 
  milestone, 
  onEdit, 
  onDelete, 
  onProgressUpdate, 
  showProjectInfo = false,
  compact = false 
}: MilestoneCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [progress, setProgress] = useState(milestone.progress);

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: Milestone['priority']) => {
    switch (priority) {
      case 'low':
        return 'text-gray-600';
      case 'medium':
        return 'text-blue-600';
      case 'high':
        return 'text-orange-600';
      case 'critical':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTypeIcon = (type: Milestone['type']) => {
    return type === 'global' ? '🌍' : '🎯';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Завтра';
    if (diffDays === -1) return 'Вчера';
    if (diffDays > 0) return `Через ${diffDays} дн.`;
    return `${Math.abs(diffDays)} дн. назад`;
  };

  const handleProgressSave = () => {
    if (onProgressUpdate) {
      onProgressUpdate(milestone.id, progress);
    }
    setIsEditing(false);
  };

  if (compact) {
    return (
      <div className={`bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow ${milestone.status === 'overdue' ? 'border-red-300' : ''}`}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-sm">{getTypeIcon(milestone.type)}</span>
            <span className="font-medium text-sm text-gray-900 truncate">
              {milestone.title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(milestone.status)}`}>
              {milestone.status === 'pending' && 'Ожидает'}
              {milestone.status === 'in_progress' && 'В процессе'}
              {milestone.status === 'completed' && 'Готово'}
              {milestone.status === 'overdue' && 'Просрочено'}
            </span>
          </div>
        </div>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{formatDate(milestone.targetDate)}</span>
          <span className={getPriorityColor(milestone.priority)}>
            {milestone.priority === 'low' && 'Низкий'}
            {milestone.priority === 'medium' && 'Средний'}
            {milestone.priority === 'high' && 'Высокий'}
            {milestone.priority === 'critical' && 'Критичный'}
          </span>
        </div>
        
        {/* Прогресс бар */}
        <div className="mt-2">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Прогресс</span>
            <span>{milestone.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div 
              className={`h-1.5 rounded-full transition-all ${
                milestone.progress === 100 ? 'bg-green-500' : 
                milestone.status === 'overdue' ? 'bg-red-500' : 'bg-blue-500'
              }`}
              style={{ width: `${milestone.progress}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow ${milestone.status === 'overdue' ? 'border-red-300' : ''}`}>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getTypeIcon(milestone.type)}</span>
            <h3 className="text-lg font-semibold text-gray-900">
              {milestone.title}
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(milestone.status)}`}>
              {milestone.status === 'pending' && 'Ожидает'}
              {milestone.status === 'in_progress' && 'В процессе'}
              {milestone.status === 'completed' && 'Готово'}
              {milestone.status === 'overdue' && 'Просрочено'}
            </span>
          </div>
          
          {milestone.description && (
            <p className="text-sm text-gray-600 mb-3">{milestone.description}</p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{formatDate(milestone.targetDate)}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={getPriorityColor(milestone.priority)}>
                {milestone.priority === 'low' && '⬇️ Низкий'}
                {milestone.priority === 'medium' && '➡️ Средний'}
                {milestone.priority === 'high' && '⬆️ Высокий'}
                {milestone.priority === 'critical' && '🚨 Критичный'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span>{milestone.type === 'global' ? 'Глобальная' : 'Локальная'}</span>
            </div>
          </div>
          
          {showProjectInfo && milestone.projectId && (
            <div className="text-xs text-gray-500 mb-3">
              Проект: {milestone.projectId}
            </div>
          )}
        </div>
        
        {(onEdit || onDelete) && (
          <div className="flex gap-2 ml-4">
            {onEdit && (
              <button
                onClick={() => onEdit(milestone)}
                className="text-sm text-blue-600 hover:underline"
              >
                Редактировать
              </button>
            )}
            {onDelete && (
              <button
                onClick={() => onDelete(milestone.id)}
                className="text-sm text-red-600 hover:underline"
              >
                Удалить
              </button>
            )}
          </div>
        )}
      </div>
      
      {/* Прогресс */}
      <div className="border-t border-gray-200 pt-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">Прогресс</span>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-sm border border-gray-300 rounded"
                />
                <button
                  onClick={handleProgressSave}
                  className="text-xs text-green-600 hover:underline"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setProgress(milestone.progress);
                    setIsEditing(false);
                  }}
                  className="text-xs text-gray-600 hover:underline"
                >
                  Отмена
                </button>
              </>
            ) : (
              <>
                <span className="text-sm text-gray-600">{milestone.progress}%</span>
                {onProgressUpdate && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Изменить
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`h-2 rounded-full transition-all ${
              milestone.progress === 100 ? 'bg-green-500' : 
              milestone.status === 'overdue' ? 'bg-red-500' : 'bg-blue-500'
            }`}
            style={{ width: `${milestone.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MilestoneCard;