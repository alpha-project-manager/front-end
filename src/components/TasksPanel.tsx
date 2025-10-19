'use client';

import { useMemo, useState } from 'react';
import { TaskItem } from '@/types/task';

interface Props {
  tasks: TaskItem[];
}

const TasksPanel = ({ tasks }: Props) => {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase())), [tasks, query]);

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2">
        <div className="flex items-center justify-between mb-3">
          <input placeholder="Поиск" value={query} onChange={(e) => setQuery(e.target.value)} className="border rounded-md px-3 py-2 w-64"/>
          <div className="flex gap-2">
            <button className="px-3 py-2 border rounded-md">Новая</button>
            <button className="px-3 py-2 border rounded-md">Фильтр</button>
          </div>
        </div>
        <div className="border rounded-lg h-[320px] overflow-auto bg-white">
          {filtered.length === 0 ? (
            <div className="p-6 text-gray-500">Нет задач</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-4 py-2">Задача</th>
                  <th className="px-4 py-2">Исполнитель</th>
                  <th className="px-4 py-2">Статус</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id} className="border-t">
                    <td className="px-4 py-2">{t.title}</td>
                    <td className="px-4 py-2">{t.assigneeId ?? '-'}</td>
                    <td className="px-4 py-2">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      <div>
        <div className="bg-white border rounded-lg p-4 h-[320px]">
          <div className="font-medium mb-2">Завершенные</div>
          <div className="text-sm text-gray-500">Пусто</div>
        </div>
      </div>
    </div>
  );
};

export default TasksPanel;


