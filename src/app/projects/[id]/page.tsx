'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadProjectNew, updateProjectNewThunk, createProjectNewThunk } from '@/store/slices/projectsSlice';
import { loadMeetings } from '@/store/slices/meetingsSlice';
import { createMeeting, updateMeeting, fetchMeeting } from '@/services/meetings';

import MeetingModal from '@/components/MeetingModal';
import MilestoneModal from '@/components/MilestoneModal';
import MilestoneCard from '@/components/MilestoneCard';
import LoginDialog from '@/components/LoginDialog';
import Button from '@/components/Button';
import { selectCurrentUser } from '@/store/selectors';
import type { ProjectBriefResponse, CreateNewProjectRequest, UpdateProjectRequest } from '@/types/project';
import type { Meeting } from '@/types/database';
import type { CreateMeetingRequest, UpdateMeetingRequest } from '@/types/meeting';
import { Milestone } from '@/types/milestone';

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const isCreateMode = searchParams.get('mode') === 'create';
  
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const { currentProject, newStatus, newError } = useAppSelector((state) => state.projects);
  const { items: meetings } = useAppSelector((state) => state.meetings);

  const [tab, setTab] = useState<'desc' | 'meetings' | 'milestones'>('desc');
  const [showEdit, setShowEdit] = useState(isCreateMode);

  // Модалки
  const [showLogin, setShowLogin] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);

  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | undefined>();
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | undefined>();

  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'title' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [projectData, setProjectData] = useState<Partial<ProjectBriefResponse>>({
    title: '',
    description: '',
    teamTitle: '',
    meetingUrl: '',
  });
  const [isSaving, setIsSaving] = useState(false);

  // Загружаем проект при монтировании
  useEffect(() => {
    if (!isCreateMode && projectId) {
      dispatch(loadProjectNew(projectId));
    }
  }, [projectId, isCreateMode, dispatch]);

  // Загружаем встречи для проекта
  useEffect(() => {
    if (!isCreateMode && projectId) {
      dispatch(loadMeetings(projectId));
    }
  }, [projectId, isCreateMode, dispatch]);

  // Инициализируем данные проекта при загрузке
  useEffect(() => {
    if (currentProject && !isCreateMode) {
      setProjectData({
        title: currentProject.title,
        description: currentProject.description,
        teamTitle: currentProject.teamTitle,
        meetingUrl: currentProject.meetingUrl,
        status: currentProject.status,
        semester: currentProject.semester,
        academicYear: currentProject.academicYear,
      });
    }
  }, [currentProject, isCreateMode]);

  // Хэндлеры для встреч
  const handleCreateMeeting = () => {
    setSelectedMeeting(undefined);
    setShowMeetingModal(true);
  };

  const handleCreateMeetingWithIncompleteTasks = async () => {
    // Найти последнюю встречу в отсортированном списке
    if (meetings.length > 0) {
      const sortedMeetings = [...meetings].sort(
        (a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
      );
      const lastMeetingBrief = sortedMeetings[0];

      try {
        // Загружаем полную информацию о последней встрече
        const lastMeetingFull = await fetchMeeting(projectId, lastMeetingBrief.id);

        // Получить незавершённые задачи
        const incompleteTasks = lastMeetingFull.todoTasks
          .filter(t => !t.isCompleted)
          .map(t => ({
            id: `task-${Date.now()}-${Math.random()}`, // генерируем новый ID для новой встречи
            meetingId: '', // будет установлено при создании
            isCompleted: false,
            title: t.title,
          }));

        // Создаем встречу-шаблон с незавершёнными задачами
        const newMeetingTemplate: Meeting = {
          id: `meeting-new-${Date.now()}`,
          projectId,
          description: '',
          dateTime: new Date().toISOString(),
          isFinished: false,
          todoTasks: incompleteTasks,
        };

        setSelectedMeeting(newMeetingTemplate);
        setShowMeetingModal(true);
      } catch (error) {
        console.error('Ошибка загрузки последней встречи:', error);
        alert('Ошибка при загрузке данных предыдущей встречи. Создаётся пустая встреча.');
        setSelectedMeeting(undefined);
        setShowMeetingModal(true);
      }
    } else {
      // Если встреч нет, просто открываем пустую модалку
      setSelectedMeeting(undefined);
      setShowMeetingModal(true);
    }
  };

  const handleEditMeeting = async (meeting: any) => {
    try {
      const fullMeeting = await fetchMeeting(projectId, meeting.id);
      const meetingForModal: Meeting = {
        id: fullMeeting.id,
        projectId,
        title: '',
        description: fullMeeting.description,
        resultMark: fullMeeting.resultMark,
        isFinished: fullMeeting.isFinished,
        dateTime: fullMeeting.dateTime,
        todoTasks: fullMeeting.todoTasks.map((t: any) => ({
          id: t.id,
          meetingId: fullMeeting.id,
          isCompleted: t.isCompleted,
          title: t.title,
        })),
      };
      setSelectedMeeting(meetingForModal);
      setShowMeetingModal(true);
    } catch (error) {
      console.error('Ошибка загрузки встречи:', error);
      alert('Ошибка при загрузке встречи. Проверьте консоль для деталей.');
    }
  };

  const handleSaveMeeting = async (meetingData: Partial<Meeting>) => {
    try {
      if (selectedMeeting?.id) {
        // Редактирование существующей встречи
        const todoTasks = (meetingData.todoTasks || []).map(t => ({
          id: t.id,
          isCompleted: t.isCompleted,
          title: t.title,
        }));
        await updateMeeting(projectId, selectedMeeting.id, {
          description: meetingData.description || '',
          resultMark: meetingData.resultMark || 0,
          isFinished: meetingData.isFinished || false,
          dateTime: meetingData.dateTime || '',
          todoTasks,
        });
      } else {
        // Создание новой встречи
        const todoTasks = (meetingData.todoTasks || []).map(t => t.title);
        await createMeeting(projectId, {
          dateTime: meetingData.dateTime || '',
          todoTasks,
        });
      }
      // Перезагрузить встречи после сохранения
      dispatch(loadMeetings(projectId));
    } catch (error) {
      console.error('Ошибка сохранения встречи:', error);
      alert('Ошибка при сохранении встречи. Проверьте консоль для деталей.');
    }
  };

  const filteredMeetings = useMemo(() => {
    let filtered = meetings.filter(m => 
      m.title?.toLowerCase().includes(query.toLowerCase()) ?? false
    );
    
    // Сортировка
    const sortedFiltered = [...filtered].sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case 'date':
          aValue = new Date(a.dateTime).getTime();
          bValue = new Date(b.dateTime).getTime();
          break;
        case 'title':
          aValue = a.title || '';
          bValue = b.title || '';
          break;
        case 'status':
          aValue = a.isFinished ? 1 : 0;
          bValue = b.isFinished ? 1 : 0;
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
    
    return sortedFiltered;
  }, [meetings, query, sortBy, sortOrder]);

  // Хэндлеры для контрольных точек
  const handleCreateMilestone = () => {
    setSelectedMilestone(undefined);
    setShowMilestoneModal(true);
  }

  const handleEditMilestone = (milestone: Milestone) => {
    setSelectedMilestone(milestone);
    setShowMilestoneModal(true);
  };

  const handleSaveMilestone = (milestoneData: Partial<Milestone>) => {
    if (selectedMilestone) {
      // Редактирование существующей контрольной точки
    }
  }

  const handleSaveProject = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    // Проверяем обязательные поля
    if (!projectData.title || !projectData.description || !projectData.teamTitle) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSaving(true);
    try {
      const createData: CreateNewProjectRequest = {
        title: projectData.title,
        description: projectData.description,
        teamTitle: projectData.teamTitle,
        meetingUrl: projectData.meetingUrl,
      };
      
      const newProject = await dispatch(createProjectNewThunk(createData)).unwrap();
      
      // Перенаправляем на страницу созданного проекта
      router.push(`/projects/${newProject.id}`);
    } catch (error) {
      console.error('Ошибка при создании проекта:', error);
      alert('Ошибка при создании проекта. Проверьте консоль для деталей.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateProject = async () => {
    if (!user || !currentProject) {
      setShowLogin(true);
      return;
    }

    // Проверяем обязательные поля
    if (!projectData.title || !projectData.description || !projectData.teamTitle) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSaving(true);
    try {
      const updateData: UpdateProjectRequest = {
        title: projectData.title,
        description: projectData.description,
        teamTitle: projectData.teamTitle,
        meetingUrl: projectData.meetingUrl,
        status: projectData.status || 1, // InWork по умолчанию
        semester: projectData.semester || 1, // Spring по умолчанию
        academicYear: projectData.academicYear || 2024,
      };
      
      await dispatch(updateProjectNewThunk({ 
        id: currentProject.id, 
        data: updateData 
      })).unwrap();
      
      setShowEdit(false);
    } catch (error) {
      console.error('Ошибка при обновлении проекта:', error);
      alert('Ошибка при обновлении проекта. Проверьте консоль для деталей.');
    } finally {
      setIsSaving(false);
    }
  };

  // Если режим создания, показываем форму создания проекта
  if (isCreateMode) {
    return (
      <div className="space-y-6">
        {/* Навигация */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <button
            onClick={() => router.push('/active')}
            className="hover:text-gray-700 transition-colors"
          >
            Проекты
          </button>
          <span>›</span>
          <span className="text-gray-900">Создание проекта</span>
        </div>

        {/* Заголовок */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Создание нового проекта
          </h1>
        </div>

        {/* Форма создания проекта */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название проекта *
              </label>
              <input
                type="text"
                value={projectData.title || ''}
                onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите название проекта"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание *
              </label>
              <textarea
                value={projectData.description || ''}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Введите описание проекта"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название команды *
              </label>
              <input
                type="text"
                value={projectData.teamTitle || ''}
                onChange={(e) => setProjectData({ ...projectData, teamTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите название команды"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ссылка на встречу
              </label>
              <input
                type="url"
                value={projectData.meetingUrl || ''}
                onChange={(e) => setProjectData({ ...projectData, meetingUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://meet.google.com/..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => router.push('/active')}
                variant="secondary"
              >
                Отмена
              </Button>
              <Button
                onClick={handleSaveProject}
                disabled={isSaving}
                variant="primary"
              >
                {isSaving ? 'Сохранение...' : 'Создать проект'}
              </Button>
            </div>
          </div>
        </div>

        <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
      </div>
    );
  }

  if (newStatus === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (newError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Ошибка загрузки: {newError}</p>
        <button
          onClick={() => router.push('/active')}
          className="text-blue-600 hover:underline"
        >
          Вернуться к проектам
        </button>
      </div>
    );
  }

  if (!currentProject) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            Проект не найден
          </h1>
          <p className="text-gray-600 mb-6">
            Проект с ID "{projectId}" не существует
          </p>
          <button
            onClick={() => router.push('/active')}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            Вернуться к списку проектов
          </button>
        </div>
      </div>
    );
  }

  // Если режим редактирования, показываем форму редактирования
  if (showEdit) {
    return (
      <div className="space-y-6">
        {/* Навигация */}
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <button
            onClick={() => router.push('/active')}
            className="hover:text-gray-700 transition-colors"
          >
            Проекты
          </button>
          <span>›</span>
          <span className="text-gray-900">Редактирование проекта</span>
        </div>

        {/* Заголовок */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Редактирование проекта
          </h1>
        </div>

        {/* Форма редактирования проекта */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название проекта *
              </label>
              <input
                type="text"
                value={projectData.title || ''}
                onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите название проекта"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Описание *
              </label>
              <textarea
                value={projectData.description || ''}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Введите описание проекта"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Название команды *
              </label>
              <input
                type="text"
                value={projectData.teamTitle || ''}
                onChange={(e) => setProjectData({ ...projectData, teamTitle: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите название команды"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ссылка на встречу
              </label>
              <input
                type="url"
                value={projectData.meetingUrl || ''}
                onChange={(e) => setProjectData({ ...projectData, meetingUrl: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://meet.google.com/..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={() => setShowEdit(false)}
                variant="secondary"
              >
                Отмена
              </Button>
              <Button
                onClick={handleUpdateProject}
                disabled={isSaving}
                variant="primary"
              >
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </Button>
            </div>
          </div>
        </div>

        <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
      </div>
    );
  }

  const getSemesterColor = (semester: number) => {
    switch (semester) {
      case 0: // Autumn
        return 'bg-orange-100 text-orange-800';
      case 1: // Spring
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 0: // Created
        return 'bg-gray-100 text-gray-800';
      case 1: // InWork
        return 'bg-blue-100 text-blue-800';
      case 2: // Completed
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: number) => {
    switch (status) {
      case 0: return 'Создан';
      case 1: return 'В работе';
      case 2: return 'Завершён';
      default: return 'Неизвестно';
    }
  };

  return (
    <div className="space-y-6">
      {/* Навигация */}
      <div className="flex items-center space-x-2 text-sm text-gray-500">
        <button
          onClick={() => router.push('/active')}
          className="hover:text-gray-700 transition-colors"
        >
          Проекты
        </button>
        <span>›</span>
        <span className="text-gray-900">{currentProject.title}</span>
      </div>

      {/* Заголовок проекта */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {currentProject.title}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentProject.status)}`}>
                {getStatusLabel(currentProject.status)}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSemesterColor(currentProject.semester)}`}>
                {currentProject.semester === 0 ? 'Autumn' : 'Spring'} {currentProject.academicYear}
              </span>
            </div>
            
            <p className="text-gray-600 text-lg mb-4">
              {currentProject.description}
            </p>
            
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <span>👥</span>
                <span>Команда: {currentProject.teamTitle}</span>
              </div>
              {currentProject.tutor && (
                <div className="flex items-center gap-2">
                  <span>👨‍🏫</span>
                  <span>Тьютор: {currentProject.tutor.fullName}</span>
                </div>
              )}
            </div>
          </div>

          {/* Действия */}
          <div className="flex flex-col gap-3">
            <Button
              variant="secondary"
              fullWidth
              onClick={() => {
                if (user) {
                  setShowEdit(!showEdit);
                } else {
                  setShowLogin(true);
                }
              }}
            >
              Редактировать
            </Button>
          </div>
        </div>
      </div>

      {/* Табы */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 pt-4 border-b border-gray-200">
          <div className="flex gap-6">
            <button
              onClick={() => setTab('desc')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                tab === 'desc'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 cursor-pointer'
              }`}
            >
              Описание
              {tab === 'desc' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
              )}
            </button>
            <button
              onClick={() => setTab('meetings')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                tab === 'meetings'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 cursor-pointer'
              }`}
            >
              Встречи
              {tab === 'meetings' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
              )}
            </button>
            <button
              onClick={() => setTab('milestones')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                tab === 'milestones'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900 cursor-pointer'
              }`}
            >
              Контрольные точки
              {tab === 'milestones' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
              )}
            </button>
          </div>
        </div>
        <div className="p-6">
          {tab === 'desc' ? (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Описание проекта</h3>
                <p className="text-gray-600">
                  {currentProject.description || 'Описание не указано'}
                </p>
              </div>
              {currentProject.meetingUrl && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Ссылка на встречу</h3>
                  <a
                    href={currentProject.meetingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {currentProject.meetingUrl}
                  </a>
                </div>
              )}
            </div>
          ) : tab === 'meetings' ? (
            <div className="space-y-6">
              {/* Заголовок и поиск */}
              <div className="flex items-center justify-between gap-4">
                <input
                  type="text"
                  placeholder="Поиск встреч..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {/* Элементы сортировки */}
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-600">Сортировать по:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'title' | 'status')}
                  className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
                >
                  <option value="date">Дате</option>
                  <option value="title">Названию</option>
                  <option value="status">Статусу</option>
                </select>
                <Button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  variant='secondary'
                  className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  {sortOrder === 'asc' ? '↑ По возрастанию' : '↓ По убыванию'}
                </Button>
                <Button
                  onClick={() => meetings.length > 0 ? handleCreateMeetingWithIncompleteTasks() : handleCreateMeeting()}
                  variant="primary"
                  className="whitespace-nowrap"
                >
                  + Создать встречу
                </Button>
              </div>

              {/* Список встреч */}
              <div className="space-y-4">
                {filteredMeetings.length === 0 ? (
                  <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="text-gray-500">
                      <div className="text-4xl mb-2">📅</div>
                      <p className="text-sm">Встреч не найдено</p>
                    </div>
                  </div>
                ) : (
                  filteredMeetings.map((meeting) => (
                    <div
                      key={meeting.id}
                      onClick={() => handleEditMeeting(meeting as any)}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {meeting.title || 'Встреча'}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          meeting.isFinished
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {meeting.isFinished ? '✓ Завершена' : 'Запланирована'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-6 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <span>📅</span>
                          <span>{new Date(meeting.dateTime).toLocaleString('ru-RU')}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>⭐</span>
                          <span>{meeting.resultMark || 'Нет оценки'}/10</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span>✅</span>
                          <span>{meeting.completedTasks}/{meeting.totalTasks} задач</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* TODO: Добавить контрольные точки */}
              <div className="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
                <div className="text-gray-500">
                  <div className="text-4xl mb-2">🎯</div>
                  <p className="text-sm">Контрольные точки будут добавлены в следующей итерации</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Модалки */}
      <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
      <MeetingModal
        isOpen={showMeetingModal}
        onClose={() => setShowMeetingModal(false)}
        onSave={handleSaveMeeting}
        meeting={selectedMeeting}
        projectId={projectId}
      />

      <MilestoneModal
        isOpen={showMilestoneModal}
        onClose={() => setShowMilestoneModal(false)}
        onSave={() => {}}
        milestone={selectedMilestone}
      />
    </div>
  );
};

export default ProjectDetailPage;