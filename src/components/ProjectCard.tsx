'use client';

import { ProjectBriefResponse } from '@/types/project';

const ProjectCard = ({ project, onClick }: { project: ProjectBriefResponse; onClick: (id: string) => void }) => {
  const getThemeColor = (semester: number) => {
    switch (semester) {
      case 0:
        return 'bg-orange-100 text-orange-800';
      case 1:
        return 'bg-green-100 text-green-800';
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
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getThemeColor(project.semester as number)}`}>
          {project.semester === 0 ? 'Осень' : 'Весна'}
        </span>
      </div>

      {/* Описание */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
        Команда: {project.teamTitle || 'Нет'}
      </p>

      {/* Команда */}
      <div className="flex items-center justify-between">
        {/* Даты */}
        <div className="text-right">
          <p className="text-xs text-gray-500">
            Год: {project.academicYear}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
