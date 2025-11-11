'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { mockRequests } from '@/data/mockRequests';
import { mockCases } from '@/data/mockCases';
import { mockQuestions, type Question } from '@/data/mockQuestions';
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
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>(mockQuestions);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Question>>({});

  // Обработчики для вопросов
  const handleEditQuestion = (question: Question) => {
    setEditingId(question.id);
    setEditForm({ ...question });
  };

  const handleSaveQuestion = () => {
    if (!editingId || !editForm.title || !editForm.text) return;
    setQuestions(questions.map(q => q.id === editingId ? { ...q, ...editForm } : q));
    setEditingId(null);
    setEditForm({});
  };

  const handleDeleteQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleAddQuestion = () => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      title: 'Новый вопрос',
      text: 'Введите текст вопроса',
    };
    setQuestions([...questions, newQuestion]);
  };

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
                  onClick={() => router.push(`/requests/${request.id}`)}
                  className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow cursor-pointer min-h-[150px] flex flex-col hover:bg-gray-100"
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
            <div className="space-y-4">
              {/* (Вложенные табы удалены — используются верхние вкладки) */}

              {/* Список вопросов */}
              <div className="space-y-3">
                {questions.map((question, idx) => (
                  <div key={question.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4">
                    {editingId === question.id ? (
                      // Режим редактирования
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Название
                          </label>
                          <input
                            type="text"
                            value={editForm.title || ''}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Текст
                          </label>
                          <textarea
                            value={editForm.text || ''}
                            onChange={(e) => setEditForm({ ...editForm, text: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            rows={3}
                          />
                        </div>
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700"
                          >
                            Отмена
                          </button>
                          <button
                            onClick={handleSaveQuestion}
                            className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Сохранить
                          </button>
                        </div>
                      </div>
                    ) : (
                      // Режим просмотра
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 text-sm mb-1">
                            {idx + 1}. {question.title}
                          </h3>
                          <p className="text-sm text-gray-700">{question.text}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEditQuestion(question)}
                            className="text-sm text-blue-600 hover:underline font-medium"
                          >
                            Редактировать
                          </button>
                          <button
                            onClick={() => handleDeleteQuestion(question.id)}
                            className="text-sm text-red-600 hover:underline font-medium"
                          >
                            Удалить
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Кнопка добавления */}
              <div className="flex justify-center py-6">
                <button
                  onClick={handleAddQuestion}
                  className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-700 text-2xl font-light transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
