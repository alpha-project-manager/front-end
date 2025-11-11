import type { PreRecordRequest } from '@/types/request';

export const mockRequests: PreRecordRequest[] = [
  {
    id: 'req-1',
    createdBy: 'user-1',
    source: 'telegram_bot',
    projectId: 'proj-1',
    preferredSlots: [
      { start: '2024-01-15T10:00:00', end: '2024-01-15T11:00:00' },
      { start: '2024-01-16T14:00:00', end: '2024-01-16T15:00:00' },
    ],
    status: 'pending',
    createdAt: '2024-01-10T09:00:00',
    votes: [],
  },
  {
    id: 'req-2',
    createdBy: 'user-2',
    source: 'bank_portal',
    projectId: 'proj-2',
    preferredSlots: [
      { start: '2024-01-20T09:00:00', end: '2024-01-20T10:00:00' },
    ],
    status: 'approved',
    createdAt: '2024-01-12T11:00:00',
    updatedAt: '2024-01-13T10:00:00',
    votes: [{ userId: 'user-3', vote: 1 }],
  },
  {
    id: 'req-3',
    createdBy: 'user-3',
    source: 'telegram_bot',
    projectId: 'proj-3',
    preferredSlots: [
      { start: '2024-01-25T13:00:00', end: '2024-01-25T14:00:00' },
    ],
    status: 'pending',
    createdAt: '2024-01-14T15:00:00',
    votes: [],
  },
  {
    id: 'req-4',
    createdBy: 'user-4',
    source: 'bank_portal',
    preferredSlots: [
      { start: '2024-01-18T10:00:00', end: '2024-01-18T11:00:00' },
    ],
    status: 'rejected',
    createdAt: '2024-01-11T08:00:00',
    updatedAt: '2024-01-12T09:00:00',
    votes: [],
  },
  {
    id: 'req-5',
    createdBy: 'user-5',
    source: 'telegram_bot',
    projectId: 'proj-4',
    preferredSlots: [
      { start: '2024-01-22T14:00:00', end: '2024-01-22T15:00:00' },
    ],
    status: 'scheduled',
    createdAt: '2024-01-13T12:00:00',
    updatedAt: '2024-01-14T10:00:00',
    votes: [{ userId: 'user-1', vote: 1 }, { userId: 'user-2', vote: 1 }],
  },
];

