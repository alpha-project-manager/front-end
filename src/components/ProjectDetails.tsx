'use client';

import { Project } from '@/types/project';
import { useState } from 'react';
import Button from './Button';

interface Props {
  project: Project;
  isEditing?: boolean;
  onEdit?: () => void;
  onSave?: () => void;
}

const ProjectDetails = ({ project, isEditing = false, onEdit, onSave }: Props) => {
  const [name, setName] = useState(project.title);
  const [desc, setDesc] = useState(project.description);
  const [curator, setCurator] = useState(project.curator ?? '');
  const [participants, setParticipants] = useState(
    project.team?.map(m => `${m.name} ${m.role}`).join('\n') || ''
  );
  const [selectedProject, setSelectedProject] = useState(project.title);

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
  };

  return (
    <div className="space-y-6">
      {/* Проект в системе */}
      <div className="flex gap-3 items-center">
        <div className="flex-1 relative">
          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white appearance-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed pr-10"
          >
            <option value={project.title}>{project.title}</option>
          </select>
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <Button variant="secondary" disabled={!isEditing}>
          Выгрузить
        </Button>
      </div>

      {/* Поля проекта */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Название проекта
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Описание
          </label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Куратор
          </label>
          <input
            type="text"
            value={curator}
            onChange={(e) => setCurator(e.target.value)}
            disabled={!isEditing}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Участники
          </label>
          <div className="border border-gray-300 rounded-lg p-4 bg-white min-h-[200px]">
            <div className="text-xs text-gray-500 mb-2">ФИО группа роль</div>
            <textarea
              value={participants}
              onChange={(e) => setParticipants(e.target.value)}
              disabled={!isEditing}
              placeholder="Введите участников проекта..."
              className="w-full h-full min-h-[150px] border-0 focus:ring-0 focus:outline-none resize-none disabled:bg-transparent disabled:cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-end gap-3 pt-4">
        {!isEditing ? (
          <Button variant="dark" onClick={onEdit}>
            Редактировать
          </Button>
        ) : (
          <>
            <Button variant="secondary" onClick={() => onEdit?.()}>
              Отмена
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Сохранить
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectDetails;


