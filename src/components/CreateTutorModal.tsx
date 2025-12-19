'use client';

import { useState } from 'react';
import { createTutor } from '@/services/tutors';

interface CreateTutorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tutor: { id: string; fullName: string }) => void;
}

export default function CreateTutorModal({ isOpen, onClose, onSuccess }: CreateTutorModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    patronymic: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const newTutor = await createTutor(formData);
      onSuccess(newTutor);
      onClose();
      // Reset form
      setFormData({ firstName: '', lastName: '', patronymic: '' });
    } catch (err) {
      setError('Ошибка при создании куратора');
      console.error('Ошибка создания куратора:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Создание куратора</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Фамилия *
            </label>
            <input
              type="text"
              required
              value={formData.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите фамилию"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Имя *
            </label>
            <input
              type="text"
              required
              value={formData.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите имя"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Отчество
            </label>
            <input
              type="text"
              value={formData.patronymic}
              onChange={(e) => handleChange('patronymic', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Введите отчество"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Создание...' : 'Создать'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}