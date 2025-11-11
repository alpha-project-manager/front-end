'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadProjectsFromTimpr } from '@/store/slices/projectsSlice';
import ProjectCard from '@/components/ProjectCard';
import { mockProjects } from '@/data/mockProjects';
import Button from '@/components/Button';

const ActivePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.projects);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingFromTimpr, setIsLoadingFromTimpr] = useState(false);

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    // Создаем временный ID для нового проекта
    const tempId = `new-${Date.now()}`;
    // Переходим на страницу создания проекта с пустыми данными
    router.push(`/projects/${tempId}?mode=create`);
  };

  const handleLoadFromTimpr = async () => {
    setIsLoadingFromTimpr(true);
    try {
      await dispatch(loadProjectsFromTimpr()).unwrap();
      alert('Проекты успешно загружены из Тимпр!');
    } catch (error) {
      console.error('Ошибка загрузки проектов из Тимпр:', error);
      alert('Ошибка при загрузке проектов из Тимпр. Проверьте консоль для деталей.');
    } finally {
      setIsLoadingFromTimpr(false);
    }
  };

  // Показываем только активные проекты
  const activeProjects = mockProjects.filter(project => project.status === 'active' || !project.status);

  const filteredProjects = activeProjects.filter(project => {
    const matchesFilter = filter === 'all' || project.theme === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.curator?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Получаем уникальные темы среди активных проектов
  const themes = Array.from(new Set(activeProjects.map(project => project.theme)));

  const getThemeCount = (theme: string) => {
    return activeProjects.filter(project => project.theme === theme).length;
  };

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Проекты в работе
        </h1>
        <p className="text-gray-600 mb-6">
          Управляйте всеми вашими проектами в одном месте
        </p>

        {/* Статистика */}
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-2 min-w-max">
            <div className="text-center p-4 bg-gray-50 rounded-lg min-w-[120px] flex-shrink-0">
              <div className="text-2xl font-bold text-gray-900">{activeProjects.length}</div>
              <div className="text-sm text-gray-600">Всего</div>
            </div>
            {themes.map((theme, index) => {
              const colors = ['bg-green-50 text-green-600', 'bg-blue-50 text-blue-600', 'bg-yellow-50 text-yellow-600', 'bg-purple-50 text-purple-600', 'bg-orange-50 text-orange-600', 'bg-pink-50 text-pink-600', 'bg-indigo-50 text-indigo-600', 'bg-teal-50 text-teal-600', 'bg-red-50 text-red-600', 'bg-cyan-50 text-cyan-600'];
              const colorClass = colors[index % colors.length];
              return (
                <div key={theme} className={`text-center p-4 rounded-lg min-w-[120px] flex-shrink-0 ${colorClass}`}>
                  <div className="text-2xl font-bold">{getThemeCount(theme)}</div>
                  <div className="text-sm">{theme}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Поиск */}
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Поиск проектов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button variant="primary">
              Найти
            </Button>
          </div>

          {/* Фильтр по темам */}
          <div className="md:w-64">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Все темы ({mockProjects.length})</option>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme} ({getThemeCount(theme)})
                </option>
              ))}
            </select>
          </div>

          {/* Кнопки действий */}
          <div className="flex gap-2">
            <Button
              onClick={handleCreateProject}
              variant="secondary"
              className="whitespace-nowrap"
            >
              Создать
            </Button>
            <Button
              onClick={handleLoadFromTimpr}
              disabled={isLoadingFromTimpr}
              variant="secondary"
              className="whitespace-nowrap"
            >
              {isLoadingFromTimpr ? 'Загрузка...' : 'Выгрузить'}
            </Button>
          </div>
        </div>
      </div>

      {/* Список проектов */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onClick={handleProjectClick}
          />
        ))}
      </div>

      {/* Пустое состояние */}
      {filteredProjects.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Проекты не найдены
          </h3>
          <p className="text-gray-600">
            Попробуйте изменить фильтры или поисковый запрос
          </p>
        </div>
      )}

    </div>
  );
};

export default ActivePage;