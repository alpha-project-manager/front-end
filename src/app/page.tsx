export default function Home() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Добро пожаловать!
        </h1>
        <p className="text-gray-600 text-lg">
          Это главная страница вашего приложения. Здесь вы можете видеть общую информацию и быстрый доступ к основным функциям.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">
              Статистика
            </h3>
          </div>
          <p className="text-gray-600">
            Просматривайте аналитику и отчеты по вашей деятельности.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">
              Быстрые действия
            </h3>
          </div>
          <p className="text-gray-600">
            Выполняйте часто используемые операции одним кликом.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 card-hover">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔔</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 ml-4">
              Уведомления
            </h3>
          </div>
          <p className="text-gray-600">
            Получайте важные обновления и сообщения.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Последние активности
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">A</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Новая задача создана
                </p>
                <p className="text-xs text-gray-500">
                  2 часа назад
                </p>
              </div>
            </div>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              Новое
            </span>
          </div>
          
          <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">B</span>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Задача выполнена
                </p>
                <p className="text-xs text-gray-500">
                  5 часов назад
                </p>
              </div>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
              Завершено
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
