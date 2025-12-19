'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ApplicationBriefResponse } from '@/types/application';
import type { PreRecordRequest } from '@/types/request';

const getStatusLabel = (status: PreRecordRequest['status']): string => {
  const labels = {
    pending: 'На рассмотрении',
    approved: 'Одобрена',
    rejected: 'Отклонена',
    scheduled: 'Запланирована',
  };
  return labels[status];
};

const getStatusColor = (status: PreRecordRequest['status']): string => {
  const colors = {
    pending: 'text-yellow-600 bg-yellow-50',
    approved: 'text-green-600 bg-green-50',
    rejected: 'text-red-600 bg-red-50',
    scheduled: 'text-blue-600 bg-blue-50',
  };
  return colors[status];
};

const getProjectTitle = (projectId?: string): string => {
  if (!projectId) return 'Не указан';
  // Mock data - in real app this would come from props or context
  const mockProjects = [
    { id: '1', title: 'Проект 1' },
    { id: '2', title: 'Проект 2' },
  ];
  const project = mockProjects.find(p => p.id === projectId);
  return project?.title || 'Неизвестный проект';
};

interface RequestsTabProps {
  applications: ApplicationBriefResponse[];
  loading: boolean;
}

export default function RequestsTab({ applications, loading }: RequestsTabProps) {
  const router = useRouter();

  // Состояние для сортировки заявок
  const [applicationsSortBy, setApplicationsSortBy] = useState<'caseTitle' | 'teamTitle' | 'updatedAt'>('updatedAt');
  const [applicationsSortOrder, setApplicationsSortOrder] = useState<'asc' | 'desc'>('desc');

  // Фильтрация и сортировка заявок
  const sortedApplications = applications.slice().sort((a, b) => {
    let aValue: any, bValue: any;

    switch (applicationsSortBy) {
      case 'caseTitle':
        aValue = a.caseTitle;
        bValue = b.caseTitle;
        break;
      case 'teamTitle':
        aValue = a.teamTitle;
        bValue = b.teamTitle;
        break;
      case 'updatedAt':
        aValue = new Date(a.updatedAt);
        bValue = new Date(b.updatedAt);
        break;
      default:
        return 0;
    }

    if (applicationsSortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Сортировка заявок */}
      <div className="flex gap-4 mb-4">
        <select
          value={applicationsSortBy}
          onChange={(e) => setApplicationsSortBy(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="updatedAt">По дате</option>
          <option value="caseTitle">По кейсу</option>
          <option value="teamTitle">По команде</option>
        </select>
        <select
          value={applicationsSortOrder}
          onChange={(e) => setApplicationsSortOrder(e.target.value as any)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
        >
          <option value="desc">По убыванию</option>
          <option value="asc">По возрастанию</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedApplications.map((application) => (
          <div
            key={application.id}
            onClick={() => router.push(`/requests/${application.id}`)}
            className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer min-h-[150px] flex flex-col hover:bg-gray-100"
          >
            <div className="flex-1">
              <h3 className="text-base font-semibold text-gray-900 mb-3">
                {application.teamTitle}
              </h3>
              <p className="text-sm text-gray-700 mb-2">
                Кейс: {application.caseTitle}
              </p>
              <p className="text-xs text-gray-500">
                Обновлено: {new Date(application.updatedAt).toLocaleDateString('ru-RU')}
              </p>
              {application.unreadMessagesCount > 0 && (
                <p className="text-xs text-blue-600 font-medium">
                  Непрочитанных сообщений: {application.unreadMessagesCount}
                </p>
              )}
            </div>
            <div className="flex justify-end items-end mt-auto pt-2">
              <span className="text-xs text-gray-600 font-medium mr-2">Статус:</span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium`}
                style={{
                  backgroundColor: application.status === 1 ? '#fef3c7' : application.status === 3 ? '#dcfce7' : '#f3f4f6',
                  color: application.status === 1 ? '#d97706' : application.status === 3 ? '#16a34a' : '#374151'
                }}
              >
                {application.status === 0 ? 'В работе' :
                 application.status === 1 ? 'Новая' :
                 application.status === 2 ? 'Встреча запланирована' :
                 application.status === 3 ? 'Принята' : 'Отклонена'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}