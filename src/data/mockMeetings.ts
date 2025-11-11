import type { Meeting, TodoTask } from '@/types/database';

// Sample tasks
const sampleTasks: TodoTask[] = [
  {
    id: 'task-1',
    meetingId: 'meeting-1',
    title: 'Подготовить документацию проекта',
    isCompleted: false,
  },
  {
    id: 'task-2',
    meetingId: 'meeting-1',
    title: 'Настроить окружение разработки',
    isCompleted: true,
  },
  {
    id: 'task-3',
    meetingId: 'meeting-1',
    title: 'Провести код-ревью для PR #42',
    isCompleted: false,
  },
  {
    id: 'task-4',
    meetingId: 'meeting-2',
    title: 'Написать тесты для нового модуля',
    isCompleted: false,
  },
  {
    id: 'task-5',
    meetingId: 'meeting-2',
    title: 'Обновить зависимости',
    isCompleted: true,
  },
  {
    id: 'task-6',
    meetingId: 'meeting-2',
    title: 'Задокументировать API',
    isCompleted: false,
  },
];

// Mock meetings with tasks
export const mockMeetings: Meeting[] = [
  {
    id: 'meeting-1',
    projectId: '1',
    title: 'Планирование спринта',
    description: 'Планирование спринтаdfffffffffff',
    dateTime: new Date(Date.now() + 86400000).toISOString(),
    resultMark: 5,
    isFinished: false,
    tasks: sampleTasks.filter(t => t.meetingId === 'meeting-1'),
  },
  {
    id: 'meeting-2',
    projectId: '1',
    title: 'Обсуждение требований',
    description: 'Обсуждение требований',
    dateTime: new Date(Date.now() + 172800000).toISOString(),
    resultMark: 4,
    isFinished: false,
    tasks: sampleTasks.filter(t => t.meetingId === 'meeting-2'),
  },
];

// Helper function to get meetings by project ID
export const getMeetingsByProjectId = (projectId: string): Meeting[] => {
  return mockMeetings.filter(m => m.projectId === projectId);
};

// Helper function to get incomplete tasks from a meeting
export const getIncompleteTasks = (meeting: Meeting): TodoTask[] => {
  return (meeting.tasks || []).filter(t => !t.isCompleted);
};
