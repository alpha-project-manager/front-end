'use client';

import { useState, useEffect } from 'react';
import type { Meeting } from '@/types/database';
import Modal from './Modal';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: Partial<Meeting>) => void;
  meeting?: Meeting;
}

export const MeetingModal = ({
  isOpen,
  onClose,
  onSave,
  meeting,
}: MeetingModalProps) => {
  const [formData, setFormData] = useState<Partial<Meeting>>(
    meeting || {
        title: '',
        description: '',
        dateTime: new Date().toISOString().slice(0, 16),
        resultMark: 5,
        isFinished: false,
    }
  );

  // Обновляем форму когда приходит или меняется встреча
  useEffect(() => {
    if (meeting) {
      setFormData({
        title: meeting.title || '',
        description: meeting.description || '',
        dateTime: meeting.dateTime?.slice(0, 16) || new Date().toISOString().slice(0, 16),
        resultMark: meeting.resultMark || 5,
        isFinished: meeting.isFinished || false,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        dateTime: new Date().toISOString().slice(0, 16),
        resultMark: 5,
        isFinished: false,
      });
    }
  }, [meeting, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (name === 'resultMark') {
      setFormData((prev) => ({
        ...prev,
        [name]: parseInt(value) || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Modal open={isOpen} onClose={onClose} title="Встреча">
      <div className="space-y-6">
        {/* Название */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Название
          </label>
          <input
            type="text"
            name="title"
            value={formData.title || ''}
            onChange={handleChange}
            placeholder="Введите название встречи"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Заметки */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Заметки
          </label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            placeholder="Добавьте заметки"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Дата и время */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Планируемая дата/время встречи
          </label>
          <input
            type="datetime-local"
            name="dateTime"
            value={formData.dateTime?.slice(0, 16) || ''}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Оценка */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Оценка
          </label>
          <input
            type="number"
            name="resultMark"
            min="0"
            max="10"
            value={formData.resultMark || 0}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Статус */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-1">
            Статус
          </label>
          <select
            name="isFinished"
            value={formData.isFinished ? 'completed' : 'pending'}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isFinished: e.target.value === 'completed',
              }))
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">Не завершена</option>
            <option value="completed">Завершена</option>
          </select>
        </div>

        {/* Список задач */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Список задач
          </label>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <label key={i} className="flex items-center">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Задача {i}</span>
              </label>
            ))}
          </div>
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
            Сохранить
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default MeetingModal;
