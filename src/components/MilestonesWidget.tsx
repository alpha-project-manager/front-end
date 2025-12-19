'use client';

import { useState, useMemo } from 'react';
import { mockMilestones } from '@/data/mockMilestones';
import { mockProjects } from '@/data/mockProjects';
import MilestoneCard from './MilestoneCard';
import MilestoneModal from './MilestoneModal';
import Button from './Button';
import type { Milestone } from '@/types/milestone';

const MilestonesWidget = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  // Получаем только глобальные milestones, сортируем по дате
  const globalMilestones = useMemo(() => {
    return [...mockMilestones]
      .filter(m => m.type === 'global')
      .sort((a, b) => new Date(a.targetDate).getTime() - new Date(b.targetDate).getTime());
  }, []);

  const getProjectInfo = (projectId?: string) => {
    if (!projectId) return null;
    return mockProjects.find(p => p.id === projectId);
  };

  const handleCreateMilestone = () => {
    setSelectedMilestone(null);
    setShowModal(true);
  };

  const handleEditMilestone = (milestone: any) => {
    setSelectedMilestone(milestone);
    setShowModal(true);
  };

  const handleSaveMilestone = (milestoneData: any) => {
    if (selectedMilestone) {
      // Редактирование
      const index = mockMilestones.findIndex(m => m.id === selectedMilestone.id);
      if (index !== -1) {
        mockMilestones[index] = { ...mockMilestones[index], ...milestoneData, type: 'global' };
      }
    } else {
      // Создание
      const newMilestone = {
        id: `milestone-${Date.now()}`,
        ...milestoneData,
        type: 'global',
        projectId: undefined, // Глобальные не привязаны к проекту
        progress: 0,
      };
      mockMilestones.push(newMilestone);
    }
    setShowModal(false);
  };

  const handleDeleteMilestone = (id: string) => {
    if (confirm('Удалить эту контрольную точку?')) {
      const index = mockMilestones.findIndex(m => m.id === id);
      if (index !== -1) {
        mockMilestones.splice(index, 1);
      }
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Контрольные точки</h2>
          <div className="flex gap-2">
            <Button
              onClick={handleCreateMilestone}
              variant="primary"
              className="text-xs px-3 py-1"
            >
              + Создать
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {globalMilestones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-2">🎯</div>
              <p className="text-sm">Нет глобальных контрольных точек</p>
              <p className="text-xs mt-2">Нажмите "Создать" чтобы добавить первую</p>
            </div>
          ) : (
            globalMilestones.map((milestone) => (
              <div key={milestone.id} className="relative">
                <div
                  onClick={() => handleEditMilestone(milestone)}
                  className="cursor-pointer"
                >
                  <MilestoneCard
                    milestone={milestone}
                    compact={true}
                    showProjectInfo={false}
                    onDelete={handleDeleteMilestone}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <MilestoneModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveMilestone}
        milestone={selectedMilestone}
      />
    </>
  );
};

export default MilestonesWidget;