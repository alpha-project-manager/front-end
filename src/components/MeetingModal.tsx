'use client';

import { useState, useEffect } from 'react';
import type { Meeting, TodoTask } from '@/types/database';
import Modal from './Modal';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: Partial<Meeting>) => void;
  meeting?: Meeting;
  projectId?: string;
}

export const MeetingModal = ({
  isOpen,
  onClose,
  onSave,
  meeting,
}: MeetingModalProps) => {
  const [formData, setFormData] = useState<Partial<Meeting>>(
    meeting || {
        description: '',
        dateTime: new Date().toISOString(),
        isFinished: false,
    }
  );

  const correctDate = (date:string) => {
      const items = date.split('-')
      return `${items[2]}.${items[1]}.${items[0]}`
    }

  // Обновляем форму когда приходит или меняется встреча
  useEffect(() => {

    if (meeting) {
      setFormData({
        description: meeting.description || '',
        dateTime: meeting.dateTime || new Date().toISOString(),
        resultMark: meeting.resultMark,
        isFinished: meeting.isFinished || false,
        todoTasks: meeting.todoTasks ? meeting.todoTasks.map(t => ({ ...t })) : [],
      });
    } else {
      setFormData({
        description: '',
        dateTime: new Date().toISOString(),
        isFinished: false,
        todoTasks: [],
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

  // --- Checklist handlers ---
  const handleTaskTitleChange = (index: number, title: string) => {
    setFormData((prev) => {
      const tasks = (prev.todoTasks || []).map((t, i) =>
        i === index ? { ...(t as TodoTask), title } : t
      );
      return { ...prev, todoTasks: tasks };
    });
  };

  const toggleTaskCompleted = (index: number) => {
    setFormData((prev) => {
      const tasks = (prev.todoTasks || []).map((t, i) =>
        i === index ? { ...(t as TodoTask), isCompleted: !(t as TodoTask).isCompleted } : t
      );
      return { ...prev, todoTasks: tasks };
    });
  };

  const addTask = () => {
    const newTask: TodoTask = {
      id: `task-${Date.now()}`,
      meetingId: meeting?.id || '',
      isCompleted: false,
      title: '',
    };
    setFormData((prev) => ({ ...prev, todoTasks: [...(prev.todoTasks || []), newTask] }));
  };

  const removeTask = (index: number) => {
    setFormData((prev) => ({ ...prev, todoTasks: (prev.todoTasks || []).filter((_, i) => i !== index) }));
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
            Встреча {correctDate(new Date().toISOString().slice(0, 10))}
          </label>
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
        {meeting?.resultMark !== 0 && (
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
        )}
        

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
          <label className="block text-sm font-medium text-gray-900 mb-3">Список задач</label>
          <div className="space-y-2">
            {(formData.todoTasks || []).length === 0 ? (
              <div className="text-sm text-gray-500">Нет задач. Добавьте первую задачу.</div>
            ) : (
              (formData.todoTasks || []).map((t, idx) => {
                const task = t as TodoTask;
                return (
                  <div key={task.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!task.isCompleted}
                      onChange={() => toggleTaskCompleted(idx)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) => handleTaskTitleChange(idx, e.target.value)}
                      placeholder="Название задачи"
                      className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm"
                    />
                    <button
                      onClick={() => removeTask(idx)}
                      className="text-sm text-red-600 hover:underline"
                      aria-label={`Удалить задачу ${idx + 1}`}
                    >
                      Удалить
                    </button>
                  </div>
                );
              })
            )}

            <div>
              <button
                type="button"
                onClick={addTask}
                className="text-sm text-blue-600 hover:underline"
              >
                + Добавить задачу
              </button>
            </div>
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