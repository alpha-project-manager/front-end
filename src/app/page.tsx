import Link from 'next/link';
import MilestonesWidget from '@/components/MilestonesWidget';

export default function Home() {
  const upcomingMeetings = [
    {
      id: 'm-1',
      title: 'Планирование спринта',
      dateTime: new Date(Date.now() + 86400000).toISOString(),
      projectId: '1',
    },
    {
      id: 'm-2',
      title: 'Демо-клиента',
      dateTime: new Date(Date.now() + 172800000).toISOString(),
      projectId: '2',
    },
    {
      id: 'm-3',
      title: 'Ретроспектива',
      dateTime: new Date(Date.now() + 259200000).toISOString(),
      projectId: undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Добро пожаловать!</h1>
        <p className="text-gray-600 text-lg">Это главная страница вашего приложения. Здесь вы можете видеть общую информацию и быстрый доступ к основным функциям.</p>
      </div>

      {/* Navigation panels + upcoming meetings + milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick navigation panels */}
        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <Link href="/active" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🗂️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Активные проекты</h3>
                <p className="text-sm text-gray-500">Список текущих проектов и статусы.</p>
              </div>
            </div>
          </Link>

          <Link href="/archive" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">🗂️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Архив</h3>
                <p className="text-sm text-gray-500">Полный каталог прошедших проектов.</p>
              </div>
            </div>
          </Link>

          <Link href="/requests" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">📬</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Заявки</h3>
                <p className="text-sm text-gray-500">Просмотр и обработка заявок.</p>
              </div>
            </div>
          </Link>

          <Link href="/settings" className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition card-hover">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-2xl">⚙️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-900">Настройки</h3>
                <p className="text-sm text-gray-500">Управление учётной записью и проектом.</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Upcoming meetings */}
        <aside className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Ближайшие встречи</h2>
            <Link href="/active" className="text-sm text-blue-600 hover:underline">Все проекты</Link>
          </div>

          <div className="space-y-3">
            {upcomingMeetings.map((m) => (
              <div key={m.id} className="flex items-start justify-between p-3 border border-gray-100 rounded">
                <div>
                  <div className="text-sm font-medium text-gray-900">{m.title}</div>
                  <div className="text-xs text-gray-500">{new Date(m.dateTime).toLocaleString()}</div>
                </div>
                <div className="ml-4">
                  {m.projectId ? (
                    <Link href={`/projects/${m.projectId}`} className="text-sm text-blue-600 hover:underline">Перейти</Link>
                  ) : (
                    <span className="text-sm text-gray-400">—</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Контрольные точки */}
      <div className="lg:col-span-1">
        <MilestonesWidget />
      </div>
    </div>
  );
}
