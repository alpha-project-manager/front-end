'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadApplication, updateApplicationStatus, sendApplicationMessage } from '@/store/slices/applicationsSlice';
import type { ApplicationResponse, SendMessageRequest } from '@/types/application';

const getStatusLabel = (status: number): string => {
  const labels: Record<number, string> = {
    0: 'В работе',
    1: 'Новая',
    2: 'Встреча запланирована',
    3: 'Принята',
    4: 'Отклонена',
  };
  return labels[status] || 'Неизвестно';
};

const getStatusColor = (status: number): string => {
  const colors: Record<number, string> = {
    0: 'text-blue-600 bg-blue-50 border-blue-200',
    1: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    2: 'text-purple-600 bg-purple-50 border-purple-200',
    3: 'text-green-600 bg-green-50 border-green-200',
    4: 'text-red-600 bg-red-50 border-red-200',
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const requestId = params.id as string;

  const application = useAppSelector((state) => state.applications.currentApplication);
  const { currentStatus, currentError } = useAppSelector((state) => state.applications);

  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<number>(1); // По умолчанию "Новая"
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Загружаем заявку при монтировании
  useEffect(() => {
    if (requestId) {
      dispatch(loadApplication(requestId));
    }
  }, [requestId, dispatch]);

  // Обновляем локальное состояние при загрузке данных
  useEffect(() => {
    if (application) {
      setStatus(application.status);
      setMessages(application.messages || []);
    }
  }, [application]);

  // Скролл к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !application) return;

    setIsLoading(true);
    try {
      const messageData: SendMessageRequest = {
        content: newMessage.trim()
      };
      
      await dispatch(sendApplicationMessage({ 
        applicationId: application.id, 
        data: messageData 
      })).unwrap();
      
      setNewMessage('');
      
      // Перезагружаем заявку для получения обновленных сообщений
      dispatch(loadApplication(application.id));
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: number) => {
    if (!application) return;

    try {
      await dispatch(updateApplicationStatus({
        id: application.id,
        data: { status: newStatus }
      })).unwrap();
      
      setStatus(newStatus);
    } catch (error) {
      console.error('Ошибка обновления статуса:', error);
    }
  };

  const handleDeleteRequest = () => {
    if (confirm('Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.')) {
      // TODO: Реализовать удаление через API
      router.push('/requests');
    }
  };

  if (currentStatus === 'loading') {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (currentError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Ошибка загрузки: {currentError}</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline"
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Заявка не найдена</p>
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline"
        >
          Вернуться назад
        </button>
      </div>
    );
  }

  return (
    <div className="max-h-[90vh] flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Заголовок */}
      <div className="border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <button
                onClick={() => router.back()}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium cursor-pointer"
              >
                ← Назад
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                {application.teamTitle}
              </h1>
            </div>
            <p className="text-sm text-gray-600">
              Кейс: {application.caseTitle}
            </p>
            <p className="text-sm text-gray-600">
              Telegram: @{application.telegramUsername}
            </p>
            <p className="text-xs text-gray-500">
              Обновлено: {new Date(application.updatedAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
          {/* <div className="flex gap-2">
            <span
              className={`px-3 py-1.5 rounded text-xs font-medium border ${getStatusColor(status)}`}
            >
              {getStatusLabel(status)}
            </span>
          </div> */}
        </div>
      </div>

      {/* Основной контент: два столбца */}
      <div className="flex-1 flex overflow-hidden">
        {/* Левая часть - Сообщения */}
        <div className="flex-1 min-w-0 flex flex-col border-r border-gray-200">
          {/* Список сообщений */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>Нет сообщений. Начните разговор!</p>
              </div>
            ) : (
              messages.map((msg: any) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.fromStudents ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg break-words max-w-xs lg:max-w-md ${
                      msg.fromStudents
                        ? 'bg-gray-200 text-gray-900 rounded-bl-none '
                        : 'bg-blue-600 text-white rounded-br-none'
                    }`}
                  >
                    <p className="text-sm break-words">{msg.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(msg.timestamp).toLocaleTimeString('ru-RU', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Поле ввода */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex-shrink-0">
            <div className="flex gap-3">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Напишите сообщение..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                rows={3}
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={isLoading || !newMessage.trim()}
                className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 font-medium text-sm transition-colors flex-shrink-0"
              >
                {isLoading ? 'Отправка...' : 'Отправить'}
              </button>
            </div>
          </div>
        </div>

        {/* Правая часть - Информация о заявке */}
        <aside className="w-64 flex-shrink-0 bg-gray-50 border-l border-gray-200 p-4 overflow-y-auto">
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Информация о заявке
          </h2>

          <div className="space-y-4">
            {/* Статус с селектом */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-2">Статус</p>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => handleStatusChange(Number(e.target.value))}
                  className={`w-full px-3 py-2 rounded border appearance-none cursor-pointer text-sm font-medium pr-8 ${getStatusColor(status)}`}
                >
                  <option value={0}>В работе</option>
                  <option value={1}>Новая</option>
                  <option value={2}>Встреча запланирована</option>
                  <option value={3}>Принята</option>
                  <option value={4}>Отклонена</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Кейс */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Кейс</p>
              <p className="text-sm text-gray-900">{application.caseTitle}</p>
            </div>

            {/* Команда */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Команда</p>
              <p className="text-sm text-gray-900">{application.teamTitle}</p>
            </div>

            {/* Telegram */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Telegram</p>
              <p className="text-sm text-gray-900">{application.telegramUsername}</p>
            </div>

            {/* Дата обновления */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Обновлено</p>
              <p className="text-sm text-gray-900">
                {new Date(application.updatedAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
            {/* Удаление заявки */}
            <div>
              <button
                onClick={handleDeleteRequest}
                className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-500 font-medium text-sm transition-colors"
              >
                Удалить заявку
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}