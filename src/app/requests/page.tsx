'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import CasesTab from '@/components/CasesTab';
import RequestsTab from '@/components/RequestsTab';
import QuestionsTab from '@/components/QuestionsTab';
import { fetchApplications } from '@/services/applications';
import { deleteCase, fetchCase, fetchCases, updateCase } from '@/services/cases';
import type { ApplicationBriefResponse } from '@/types/application';
import type { PreRecordRequest } from '@/types/request';
import { ProjectCaseBriefResponse } from '@/types/case';
import { RootState } from '@/store';
import CaseLikeButton from '@/components/CaseLikeButton';
import { createTutor, fetchTutors } from '@/services/tutors';
import { mockProjects } from '@/data/mockProjects';

type TabType = 'requests' | 'cases' | 'questions';

const getStatusLabel = (status: PreRecordRequest['status']): string => {
  const labels = {
    pending: 'На рассмотрении',
    approved: 'Одобрена',
    rejected: 'Отклонена',
    scheduled: 'Запланирована',
  };
  return labels[status];
};

const getStatusColor = (status: PreRecordRequest['status']): string => {
  const colors = {
    pending: 'text-yellow-600 bg-yellow-50',
    approved: 'text-green-600 bg-green-50',
    rejected: 'text-red-600 bg-red-50',
    scheduled: 'text-blue-600 bg-blue-50',
  };
  return colors[status];
};

const getProjectTitle = (projectId?: string): string => {
  if (!projectId) return 'Не указан';
  const project = mockProjects.find(p => p.id === projectId);
  return project?.title || 'Неизвестный проект';
};

// Компонент формы создания куратора
const CreateTutorForm = ({
  onClose,
  onSuccess
}: {
  onClose: () => void;
  onSuccess: (tutor: { id: string; fullName: string }) => void;
}) => {
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

  return (
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
  );
};

