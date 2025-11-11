export interface RequestMessage {
  id: string;
  requestId: string;
  content: string;
  direction: 'incoming' | 'outgoing'; // incoming = from team, outgoing = from bot (via site)
  timestamp: string;
  isRead: boolean;
  senderName?: string;
}

export const mockRequestMessages: RequestMessage[] = [
  {
    id: 'msg-1',
    requestId: 'req-1',
    content: 'Здравствуйте! Мы заинтересованы в кейсе "Система управления проектами"',
    direction: 'incoming',
    timestamp: '2025-11-10T10:00:00Z',
    isRead: true,
    senderName: 'Команда №5',
  },
  {
    id: 'msg-2',
    requestId: 'req-1',
    content: 'Спасибо за интерес! Можете ли вы рассказать о вашем опыте?',
    direction: 'outgoing',
    timestamp: '2025-11-10T11:30:00Z',
    isRead: true,
  },
  {
    id: 'msg-3',
    requestId: 'req-1',
    content: 'У нас есть опыт разработки с React и Node.js. Готовы начать в ближайшую неделю.',
    direction: 'incoming',
    timestamp: '2025-11-10T12:00:00Z',
    isRead: true,
    senderName: 'Команда №5',
  },
  {
    id: 'msg-4',
    requestId: 'req-1',
    content: 'Отлично! Давайте назначим встречу для обсуждения деталей проекта.',
    direction: 'outgoing',
    timestamp: '2025-11-10T13:00:00Z',
    isRead: true,
  },
  {
    id: 'msg-5',
    requestId: 'req-1',
    content: 'Согласны! Какое время вам подходит?',
    direction: 'incoming',
    timestamp: '2025-11-10T14:00:00Z',
    isRead: true,
    senderName: 'Команда №5',
  },
];

export function getRequestMessages(requestId: string): RequestMessage[] {
  return mockRequestMessages.filter(msg => msg.requestId === requestId);
}

export function addRequestMessage(
  requestId: string,
  content: string,
  direction: 'incoming' | 'outgoing'
): RequestMessage {
  const newMessage: RequestMessage = {
    id: `msg-${Date.now()}`,
    requestId,
    content,
    direction,
    timestamp: new Date().toISOString(),
    isRead: true,
    senderName: direction === 'incoming' ? 'Команда №5' : undefined,
  };
  mockRequestMessages.push(newMessage);
  return newMessage;
}
