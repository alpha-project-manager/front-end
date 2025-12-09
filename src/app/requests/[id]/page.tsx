'use client';

import { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockRequests } from '@/data/mockRequests';
import { mockProjects } from '@/data/mockProjects';
import { getRequestMessages, addRequestMessage, type RequestMessage } from '@/data/mockRequestMessages';

const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    pending: 'На рассмотрении',
    approved: 'Одобрена',
    rejected: 'Отклонена',
    scheduled: 'Запланирована',
  };
  return labels[status] || status;
};

const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = {
    pending: 'text-yellow-600 bg-yellow-50 border-yellow-200',
    approved: 'text-green-600 bg-green-50 border-green-200',
    rejected: 'text-red-600 bg-red-50 border-red-200',
    scheduled: 'text-blue-600 bg-blue-50 border-blue-200',
  };
  return colors[status] || 'text-gray-600 bg-gray-50 border-gray-200';
};

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const requestId = params.id as string;

  const request = mockRequests.find(r => r.id === requestId);
  const project = request?.projectId
    ? mockProjects.find(p => p.id === request.projectId)
    : null;

  const [messages, setMessages] = useState<RequestMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected' | 'scheduled'>(
    (request?.status as 'pending' | 'approved' | 'rejected' | 'scheduled') || 'pending'
  );
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Инициализируем сообщения при загрузке
  useEffect(() => {
    const loadedMessages = getRequestMessages(requestId);
    setMessages(loadedMessages);
    scrollToBottom();
  }, [requestId]);

  // Скролл к последнему сообщению
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      // Добавляем исходящее сообщение
      const sentMsg = addRequestMessage(requestId, newMessage, 'outgoing');
      setMessages([...messages, sentMsg]);
      setNewMessage('');

      // Имитируем задержку перед ответом
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Добавляем входящее сообщение (имитация ответа от бота)
      const replyMsg = addRequestMessage(
        requestId,
        'Спасибо за ваше сообщение! Мы его учтём.',
        'incoming'
      );
      setMessages(prev => [...prev, replyMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteRequest = () => {
    if (confirm('Вы уверены, что хотите удалить эту заявку? Это действие нельзя отменить.')) {
      // Удаляем из mockRequests
      const index = mockRequests.findIndex(r => r.id === requestId);
      if (index !== -1) {
        mockRequests.splice(index, 1);
      }
      // Перенаправляем обратно к списку заявок
      router.push('/requests');
    }
  };

  if (!request) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 mb-4">Запрос не найден</p>
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
                {project?.title || 'Запрос'}
              </h1>
            </div>
            <p className="text-sm text-gray-600">
              Заявка от {new Date(request.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
          <div className="flex gap-2">
            <span
              className={`px-3 py-1.5 rounded text-xs font-medium border ${getStatusColor(status)}`}
            >
              {getStatusLabel(status)}
            </span>
          </div>
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
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${msg.direction === 'outgoing' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`px-4 py-2 rounded-lg break-words ${
                      msg.direction === 'outgoing'
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-gray-100 text-gray-900 rounded-bl-none'
                    }`}
                  >
                    {msg.senderName && (
                      <p className="text-xs font-semibold mb-1 opacity-75">
                        {msg.senderName}
                      </p>
                    )}
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
                placeholder="Здравствуйте...."
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
                  onChange={(e) => setStatus(e.target.value as 'pending' | 'approved' | 'rejected' | 'scheduled')}
                  className={`w-full px-3 py-2 rounded border appearance-none cursor-pointer text-sm font-medium pr-8 ${getStatusColor(status)}`}
                >
                  <option value="pending">На рассмотрении</option>
                  <option value="approved">Одобрена</option>
                  <option value="rejected">Отклонена</option>
                  <option value="scheduled">Запланирована</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Проект */}
            {project && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-1">Проект</p>
                <p className="text-sm text-gray-900">{project.title}</p>
              </div>
            )}

            {/* Дата создания */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Дата создания</p>
              <p className="text-sm text-gray-900">
                {new Date(request.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>

            {/* Источник */}
            <div>
              <p className="text-xs font-medium text-gray-600 mb-1">Источник</p>
              <p className="text-sm text-gray-900">
                {request.source === 'telegram_bot' ? 'Telegram Bot' : 'Bank Portal'}
              </p>
            </div>

            {/* Предпочитаемые слоты */}
            {request.preferredSlots.length > 0 && (
              <div>
                <p className="text-xs font-medium text-gray-600 mb-2">
                  Предпочитаемое время
                </p>
                <div className="space-y-1">
                  {request.preferredSlots.map((slot, idx) => (
                    <div key={idx} className="text-xs text-gray-700 bg-white p-2 rounded border border-gray-200">
                      {new Date(slot.start).toLocaleString('ru-RU')} —{' '}
                      {new Date(slot.end).toLocaleTimeString('ru-RU')}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
