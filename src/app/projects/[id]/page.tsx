'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useMemo, useState, useEffect } from 'react';
import { mockProjects } from '@/data/mockProjects';
import ProjectDetails from '@/components/ProjectDetails';
import TasksPanel from '@/components/TasksPanel';
import LoginDialog from '@/components/LoginDialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/selectors';
import { createProjectViaAPI } from '@/store/slices/projectsSlice';
import { Project } from '@/types/project';

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = params.id as string;
  const isCreateMode = searchParams.get('mode') === 'create';
  
  const project = mockProjects.find(p => p.id === projectId);
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<'desc' | 'tasks'>('desc');
  const [showEdit, setShowEdit] = useState(isCreateMode);
  const [showLogin, setShowLogin] = useState(false);
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
  const tasks = useMemo(() => [], []);

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
    }
  }, [project, isCreateMode, showEdit]);

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
              <button
                onClick={() => router.push('/active')}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSaveProject}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Сохранение...' : 'Создать проект'}
              </button>
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
              <button
                onClick={() => setShowEdit(false)}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleUpdateProject}
                disabled={isSaving}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
              </button>
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
             </div>
            
            <p className="text-gray-600 text-lg mb-6">
              {project.description}
            </p>
          </div>

          {/* Действия */}
          <div className="flex flex-col gap-3">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors" onClick={() => {
              if (user) {
                setShowEdit(true);
              } else {
                setShowLogin(true);
              }
            }}>
              Редактировать
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Поделиться
            </button>
          </div>
        </div>
      </div>

      {/* Табы по вайрфрейму */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 pt-4 border-b">
          <div className="inline-flex items-center gap-1 bg-gray-100 rounded-md p-1">
            <button className={`px-3 py-1 rounded ${tab==='desc' ? 'bg-white border' : ''}`} onClick={() => setTab('desc')}>Описание</button>
            <button className={`px-3 py-1 rounded ${tab==='tasks' ? 'bg-white border' : ''}`} onClick={() => setTab('tasks')}>Задачи</button>
          </div>
        </div>
        <div className="p-6">
          {tab === 'desc' ? (
            <ProjectDetails project={project} />
          ) : (
            <TasksPanel tasks={tasks} />
          )}
        </div>
      </div>

      {/* Модалки */}
      <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default ProjectDetailPage;
