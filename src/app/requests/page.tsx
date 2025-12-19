'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { fetchCases } from '@/services/cases';
import { fetchApplications } from '@/services/applications';
import { mockRequests } from '@/data/mockRequests';
import { mockProjects } from '@/data/mockProjects';
import CaseLikeButton from '@/components/CaseLikeButton';
import type { RootState } from '@/store';
import type { ProjectCaseBriefResponse } from '@/types/case';
import type { ApplicationBriefResponse } from '@/types/application';
import type { PreRecordRequest } from '@/types/request';

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
const CaseCard = ({ caseItem }: { caseItem: ProjectCaseBriefResponse }) => {
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
            Куратор: {caseItem.tutorFio || 'Не указан'}
          </p>
        </div>
        <div className="flex flex-col gap-2 ml-4">
          <div className="bg-gray-50 border border-gray-200 rounded px-3 py-1.5 text-xs text-gray-700">
            Команд: {caseItem.acceptedTeams}/{caseItem.maxTeams}
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
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Статус:</h4>
              <p className="text-sm text-gray-700">{caseItem.isActive ? 'Активный' : 'Неактивный'}</p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-1">Последнее обновление:</h4>
              <p className="text-sm text-gray-700">{new Date(caseItem.updatedAt).toLocaleDateString('ru-RU')}</p>
            </div>
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
  const router = useRouter();
  
  // Состояние для данных
  const [cases, setCases] = useState<ProjectCaseBriefResponse[]>([]);
  const [applications, setApplications] = useState<ApplicationBriefResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Состояние для сортировки кейсов
  const [sortBy, setSortBy] = useState<'title' | 'tutorFio' | 'acceptedTeams'>('title');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Состояние для сортировки заявок
  const [applicationsSortBy, setApplicationsSortBy] = useState<'caseTitle' | 'teamTitle' | 'updatedAt'>('updatedAt');
  const [applicationsSortOrder, setApplicationsSortOrder] = useState<'asc' | 'desc'>('desc');

  // Загрузка данных при смене табов
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        switch (activeTab) {
          case 'cases':
            const casesData = await fetchCases();
            setCases(casesData);
            break;
          case 'requests':
            const applicationsData = await fetchApplications();
            setApplications(applicationsData);
            break;
          default:
            break;
        }
      } catch (err) {
        setError('Ошибка загрузки данных');
        console.error('Ошибка загрузки:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [activeTab]);

  // Фильтрация и сортировка кейсов
  const sortedCases = [...cases].sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'title':
        aValue = a.title;
        bValue = b.title;
        break;
      case 'tutorFio':
        aValue = a.tutorFio || '';
        bValue = b.tutorFio || '';
        break;
      case 'acceptedTeams':
        aValue = a.acceptedTeams;
        bValue = b.acceptedTeams;
        break;
      default:
        return 0;
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

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
          {loading && (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
              <div className="text-red-600 mb-2">
                <svg className="w-8 h-8 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Ошибка загрузки данных</h3>
              <p className="text-red-700 mb-4">{error}</p>
              <p className="text-red-600 text-sm">
                Проверьте подключение к API серверу и попробуйте перезагрузить страницу.
              </p>
            </div>
          )}

          {activeTab === 'requests' && !loading && (
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
          )}

          {activeTab === 'cases' && !loading && (
            <div>
              {/* Сортировка кейсов */}
              <div className="flex gap-4 mb-4">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="title">По названию</option>
                  <option value="tutorFio">По куратору</option>
                  <option value="acceptedTeams">По количеству команд</option>
                </select>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="asc">По возрастанию</option>
                  <option value="desc">По убыванию</option>
                </select>
              </div>

              <div className="space-y-4">
                {sortedCases.map((caseItem) => (
                  <CaseCard key={caseItem.id} caseItem={caseItem} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'questions' && (
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <p>Раздел "Вопросы" будет добавлен в следующей итерации</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}