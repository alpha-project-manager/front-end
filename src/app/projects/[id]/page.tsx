'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { mockProjects } from '@/data/mockProjects';
import ProjectDetails from '@/components/ProjectDetails';
import MeetingModal from '@/components/MeetingModal';
import LoginDialog from '@/components/LoginDialog';
import Button from '@/components/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/selectors';
import { createProjectViaAPI } from '@/store/slices/projectsSlice';
import { Project } from '@/types/project';
import type { Meeting } from '@/types/database';

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const isCreateMode = searchParams.get('mode') === 'create';
  
  const project = mockProjects.find(p => p.id === projectId);
  const [localProject, setLocalProject] = useState<Project | null>(project || null);
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<'desc' | 'meetings'>('desc');
  const [showEdit, setShowEdit] = useState(isCreateMode);
  const [showLogin, setShowLogin] = useState(false);
  const [showMeetingModal, setShowMeetingModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | undefined>();
  const [meetings, setMeetings] = useState<Meeting[]>([
    {
      id: 'meeting-1',
      projectId: projectId,
      title: 'Планирование спринта',
      description: 'Планирование спринтаdfffffffffff',
      dateTime: new Date(Date.now() + 86400000).toISOString(),
      resultMark: 5,
      isFinished: false,
    },
    {
      id: 'meeting-2',
      projectId: projectId,
      title: 'Обсуждение требований',
      description: 'Обсуждение требований',
      dateTime: new Date(Date.now() + 172800000).toISOString(),
      resultMark: 4,
      isFinished: false,
    },
  ]);
  const [query, setQuery] = useState('');
  const [projectData, setProjectData] = useState<Partial<Project>>({
    title: '',
    description: '',
    theme: '',
    startDate: '',
    endDate: '',
    curator: '',
    team: [],
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateMeeting = () => {
    setSelectedMeeting(undefined);
    setShowMeetingModal(true);
  };

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting);
    setShowMeetingModal(true);
  };

  const handleSaveMeeting = (meetingData: Partial<Meeting>) => {
    if (selectedMeeting) {
      // Редактирование существующей встречи
      setMeetings(meetings.map(m => 
        m.id === selectedMeeting.id 
          ? { ...m, ...meetingData }
          : m
      ));
    } else {
      // Создание новой встречи
      const newMeeting: Meeting = {
        id: `meeting-${Date.now()}`,
        projectId,
        ...meetingData,
      } as Meeting;
      setMeetings([...meetings, newMeeting]);
    }
  };

  const filteredMeetings = useMemo(() => 
    meetings.filter(m => 
      m.description?.toLowerCase().includes(query.toLowerCase()) ?? false
    ),
    [meetings, query]
  );

  // Инициализируем данные проекта при входе в режим редактирования
  useEffect(() => {
    if (project && !isCreateMode && showEdit) {
      setProjectData({
        title: project.title,
        description: project.description,
        theme: project.theme,
        startDate: project.startDate,
        endDate: project.endDate || '',
        curator: project.curator || '',
        team: project.team || [],
      });
      setLocalProject(project as Project);
    }
  }, [project, isCreateMode, showEdit]);

  useEffect(() => {
    // keep local copy in sync if project changes externally
    if (project) setLocalProject(project as Project);
  }, [project]);

  const handleSaveProject = async () => {
    if (!user) {
      setShowLogin(true);
      return;
    }

    // Проверяем обязательные поля
    if (!projectData.title || !projectData.description || !projectData.theme || !projectData.startDate) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSaving(true);
    try {
      const newProject = await dispatch(createProjectViaAPI({
        title: projectData.title,
        description: projectData.description,
        theme: projectData.theme,
        startDate: projectData.startDate,
        endDate: projectData.endDate || undefined,
        curator: projectData.curator || undefined,
        team: projectData.team || [],
      })).unwrap();
      
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
    if (!user) {
      setShowLogin(true);
      return;
    }

    if (!project) return;

    // Проверяем обязательные поля
    if (!projectData.title || !projectData.description || !projectData.theme || !projectData.startDate) {
      alert('Пожалуйста, заполните все обязательные поля');
      return;
    }

    setIsSaving(true);
    try {
      // TODO: Добавить функцию обновления через API
      // await dispatch(updateProjectViaAPI({ id: project.id, data: {...} })).unwrap();
      
      // Временно просто закрываем режим редактирования
      alert('Обновление проекта через API пока не реализовано');
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
                value={projectData.title}
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
                value={projectData.description}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Введите описание проекта"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тема *
              </label>
              <input
                type="text"
                value={projectData.theme}
                onChange={(e) => setProjectData({ ...projectData, theme: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Например: Web, Mobile, API"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата начала *
                </label>
                <input
                  type="date"
                  value={projectData.startDate}
                  onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата окончания
                </label>
                <input
                  type="date"
                  value={projectData.endDate}
                  onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Куратор
              </label>
              <input
                type="text"
                value={projectData.curator}
                onChange={(e) => setProjectData({ ...projectData, curator: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите имя куратора"
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

  // Если режим редактирования и проект существует, показываем форму редактирования
  if (showEdit && project && !isCreateMode) {
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
                value={projectData.title}
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
                value={projectData.description}
                onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={4}
                placeholder="Введите описание проекта"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Тема *
              </label>
              <input
                type="text"
                value={projectData.theme}
                onChange={(e) => setProjectData({ ...projectData, theme: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Например: Web, Mobile, API"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата начала *
                </label>
                <input
                  type="date"
                  value={projectData.startDate}
                  onChange={(e) => setProjectData({ ...projectData, startDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Дата окончания
                </label>
                <input
                  type="date"
                  value={projectData.endDate}
                  onChange={(e) => setProjectData({ ...projectData, endDate: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Куратор
              </label>
              <input
                type="text"
                value={projectData.curator}
                onChange={(e) => setProjectData({ ...projectData, curator: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Введите имя куратора"
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

  if (!project) {
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

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case 'Mobile':
        return 'bg-green-100 text-green-800';
      case 'Web':
        return 'bg-blue-100 text-blue-800';
      case 'HR':
        return 'bg-yellow-100 text-yellow-800';
      case 'Game':
        return 'bg-purple-100 text-purple-800';
      case 'Analytics':
        return 'bg-orange-100 text-orange-800';
      case 'API':
        return 'bg-pink-100 text-pink-800';
      case 'Design':
        return 'bg-indigo-100 text-indigo-800';
      case 'Marketing':
        return 'bg-teal-100 text-teal-800';
      case 'Security':
        return 'bg-red-100 text-red-800';
      case 'DevOps':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
        <span className="text-gray-900">{project.title}</span>
      </div>

      {/* Заголовок проекта */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
             <div className="flex items-center gap-4 mb-4">
               <h1 className="text-3xl font-bold text-gray-900">
                 {project.title}
               </h1>
               <span className={`px-3 py-1 rounded-full text-sm font-medium ${getThemeColor(project.theme)}`}>
                 {project.theme}
               </span>
               {/* Status selector */}
               <select
                 value={localProject?.status || 'active'}
                 onChange={(e) => {
                   const newStatus = e.target.value;
                   // update mockProjects in-memory
                   const idx = mockProjects.findIndex((p) => p.id === project.id);
                   if (idx !== -1) {
                     mockProjects[idx].status = newStatus;
                   }
                   setLocalProject(prev => prev ? { ...prev, status: newStatus } : prev);
                   // refresh router to update lists
                   router.refresh();
                 }}
                 className="ml-3 px-2 py-1 border border-gray-200 rounded-md text-sm"
               >
                 <option value="active">Active</option>
                 <option value="archived">Archived</option>
                 <option value="draft">Draft</option>
                 <option value="completed">Completed</option>
               </select>
             </div>
            
            <p className="text-gray-600 text-lg mb-6">
              {project.description}
            </p>
          </div>

          {/* Действия */}
          <div className="flex flex-col gap-3">
            <Button
              variant="secondary"
              fullWidth
            >
              Поделиться
            </Button>
          </div>
        </div>
      </div>

      {/* Табы по вайрфрейму */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 pt-4 border-b border-gray-200">
          <div className="flex gap-6">
            <button
              onClick={() => setTab('desc')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                tab === 'desc'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
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
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Встречи
              {tab === 'meetings' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
              )}
            </button>
          </div>
        </div>
        <div className="p-6">
          {tab === 'desc' ? (
            <ProjectDetails 
              project={project} 
              isEditing={showEdit}
              onEdit={() => {
                if (user) {
                  setShowEdit(!showEdit);
                } else {
                  setShowLogin(true);
                }
              }}
              onSave={handleUpdateProject}
            />
          ) : (
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
                <Button
                  onClick={handleCreateMeeting}
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
                      onClick={() => handleEditMeeting(meeting)}
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
                      </div>
                    </div>
                  ))
                )}
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
      />
    </div>
  );
};

export default ProjectDetailPage;
