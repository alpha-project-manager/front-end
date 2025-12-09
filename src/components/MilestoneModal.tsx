'use client';

import { useState, useEffect } from 'react';
import type { Milestone, MilestoneCreate } from '@/types/milestone';
import Modal from './Modal';

interface MilestoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (milestone: MilestoneCreate | Partial<Milestone>) => void;
  milestone?: Milestone | null;
  projectId?: string;
}

export const MilestoneModal = ({
  isOpen,
  onClose,
  onSave,
  milestone,
  projectId,
}: MilestoneModalProps) => {
  const [formData, setFormData] = useState<MilestoneCreate>({
    title: '',
    description: '',
    type: 'local',
    targetDate: '',
    priority: 'medium',
    projectId,
    assignedTo: '',
    dependencies: [],
  });

  // Обновляем форму когда приходит или меняется милстоун
  useEffect(() => {
    if (milestone) {
      console.log('Editing milestone:', milestone);
      setFormData({
        title: milestone.title,
        description: milestone.description || '',
        type: milestone.type,
        targetDate: milestone.targetDate.slice(0, 16) || '', // для datetime-local input
        priority: milestone.priority,
        projectId: milestone.projectId,
        assignedTo: milestone.assignedTo || '',
        dependencies: milestone.dependencies || [],
      });
    } else {
      setFormData({
        title: '',
        description: '',
        type: projectId ? 'local' : 'global',
        targetDate: new Date().toISOString().slice(0, 16),
        priority: 'medium',
        projectId,
        assignedTo: '',
        dependencies: [],
      });
    }
  }, [milestone, projectId, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    if (!formData.title || !formData.targetDate) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }

    // Конвертируем дату в ISO формат
    const saveData = {
      ...formData,
      targetDate: new Date(formData.targetDate).toISOString(),
    };

    onSave(milestone ? { ...milestone, ...saveData } : saveData);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title={milestone ? 'Редактировать контрольную точку' : 'Создать контрольную точку'}>
      <div className="space-y-6">
        {/* Название */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Название *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Введите название контрольной точки"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Описание */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Описание
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Опишите контрольную точку"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Тип */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Тип
          </label>
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            disabled={!!projectId} // Если передан projectId, тип фиксирован как local
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="global">🌍 Глобальная</option>
            <option value="local">🎯 Локальная</option>
          </select>
        </div>

        {/* Дата и время */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Целевая дата *
          </label>
          <input
            type="datetime-local"
            name="targetDate"
            value={formData.targetDate}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Приоритет */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Приоритет
          </label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">⬇️ Низкий</option>
            <option value="medium">➡️ Средний</option>
            <option value="high">⬆️ Высокий</option>
            <option value="critical">🚨 Критичный</option>
          </select>
        </div>

        {/* Проект (только для локальных) */}
        {formData.type === 'local' && (
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-1">
              Проект
            </label>
            <input
              type="text"
              name="projectId"
              value={formData.projectId || ''}
              onChange={handleChange}
              placeholder="ID проекта"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {/* Ответственный */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Ответственный
          </label>
          <input
            type="text"
            name="assignedTo"
            value={formData.assignedTo}
            onChange={handleChange}
            placeholder="ID пользователя"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Кнопки действия */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 rounded-md text-sm font-medium text-white hover:bg-blue-700"
          >
            {milestone ? 'Сохранить' : 'Создать'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MilestoneModal;