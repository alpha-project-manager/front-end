'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadProjectsNew, loadProjectsFromTimpr } from '@/store/slices/projectsSlice';
import { loadCases } from '@/store/slices/casesSlice';
import ProjectCard from '@/components/ProjectCard';
import Button from '@/components/Button';

const ActivePage = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { newItems: projects, newStatus, newError } = useAppSelector((state) => state.projects);
  const { items: cases, status: casesStatus, error: casesError } = useAppSelector((state) => state.cases);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingFromTimpr, setIsLoadingFromTimpr] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          dispatch(loadProjectsNew()),
          dispatch(loadCases()),
        ]);
      } catch (error) {
        console.error('Ошибка загрузки данных:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [dispatch]);

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

  // Показываем все проекты
  const activeProjects = projects;

  // Получаем уникальные семестры среди активных проектов
  const semesters = Array.from(new Set(activeProjects.map(project => 
    project.semester === 0 ? 'Autumn' : 'Spring'
  )));

  const filteredProjects = activeProjects.filter(project => {
    const projectSemester = project.semester === 0 ? 'Autumn' : 'Spring';
    const matchesFilter = filter === 'all' || projectSemester === filter;
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.teamTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.tutor?.fullName?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getSemesterCount = (semester: string) => {
    return activeProjects.filter(project => {
      const projectSemester = project.semester === 0 ? 'Autumn' : 'Spring';
      return projectSemester === semester;
    }).length;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-6"></div>
            <div className="flex gap-4">
              <div className="h-20 bg-gray-200 rounded w-32"></div>
              <div className="h-20 bg-gray-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Все проекты
        </h1>
        <p className="text-gray-600 mb-6">
          Управляйте всеми вашими проектами в одном месте
        </p>

        {(newError || casesError) && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-2">Ошибки загрузки данных</h3>
            <div className="space-y-1">
              {newError && <p className="text-red-700">• Проекты: {newError}</p>}
              {casesError && <p className="text-red-700">• Кейсы: {casesError}</p>}
            </div>
            <p className="text-red-600 text-sm mt-2">
              Проверьте подключение к API серверу и попробуйте перезагрузить страницу.
            </p>
          </div>
        )}

        {/* Статистика */}
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-2 min-w-max">
            <div className="text-center p-4 bg-gray-50 rounded-lg min-w-[120px] flex-shrink-0">
              <div className="text-2xl font-bold text-gray-900">{activeProjects.length}</div>
              <div className="text-sm text-gray-600">Всего</div>
            </div>
            {semesters.map((semester, index) => {
              const colors = ['bg-green-50 text-green-600', 'bg-blue-50 text-blue-600', 'bg-yellow-50 text-yellow-600', 'bg-purple-50 text-purple-600', 'bg-orange-50 text-orange-600'];
              const colorClass = colors[index % colors.length];
              return (
                <div key={semester} className={`text-center p-4 rounded-lg min-w-[120px] flex-shrink-0 ${colorClass}`}>
                  <div className="text-2xl font-bold">{getSemesterCount(semester)}</div>
                  <div className="text-sm">{semester}</div>
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

          {/* Фильтр по семестрам */}
          <div className="md:w-64">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Все семестры ({activeProjects.length})</option>
              {semesters.map((semester) => (
                <option key={semester} value={semester}>
                  {semester} ({getSemesterCount(semester)})
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