'use client';

import { Project } from '@/types/project';
import { useState } from 'react';

interface Props {
  project: Project;
}

const ProjectDetails = ({ project }: Props) => {
  const [name, setName] = useState(project.title);
  const [desc, setDesc] = useState(project.description);
  const [university, setUniversity] = useState(project.curator ?? '');
  const [curator, setCurator] = useState(project.curator ?? '');

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-gray-700">Название проекта</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-gray-700">Куратор</label>
          <input value={curator} onChange={(e) => setCurator(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="text-sm text-gray-700">Описание</label>
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} rows={4} className="mt-1 w-full border rounded-md px-3 py-2" />
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-gray-700">ВУЗ</label>
          <input value={university} onChange={(e) => setUniversity(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
        <div>
          <label className="text-sm text-gray-700">Статус</label>
          <input value={project.theme} disabled className="mt-1 w-full border rounded-md px-3 py-2 bg-gray-50" />
        </div>
        <div>
          <label className="text-sm text-gray-700">Куратор</label>
          <input value={curator} onChange={(e) => setCurator(e.target.value)} className="mt-1 w-full border rounded-md px-3 py-2" />
        </div>
      </div>
      <div className="flex justify-end">
        <button className="px-4 py-2 border rounded-md">Сохранить</button>
      </div>
    </div>
  );
};

export default ProjectDetails;