// Компонент формы редактирования кейса
const CaseForm = ({
  caseItem,
  onClose,
  onSuccess
}: {
  caseItem: ProjectCaseBriefResponse;
  onClose: () => void;
  onSuccess: () => void;
}) => {
  const auth = useSelector((state: RootState) => state.auth);
  const currentUserId = auth.user?.id;

  const [formData, setFormData] = useState({
    title: caseItem.title,
    description: '',
    goal: '',
    requestedResult: '',
    criteria: '',
    tutorId: caseItem.tutorId || '',
    maxTeams: caseItem.maxTeams,
    isActive: caseItem.isActive,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tutors, setTutors] = useState<{ id: string; fullName: string }[]>([]);
  const [tutorsLoading, setTutorsLoading] = useState(false);
  const [showCreateTutorModal, setShowCreateTutorModal] = useState(false);

  // Загружаем полные данные кейса и список кураторов
  useEffect(() => {
    const loadData = async () => {
      try {
        // Загружаем данные кейса
        const fullCase = await fetchCase(caseItem.id);
        setFormData({
          title: fullCase.title,
          description: fullCase.description,
          goal: fullCase.goal,
          requestedResult: fullCase.requestedResult,
          criteria: fullCase.criteria,
          tutorId: fullCase.tutorId || '',
          maxTeams: fullCase.maxTeams,
          isActive: fullCase.isActive,
        });

        // Загружаем список кураторов
        setTutorsLoading(true);
        const tutorsData = await fetchTutors();
        setTutors(tutorsData.map(t => ({ id: t.id, fullName: t.fullName })));
        setTutorsLoading(false);
      } catch (err) {
        console.error('Ошибка загрузки данных:', err);
        setTutorsLoading(false);
      }
    };
    loadData();
  }, [caseItem.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await updateCase(caseItem.id, formData);
      onSuccess();
    } catch (err) {
      setError('Ошибка при обновлении кейса');
      console.error('Ошибка обновления кейса:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = async () => {
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Название кейса *
        </label>
        <input
          type="text"
          required
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Введите название кейса"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Описание *
        </label>
        <textarea
          required
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Опишите кейс проекта"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Цель проекта *
        </label>
        <textarea
          required
          value={formData.goal}
          onChange={(e) => handleChange('goal', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Опишите цель проекта"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ожидаемый результат *
        </label>
        <textarea
          required
          value={formData.requestedResult}
          onChange={(e) => handleChange('requestedResult', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Опишите ожидаемый результат"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Критерии оценки *
        </label>
        <textarea
          required
          value={formData.criteria}
          onChange={(e) => handleChange('criteria', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Опишите критерии оценки"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Куратор
        </label>
        <div className="flex gap-2">
          <select
            value={formData.tutorId}
            onChange={(e) => handleChange('tutorId', e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={tutorsLoading}
          >
            <option value="">Выберите куратора</option>
            {tutors.map((tutor) => (
              <option key={tutor.id} value={tutor.id}>
                {tutor.fullName}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setShowCreateTutorModal(true)}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            +
          </button>
        </div>
        {tutorsLoading && (
          <p className="text-sm text-gray-500 mt-1">Загрузка кураторов...</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Максимальное количество команд
        </label>
        <input
          type="number"
          min="1"
          value={formData.maxTeams}
          onChange={(e) => handleChange('maxTeams', parseInt(e.target.value) || 1)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Активный
        </label>
        <select
          value={formData.isActive.toString()}
          onChange={(e) => handleChange('isActive', e.target.value === 'true')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="true">Да</option>
          <option value="false">Нет</option>
        </select>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          {error}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        <button
          type="button"
          onClick={handleClose}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Отмена
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>

      {/* Модальное окно создания куратора */}
      {showCreateTutorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Создание куратора</h3>
            <CreateTutorForm
              onClose={() => setShowCreateTutorModal(false)}
              onSuccess={(newTutor) => {
                setShowCreateTutorModal(false);
                setTutors(prev => [...prev, { id: newTutor.id, fullName: newTutor.fullName }]);
                setFormData(prev => ({ ...prev, tutorId: newTutor.id }));
              }}
            />
          </div>
        </div>
      )}
    </form>
  );
};

// Компонент карточки кейса
const CaseCard = ({
  caseItem,
  onEdit,
  onDelete
}: {
  caseItem: ProjectCaseBriefResponse;
  onEdit: (caseItem: ProjectCaseBriefResponse) => void;
  onDelete: (caseItem: ProjectCaseBriefResponse) => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const spotsLeft = caseItem.maxTeams - caseItem.acceptedTeams;
  const auth = useSelector((state: RootState) => state.auth);
  const currentUserId = auth.user?.id;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {caseItem.title}
          </h3>
          <p className="text-sm text-gray-600">
            Куратор: {caseItem.tutorFio || 'Не указан'}
          </p>
        </div>
        <div className="flex flex-col gap-2 ml-4 items-end">
          <div className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-700">
            Команд: {caseItem.acceptedTeams}/{caseItem.maxTeams}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(caseItem)}
              className="text-blue-600 hover:text-blue-800 text-sm"
              title="Редактировать"
            >
              ✏️
            </button>
            <button
              onClick={() => onDelete(caseItem)}
              className="text-red-600 hover:text-red-800 text-sm"
              title="Удалить"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>

      {/* Collapsible секция */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">
            {isExpanded ? '▼' : '▶'} Информация о проекте
          </span>
        </button>
        
        {isExpanded && (
          <div className="p-4 border-t border-gray-200 space-y-3 bg-gray-50">
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Статус:</h4>
              <p className="text-sm text-gray-700">{caseItem.isActive ? 'Активный' : 'Неактивный'}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Последнее обновление:</h4>
              <p className="text-sm text-gray-700">{new Date(caseItem.updatedAt).toLocaleDateString('ru-RU')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Секция с лайками/дизлайками */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {!currentUserId && 'Авторизуйтесь для оценки кейса'}
          </p>
          <CaseLikeButton
            caseId={caseItem.id}
            userId={currentUserId}
            showCounts
            votes={caseItem.votes}
          />
        </div>
      </div>
    </div>
  );
};

export default function Requests() {
  const [activeTab, setActiveTab] = useState<TabType>('requests');
  const router = useRouter();
  const auth = useSelector((state: RootState) => state.auth);
  const currentUserId = auth.user?.id;
  
  // Состояние для данных
  const [cases, setCases] = useState<ProjectCaseBriefResponse[]>([]);
  const [applications, setApplications] = useState<ApplicationBriefResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Состояние для сортировки кейсов
  const [sortBy, setSortBy] = useState<'title' | 'tutorFio' | 'acceptedTeams'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Состояние для сортировки заявок
  const [applicationsSortBy, setApplicationsSortBy] = useState<'caseTitle' | 'teamTitle' | 'updatedAt'>('updatedAt');
  const [applicationsSortOrder, setApplicationsSortOrder] = useState<'asc' | 'desc'>('desc');

  // Состояние для модального окна создания кейса
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCase, setEditingCase] = useState<ProjectCaseBriefResponse | null>(null);
  const [deletingCase, setDeletingCase] = useState<ProjectCaseBriefResponse | null>(null);
  const [creatingCase, setCreatingCase] = useState(false);

  // Функция загрузки данных
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      switch (activeTab) {
        case 'cases':
          const casesData = await fetchCases();
          setCases(casesData);
          break;
        case 'requests':
          const applicationsData = await fetchApplications();
          setApplications(applicationsData);
          break;
        default:
          break;
      }
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  // Загрузка данных при смене табов
  useEffect(() => {
    loadData();
  }, [activeTab]);

  // Фильтрация и сортировка кейсов
  const sortedCases = [...cases].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'tutorFio':
        aValue = a.tutorFio || '';
        bValue = b.tutorFio || '';
        break;
      case 'acceptedTeams':
        aValue = a.acceptedTeams;
        bValue = b.acceptedTeams;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  // Фильтрация и сортировка заявок
  const sortedApplications = applications.slice().sort((a, b) => {
    let aValue: any, bValue: any;

    switch (applicationsSortBy) {
      case 'caseTitle':
        aValue = a.caseTitle;
        bValue = b.caseTitle;
        break;
      case 'teamTitle':
        aValue = a.teamTitle;
        bValue = b.teamTitle;
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      default:
        return 0;
    }

    if (applicationsSortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return (
    <div className="space-y-6">
      {/* Табы */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 pt-4">
          <div className="flex gap-6 border-b border-gray-300">
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'requests'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Заявки
              {activeTab === 'requests' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'cases'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Кейсы
              {activeTab === 'cases' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'questions'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Вопросы
              {activeTab === 'questions' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
              )}
            </button>
          </div>
        </div>

        {/* Контент табов */}
        <div className="p-6">
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 mb-2">
                <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Ошибка загрузки данных</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <p className="text-red-600 text-sm">
                Проверьте подключение к API серверу и попробуйте перезагрузить страницу.
              </p>
            </div>
          )}

          {activeTab === 'requests' && (
            <RequestsTab applications={applications} loading={loading} />
          )}

          {activeTab === 'cases' && !loading && (
            <CasesTab onLoadData={loadData} />
          )}

          {activeTab === 'questions' && (
            <QuestionsTab />
          )}
        </div>
      </div>



      {/* Модальное окно редактирования кейса */}
      {editingCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Редактирование кейса</h2>
            <CaseForm
              caseItem={editingCase}
              onClose={() => setEditingCase(null)}
              onSuccess={() => {
                setEditingCase(null);
                // Перезагрузить кейсы
                if (activeTab === 'cases') {
                  loadData();
                }
              }}
            />
          </div>
        </div>
      )}

      {/* Модальное окно подтверждения удаления */}
      {deletingCase && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Подтверждение удаления</h2>
            <p className="text-gray-700 mb-6">
              Вы действительно хотите удалить кейс "{deletingCase.title}"?
              Это действие нельзя отменить.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeletingCase(null)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={async () => {
                  try {
                    await deleteCase(deletingCase.id);
                    setDeletingCase(null);
                    // Перезагрузить кейсы
                    if (activeTab === 'cases') {
                      loadData();
                    }
                  } catch (err) {
                    console.error('Ошибка удаления кейса:', err);
                  }
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}