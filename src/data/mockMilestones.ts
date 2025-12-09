import type { Milestone } from '@/types/milestone';

export const mockMilestones: Milestone[] = [
  {
    id: 'milestone-1',
    title: 'Запуск платформы',
    description: 'Финальный запуск платформы в продакшн',
    type: 'global',
    targetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    priority: 'critical',
    progress: 65,
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),

  },
  {
    id: 'milestone-2',
    title: 'MVP проекта',
    description: 'Создание минимально жизнеспособного продукта',
    type: 'global',
    targetDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'high',
    progress: 25,
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),

  },
  {
    id: 'milestone-3',
    title: 'UI/UX дизайн',
    description: 'Завершение дизайна пользовательского интерфейса',
    type: 'local',
    projectId: '1',
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'completed',
    priority: 'medium',
    progress: 100,
    createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),

  },
  {
    id: 'milestone-4',
    title: 'Backend API',
    description: 'Разработка и тестирование серверной части',
    type: 'local',
    projectId: '1',
    targetDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'in_progress',
    priority: 'high',
    progress: 45,
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),

  },
  {
    id: 'milestone-5',
    title: 'Мобильное приложение',
    description: 'Разработка нативного мобильного приложения',
    type: 'local',
    projectId: '2',
    targetDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'overdue',
    priority: 'high',
    progress: 30,
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),

  },
  {
    id: 'milestone-6',
    title: 'Тестирование системы',
    description: 'Комплексное тестирование всей системы',
    type: 'global',
    targetDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
    status: 'pending',
    priority: 'medium',
    progress: 0,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),

  },
];

// Вспомогательные функции
export const getMilestonesByProject = (projectId: string): Milestone[] => {
  return mockMilestones.filter(m => m.projectId === projectId);
};

export const getGlobalMilestones = (): Milestone[] => {
  return mockMilestones.filter(m => m.type === 'global');
};

export const getOverdueMilestones = (): Milestone[] => {
  const now = new Date();
  return mockMilestones.filter(m => 
    m.status !== 'completed' && new Date(m.targetDate) < now
  );
};

export const getUpcomingMilestones = (): Milestone[] => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return mockMilestones.filter(m => {
    const targetDate = new Date(m.targetDate);
    return targetDate >= now && targetDate <= nextWeek && m.status !== 'completed';
  });
};