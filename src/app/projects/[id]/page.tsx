'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';
import { mockProjects } from '@/data/mockProjects';
import ProjectDetails from '@/components/ProjectDetails';
import TasksPanel from '@/components/TasksPanel';
import Modal from '@/components/Modal';
import LoginDialog from '@/components/LoginDialog';
import { useAppSelector } from '@/store/hooks';
import { selectCurrentUser } from '@/store/selectors';

const ProjectDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const project = mockProjects.find(p => p.id === projectId);
  const user = useAppSelector(selectCurrentUser);
  const [tab, setTab] = useState<'desc' | 'tasks'>('desc');
  const [showEdit, setShowEdit] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const tasks = useMemo(() => [], []);

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
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors" onClick={() => user ? setShowEdit(true) : setShowLogin(true)}>
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
      <Modal open={showEdit} onClose={() => setShowEdit(false)} title="Редактирование проекта" actions={
        <>
          <button className="px-4 py-2 border rounded-md" onClick={() => setShowEdit(false)}>Отмена</button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md" onClick={() => setShowEdit(false)}>Сохранить</button>
        </>
      }>
        <ProjectDetails project={project} />
      </Modal>

      <LoginDialog open={showLogin} onClose={() => setShowLogin(false)} />
    </div>
  );
};

export default ProjectDetailPage;
