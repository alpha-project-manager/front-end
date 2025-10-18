'use client';

import { useParams, useRouter } from 'next/navigation';
import { mockProjects } from '@/data/mockProjects';
import { Project } from '@/types/project';

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const project = mockProjects.find(p => p.id === projectId);

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
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors">
              Редактировать
            </button>
            <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Поделиться
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Основная информация */}
        <div className="lg:col-span-2 space-y-6">
          {/* Детали проекта */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Детали проекта
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Дата начала</h3>
                <p className="text-gray-900">
                  {new Date(project.startDate).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
              {project.endDate && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Дата завершения</h3>
                  <p className="text-gray-900">
                    {new Date(project.endDate).toLocaleDateString('ru-RU', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              )}
              {project.curator && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Клиент</h3>
                  <p className="text-gray-900">{project.curator}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Боковая панель */}
        <div className="space-y-6">
          {/* Команда */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Команда ({project.team.length})
            </h2>
            <div className="space-y-4">
              {project.team.map((member) => (
                <div key={member.id} className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {member.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Быстрые действия */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Быстрые действия
            </h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-900">Добавить задачу</div>
                <div className="text-sm text-gray-500">Создать новую задачу в проекте</div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-900">Загрузить файлы</div>
                <div className="text-sm text-gray-500">Добавить документы и ресурсы</div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="font-medium text-gray-900">Создать отчет</div>
                <div className="text-sm text-gray-500">Сгенерировать отчет по проекту</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;
