'use client';

import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { fetchCases, createCase, updateCase, deleteCase, fetchCase } from '@/services/cases';
import { fetchTutors } from '@/services/tutors';
import CreateTutorModal from '@/components/CreateTutorModal';
import CaseLikeButton from '@/components/CaseLikeButton';
import type { RootState } from '@/store';
import type { ProjectCaseBriefResponse } from '@/types/case';
import type { TutorResponse } from '@/types/tutor';

type TabType = 'requests' | 'cases' | 'questions';

// Компонент обертки для модальных окон
const ModalWrapper = ({
  children,
  maxWidth = 'max-w-2xl'
}: {
  children: React.ReactNode;
  maxWidth?: string;
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className={`bg-white rounded-lg p-6 w-full ${maxWidth} max-h-[90vh] overflow-y-auto`}>
      {children}
    </div>
  </div>
);

// Компонент поля формы
const FormField = ({
  label,
  type = 'text',
  required = false,
  value,
  onChange,
  placeholder,
  rows,
  options,
  disabled = false
}: {
  label: string;
  type?: string;
  required?: boolean;
  value: any;
  onChange: (value: any) => void;
  placeholder?: string;
  rows?: number;
  options?: { value: string; label: string }[];
  disabled?: boolean;
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label} {required && '*'}
    </label>
    {type === 'textarea' ? (
      <textarea
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows || 3}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
      />
    ) : type === 'select' ? (
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        disabled={disabled}
      >
        {options?.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(type === 'number' ? parseInt(e.target.value) || 1 : e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder={placeholder}
      />
    )}
  </div>
);

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
      <FormField
        label="Название кейса"
        type="text"
        required
        value={formData.title}
        onChange={(value) => handleChange('title', value)}
        placeholder="Введите название кейса"
      />

      <FormField
        label="Описание"
        type="textarea"
        required
        value={formData.description}
        onChange={(value) => handleChange('description', value)}
        placeholder="Опишите кейс проекта"
        rows={3}
      />

      <FormField
        label="Цель проекта"
        type="textarea"
        required
        value={formData.goal}
        onChange={(value) => handleChange('goal', value)}
        placeholder="Опишите цель проекта"
        rows={2}
      />

      <FormField
        label="Ожидаемый результат"
        type="textarea"
        required
        value={formData.requestedResult}
        onChange={(value) => handleChange('requestedResult', value)}
        placeholder="Опишите ожидаемый результат"
        rows={2}
      />

      <FormField
        label="Критерии оценки"
        type="textarea"
        required
        value={formData.criteria}
        onChange={(value) => handleChange('criteria', value)}
        placeholder="Опишите критерии оценки"
        rows={2}
      />

      <div>
        <FormField
          label="Куратор"
          type="select"
          value={formData.tutorId}
          onChange={(value) => handleChange('tutorId', value)}
          options={[
            { value: '', label: 'Выберите куратора' },
            ...tutors.map((tutor) => ({ value: tutor.id, label: tutor.fullName }))
          ]}
          disabled={tutorsLoading}
        />
        {tutorsLoading && (
          <p className="text-sm text-gray-500 mt-1">Загрузка кураторов...</p>
        )}
      </div>

      <FormField
        label="Максимальное количество команд"
        type="number"
        value={formData.maxTeams}
        onChange={(value) => handleChange('maxTeams', value)}
      />

      <FormField
        label="Активный"
        type="select"
        value={formData.isActive.toString()}
        onChange={(value) => handleChange('isActive', value === 'true')}
        options={[
          { value: 'true', label: 'Да' },
          { value: 'false', label: 'Нет' }
        ]}
      />

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

export default function CasesTab({
  onLoadData
}: {
  onLoadData: () => void;
}) {
  const [cases, setCases] = useState<ProjectCaseBriefResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'title' | 'tutorFio' | 'acceptedTeams'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [creatingCase, setCreatingCase] = useState(false);
  const [editingCase, setEditingCase] = useState<ProjectCaseBriefResponse | null>(null);
  const [deletingCase, setDeletingCase] = useState<ProjectCaseBriefResponse | null>(null);
  const [showCreateTutorModal, setShowCreateTutorModal] = useState(false);

  const auth = useSelector((state: RootState) => state.auth);
  const currentUserId = auth.user?.id;

  // Загрузка данных
  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      const casesData = await fetchCases();
      setCases(casesData);
    } catch (err) {
      setError('Ошибка загрузки данных');
      console.error('Ошибка загрузки:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <div>
      {/* Кнопки управления */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2">
          <button
            onClick={async () => {
              setCreatingCase(true);
              try {
                // Создаем кейс с дефолтными данными
                const result = await createCase({
                  title: 'Новый кейс',
                  description: 'Описание кейса',
                  goal: 'Цель проекта',
                  requestedResult: 'Ожидаемый результат',
                  criteria: 'Критерии оценки',
                  tutorId: currentUserId,
                  maxTeams: 1,
                  isActive: true,
                });
                // Открываем модальное окно редактирования созданного кейса
                setEditingCase({
                  id: result.id,
                  title: result.title,
                  tutorId: result.tutorId,
                  tutorFio: result.tutorFio,
                  maxTeams: result.maxTeams,
                  acceptedTeams: result.acceptedTeams,
                  isActive: result.isActive,
                  updatedAt: result.updatedAt,
                  votes: { Neutral: [], Positive: [], Negative: [] },
                });
              } catch (err) {
                console.error('Ошибка создания кейса:', err);
              } finally {
                setCreatingCase(false);
              }
            }}
            disabled={creatingCase}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {creatingCase ? 'Создание...' : 'Создать кейс'}
          </button>

          <button
            onClick={() => setShowCreateTutorModal(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Создать куратора
          </button>
        </div>
      </div>

      {/* Сортировка кейсов */}
      <div className="flex gap-4 mb-4">
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="title">По названию</option>
          <option value="tutorFio">По куратору</option>
          <option value="acceptedTeams">По количеству команд</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="asc">По возрастанию</option>
          <option value="desc">По убыванию</option>
        </select>
      </div>

      <div className="space-y-4">
        {sortedCases.map((caseItem) => (
          <CaseCard
            key={caseItem.id}
            caseItem={caseItem}
            onEdit={setEditingCase}
            onDelete={setDeletingCase}
          />
        ))}
      </div>

      {/* Модальное окно редактирования кейса */}
      {editingCase && (
        <ModalWrapper>
          <h2 className="text-xl font-semibold mb-4">Редактирование кейса</h2>
          <CaseForm
            caseItem={editingCase}
            onClose={() => setEditingCase(null)}
            onSuccess={() => {
              setEditingCase(null);
              loadData();
              onLoadData();
            }}
          />
        </ModalWrapper>
      )}

      {/* Модальное окно подтверждения удаления */}
      {deletingCase && (
        <ModalWrapper maxWidth="max-w-md">
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
                  loadData();
                  onLoadData();
                } catch (err) {
                  console.error('Ошибка удаления кейса:', err);
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Удалить
            </button>
          </div>
        </ModalWrapper>
      )}

      {/* Модальное окно создания куратора */}
      <CreateTutorModal
        isOpen={showCreateTutorModal}
        onClose={() => setShowCreateTutorModal(false)}
        onSuccess={(newTutor) => {
          setShowCreateTutorModal(false);
          // Можно обновить список кураторов, но поскольку он в CaseForm, просто закроем
          console.log('Куратор создан:', newTutor);
        }}
      />
    </div>
  );
}