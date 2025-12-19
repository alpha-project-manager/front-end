'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadApplications } from '@/store/slices/applicationsSlice';
import { loadCases } from '@/store/slices/casesSlice';
import { loadProjectsNew } from '@/store/slices/projectsSlice';
import MilestonesWidget from '@/components/MilestonesWidget';

export default function Home() {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  
  // Получаем данные из Redux store
  const applications = useAppSelector((state) => state.applications.items);
  const applicationsStatus = useAppSelector((state) => state.applications.status);
  const applicationsError = useAppSelector((state) => state.applications.error);
  const cases = useAppSelector((state) => state.cases.items);
  const casesStatus = useAppSelector((state) => state.cases.status);
  const casesError = useAppSelector((state) => state.cases.error);
  const projects = useAppSelector((state) => state.projects.newItems);
  const projectsStatus = useAppSelector((state) => state.projects.newStatus);
  const projectsError = useAppSelector((state) => state.projects.newError);

  // Загружаем данные при монтировании компонента
  useEffect(() => {
    const loadData = async () => {
      try {
        await Promise.all([
          dispatch(loadApplications()),
          dispatch(loadCases()),
          dispatch(loadProjectsNew()),
        ]);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

  // Фильтруем данные для отображения
  const recentApplications = [...applications]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 3);

  const activeCases = cases.filter(c => c.isActive && c.acceptedTeams < c.maxTeams).slice(0, 3);
  const recentProjects = projects
    .filter(p => p.status === 1) // InWork
    .slice(0, 3);

  const upcomingMeetings = [
    {
      id: 'm-1',
      title: 'Планирование спринта',
      dateTime: new Date(Date.now() + 86400000).toISOString(),
      projectId: '1',
    },
    {
      id: 'm-2',
      title: 'Демо-клиента',
      dateTime: new Date(Date.now() + 172800000).toISOString(),
      projectId: '2',
    },
    {
      id: 'm-3',
      title: 'Ретроспектива',
      dateTime: new Date(Date.now() + 259200000).toISOString(),
      projectId: undefined,
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  // Проверяем, есть ли ошибки загрузки
  const hasErrors = applicationsStatus === 'failed' || casesStatus === 'failed' || projectsStatus === 'failed';

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Добро пожаловать!</h1>
        <p className="text-gray-600 text-lg">
          Это главная страница вашего приложения. Здесь вы можете видеть общую информацию и быстрый доступ к основным функциям.
        </p>
      </div>

      {/* Отображение ошибок API */}
      {hasErrors && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-red-800 mb-2">Ошибки загрузки данных</h2>
          <div className="space-y-2">
            {applicationsStatus === 'failed' && applicationsError && (
              <p className="text-red-700">• Заявки: {applicationsError}</p>
            )}
            {casesStatus === 'failed' && casesError && (
              <p className="text-red-700">• Кейсы: {casesError}</p>
            )}
            {projectsStatus === 'failed' && projectsError && (
              <p className="text-red-700">• Проекты: {projectsError}</p>
            )}
          </div>
          <p className="text-red-600 text-sm mt-2">
            Проверьте подключение к API серверу и попробуйте перезагрузить страницу.
          </p>
        </div>
      )}

      {/* Navigation panels + quick stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick navigation panels */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/active" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🗂️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Активные проекты</h3>
                <p className="text-sm text-gray-500">
                  {recentProjects.length} проектов в работе
                </p>
              </div>
            </div>
          </Link>

          <Link href="/archive" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🗂️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Архив</h3>
                <p className="text-sm text-gray-500">Завершённые проекты</p>
              </div>
            </div>
          </Link>

          <Link href="/requests" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📬</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Заявки</h3>
                <p className="text-sm text-gray-500">
                  {applications.length} заявок на рассмотрении
                </p>
              </div>
            </div>
          </Link>

          <Link href="/settings" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Настройки</h3>
                <p className="text-sm text-gray-500">Управление учётной записью</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick stats */}
        <aside className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Быстрая статистика</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Активные проекты</span>
              <span className="font-semibold text-gray-900">{recentProjects.length}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Заявки</span>
              <span className="font-semibold text-gray-900">{applications.length}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Доступные кейсы</span>
              <span className="font-semibold text-gray-900">{activeCases.length}</span>
            </div>
          </div>
        </aside>
      </div>

      {/* Recent activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent applications */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Последние заявки</h2>
            <Link href="/requests" className="text-sm text-blue-600 hover:underline">Все заявки</Link>
          </div>
          
          <div className="space-y-3">
            {recentApplications.length > 0 ? (
              recentApplications.map((app) => (
                <div key={app.id} className="flex items-start justify-between p-3 border border-gray-100 rounded">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{app.teamTitle}</div>
                    <div className="text-xs text-gray-500">{app.caseTitle}</div>
                    <div className="text-xs text-gray-400">
                      {new Date(app.updatedAt).toLocaleDateString('ru-RU')}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{
                        backgroundColor: app.status === 1 ? '#fef3c7' : app.status === 3 ? '#dcfce7' : '#f3f4f6',
                        color: app.status === 1 ? '#d97706' : app.status === 3 ? '#16a34a' : '#374151'
                      }}
                    >
                      {app.status === 0 ? 'В работе' : 
                       app.status === 1 ? 'Новая' :
                       app.status === 2 ? 'Встреча запланирована' :
                       app.status === 3 ? 'Принята' : 'Отклонена'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Заявок пока нет</p>
            )}
          </div>
        </div>

        {/* Active cases */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Доступные кейсы</h2>
            <Link href="/requests" className="text-sm text-blue-600 hover:underline">Все кейсы</Link>
          </div>
          
          <div className="space-y-3">
            {activeCases.length > 0 ? (
              activeCases.map((caseItem) => (
                <div key={caseItem.id} className="flex items-start justify-between p-3 border border-gray-100 rounded">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{caseItem.title}</div>
                    <div className="text-xs text-gray-500">{caseItem.tutorFio || 'Куратор не указан'}</div>
                    <div className="text-xs text-gray-400">
                      Мест: {caseItem.acceptedTeams}/{caseItem.maxTeams}
                    </div>
                  </div>
                  <div className="ml-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                      Доступно
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">Доступных кейсов нет</p>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming meetings */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Ближайшие встречи</h2>
          <Link href="/active" className="text-sm text-blue-600 hover:underline">Все проекты</Link>
        </div>

        <div className="space-y-3">
          {upcomingMeetings.map((m) => (
            <div key={m.id} className="flex items-start justify-between p-3 border border-gray-100 rounded">
              <div>
                <div className="text-sm font-medium text-gray-900">{m.title}</div>
                <div className="text-xs text-gray-500">{new Date(m.dateTime).toLocaleString('ru-RU')}</div>
              </div>
              <div className="ml-4">
                {m.projectId ? (
                  <Link href={`/projects/${m.projectId}`} className="text-sm text-blue-600 hover:underline">Перейти</Link>
                ) : (
                  <span className="text-sm text-gray-400">—</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Milestones widget */}
      <div className="lg:col-span-1">
        <MilestonesWidget />
      </div>
    </div>
  );
}