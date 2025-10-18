'use client';

import { ProjectCardProps } from '@/types/project';

const ProjectCard = ({ project, onClick }: ProjectCardProps) => {
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
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover cursor-pointer"
      onClick={() => onClick(project.id)}
    >
      {/* Заголовок и тема */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {project.title}
        </h3>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThemeColor(project.theme)}`}>
          {project.theme}
        </span>
      </div>

      {/* Описание */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        {project.description}
      </p>

      {/* Команда */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex -space-x-2">
            {project.team.slice(0, 3).map((member, index) => (
              <div
                key={member.id}
                className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white"
                title={member.name}
              >
                <span className="text-white text-xs font-medium">
                  {member.name.charAt(0).toUpperCase()}
                </span>
              </div>
            ))}
            {project.team.length > 3 && (
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-white">
                <span className="text-gray-600 text-xs font-medium">
                  +{project.team.length - 3}
                </span>
              </div>
            )}
          </div>
          <span className="ml-2 text-sm text-gray-500">
            {project.team.length} участников
          </span>
        </div>

        {/* Даты */}
        <div className="text-right">
          <p className="text-xs text-gray-500">
            Начало: {new Date(project.startDate).toLocaleDateString('ru-RU')}
          </p>
          {project.endDate && (
            <p className="text-xs text-gray-500">
              Завершение: {new Date(project.endDate).toLocaleDateString('ru-RU')}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
