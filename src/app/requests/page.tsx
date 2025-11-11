'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { mockRequests } from '@/data/mockRequests';
import { mockCases } from '@/data/mockCases';
import type { PreRecordRequest } from '@/types/request';
import type { ProjectCase } from '@/types/database';
import { mockProjects } from '@/data/mockProjects';
import CaseLikeButton from '@/components/CaseLikeButton';
import type { RootState } from '@/store';

type TabType = 'requests' | 'cases' | 'questions';

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
  const project = mockProjects.find(p => p.id === projectId);
  return project?.title || 'Неизвестный проект';
};

// Компонент карточки кейса
const CaseCard = ({ caseItem }: { caseItem: ProjectCase }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const spotsLeft = caseItem.maxTeams - caseItem.acceptedTeams;
  const auth = useSelector((state: RootState) => state.auth);
  const currentUserId = auth.user?.id;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {caseItem.title}
          </h3>
          <p className="text-sm text-gray-600">
            Куратор: {caseItem.tutor || 'Не указан'}
          </p>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <div className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-700">
            Мест осталось: {spotsLeft}
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-700">
            Команд: {caseItem.acceptedTeams}
          </div>
        </div>
      </div>

      {/* Collapsible секция */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">
            {isExpanded ? '▼' : '▶'} Информация о проекте
          </span>
        </button>
        
        {isExpanded && (
          <div className="p-4 border-t border-gray-200 space-y-3 bg-gray-50">
            {caseItem.description && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Описание:</h4>
                <p className="text-sm text-gray-700">{caseItem.description}</p>
              </div>
            )}
            {caseItem.goal && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Цель:</h4>
                <p className="text-sm text-gray-700">{caseItem.goal}</p>
              </div>
            )}
            {caseItem.requestedResult && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Ожидаемый результат:</h4>
                <p className="text-sm text-gray-700">{caseItem.requestedResult}</p>
              </div>
            )}
            {caseItem.criteria && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-1">Критерии оценки:</h4>
                <p className="text-sm text-gray-700">{caseItem.criteria}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Секция с лайками/дизлайками */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {!currentUserId && 'Авторизуйтесь для оценки кейса'}
          </p>
          <CaseLikeButton 
            caseId={caseItem.id} 
            userId={currentUserId}
            showCounts
          />
        </div>
      </div>
    </div>
  );
};

export default function Requests() {
  const [activeTab, setActiveTab] = useState<TabType>('requests');

  return (
    <div className="space-y-6">
      {/* Табы */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 pt-4">
          <div className="flex gap-6 border-b border-gray-300">
            <button
              onClick={() => setActiveTab('requests')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'requests'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Заявки
              {activeTab === 'requests' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('cases')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'cases'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Кейсы
              {activeTab === 'cases' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('questions')}
              className={`pb-4 px-2 font-medium transition-colors relative ${
                activeTab === 'questions'
                  ? 'text-gray-900'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Вопросы
              {activeTab === 'questions' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-900"></span>
              )}
            </button>
          </div>
        </div>

        {/* Контент табов */}
        <div className="p-6">
          {activeTab === 'requests' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockRequests.map((request, index) => (
                <div
                  key={request.id}
                  className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer min-h-[150px] flex flex-col"
                >
                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-gray-900 mb-3">
                      Заявка №{index + 1}
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Проект: {getProjectTitle(request.projectId)}
                    </p>
                  </div>
                  <div className="flex justify-end items-end mt-auto pt-2">
                    <span className="text-xs text-gray-600 font-medium mr-2">Статус:</span>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusLabel(request.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'cases' && (
            <div className="space-y-4">
              {mockCases.map((caseItem) => (
                <CaseCard key={caseItem.id} caseItem={caseItem} />
              ))}
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="text-center py-12">
              <p className="text-gray-600">Раздел "Вопросы" в разработке</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
