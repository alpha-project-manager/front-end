import { Project } from '@/types/project';

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Разработка мобильного приложения',
    description: 'Создание кроссплатформенного мобильного приложения для управления задачами с современным UI/UX дизайном и интеграцией с облачными сервисами.',
    theme: 'Mobile',
    startDate: '2024-01-15',
    endDate: '2024-06-30',
    team: [
      { id: '1', name: 'Алексей Иванов', role: 'Frontend Developer' },
      { id: '2', name: 'Мария Петрова', role: 'Backend Developer' },
      { id: '3', name: 'Дмитрий Сидоров', role: 'UI/UX Designer' },
      { id: '4', name: 'Анна Козлова', role: 'Project Manager' }
    ],
    curator: 'ООО "ТехноИнновации"'
  },
  {
    id: '2',
    title: 'Веб-платформа для электронной коммерции',
    description: 'Разработка полнофункциональной платформы для онлайн-торговли с системой управления заказами, платежами и аналитикой.',
    theme: 'Web',
    startDate: '2024-02-01',
    endDate: '2024-08-15',
    team: [
      { id: '5', name: 'Сергей Волков', role: 'Full Stack Developer' },
      { id: '6', name: 'Елена Морозова', role: 'DevOps Engineer' },
      { id: '7', name: 'Игорь Лебедев', role: 'QA Engineer' }
    ],
    curator: 'ИП "Интернет Магазин"'
  },
  {
    id: '3',
    title: 'Система управления персоналом',
    description: 'Внутренняя система для HR-отдела с функционалом управления сотрудниками, отпусками, зарплатами и отчетностью.',
    theme: 'HR',
    startDate: '2024-03-01',
    endDate: '2024-12-31',
    team: [
      { id: '8', name: 'Ольга Новикова', role: 'Business Analyst' },
      { id: '9', name: 'Павел Соколов', role: 'Backend Developer' },
      { id: '10', name: 'Татьяна Федорова', role: 'Frontend Developer' }
    ],
    curator: 'Внутренний проект'
  },
  {
    id: '4',
    title: 'Мобильная игра "Космические приключения"',
    description: 'Разработка 2D мобильной игры в жанре аркада с мультиплеером и системой достижений.',
    theme: 'Game',
    startDate: '2023-11-01',
    endDate: '2024-05-01',
    team: [
      { id: '11', name: 'Артем Гришин', role: 'Game Developer' },
      { id: '12', name: 'Наталья Кузнецова', role: 'Game Artist' },
      { id: '13', name: 'Роман Орлов', role: 'Sound Designer' }
    ],
    curator: 'Indie Studio'
  },
  {
    id: '5',
    title: 'Аналитическая панель для бизнеса',
    description: 'Дашборд с визуализацией данных, отчетами и прогнозированием для принятия бизнес-решений.',
    theme: 'Analytics',
    startDate: '2023-09-01',
    endDate: '2024-01-31',
    team: [
      { id: '14', name: 'Виктор Медведев', role: 'Data Scientist' },
      { id: '15', name: 'Юлия Романова', role: 'Frontend Developer' },
      { id: '16', name: 'Андрей Козлов', role: 'Data Engineer' }
    ],
    curator: 'ООО "Аналитика Плюс"'
  },
  {
    id: '6',
    title: 'API для интеграции с внешними сервисами',
    description: 'RESTful API для интеграции с различными внешними сервисами и автоматизации бизнес-процессов.',
    theme: 'API',
    startDate: '2024-02-15',
    endDate: '2024-07-01',
    team: [
      { id: '17', name: 'Михаил Смирнов', role: 'Backend Developer' },
      { id: '18', name: 'Алина Попова', role: 'API Designer' },
      { id: '19', name: 'Кирилл Васильев', role: 'DevOps Engineer' }
    ],
    curator: 'ООО "Интеграции"'
  },
  {
    id: '7',
    title: 'Дизайн-система для корпоративного бренда',
    description: 'Создание единой дизайн-системы с компонентами UI/UX для всех продуктов компании.',
    theme: 'Design',
    startDate: '2024-03-01',
    endDate: '2024-09-30',
    team: [
      { id: '20', name: 'Екатерина Волкова', role: 'UI/UX Designer' },
      { id: '21', name: 'Андрей Морозов', role: 'Graphic Designer' },
      { id: '22', name: 'Ольга Соколова', role: 'Brand Manager' }
    ],
    curator: 'Внутренний проект'
  },
  {
    id: '8',
    title: 'Маркетинговая платформа',
    description: 'Автоматизация маркетинговых кампаний с аналитикой и CRM интеграцией.',
    theme: 'Marketing',
    startDate: '2024-01-20',
    endDate: '2024-08-15',
    team: [
      { id: '23', name: 'Денис Козлов', role: 'Marketing Manager' },
      { id: '24', name: 'Анна Лебедева', role: 'Content Manager' },
      { id: '25', name: 'Сергей Новиков', role: 'Analytics Specialist' }
    ],
    curator: 'ООО "Маркетинг Плюс"'
  },
  {
    id: '9',
    title: 'Система кибербезопасности',
    description: 'Комплексная система защиты корпоративных данных и мониторинга угроз.',
    theme: 'Security',
    startDate: '2024-02-10',
    endDate: '2024-12-31',
    team: [
      { id: '26', name: 'Владимир Петров', role: 'Security Engineer' },
      { id: '27', name: 'Мария Сидорова', role: 'Penetration Tester' },
      { id: '28', name: 'Алексей Кузнецов', role: 'Security Analyst' }
    ],
    curator: 'ООО "КиберЗащита"'
  },
  {
    id: '10',
    title: 'DevOps инфраструктура',
    description: 'Настройка CI/CD пайплайнов и автоматизация развертывания приложений.',
    theme: 'DevOps',
    startDate: '2024-01-05',
    endDate: '2024-06-30',
    team: [
      { id: '29', name: 'Игорь Федоров', role: 'DevOps Engineer' },
      { id: '30', name: 'Татьяна Морозова', role: 'System Administrator' },
      { id: '31', name: 'Роман Орлов', role: 'Cloud Engineer' }
    ],
    curator: 'Внутренний проект'
  }
];
