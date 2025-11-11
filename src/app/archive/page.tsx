"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import ProjectCard from "@/components/ProjectCard";
import { mockProjects } from "@/data/mockProjects";
import Button from "@/components/Button";

export default function Archive() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { status, error } = useAppSelector((state) => state.projects);
  const [filter, setFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const archivedProjects = mockProjects.filter((p) => p.status === "archived");

  const filteredProjects = archivedProjects.filter((project) => {
    const matchesFilter = filter === "all" || project.theme === filter;
    const matchesSearch =
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.curator?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const themes = Array.from(new Set(archivedProjects.map((project) => project.theme)));

  const getThemeCount = (theme: string) => archivedProjects.filter((project) => project.theme === theme).length;

  const handleProjectClick = (projectId: string) => {
    router.push(`/projects/${projectId}`);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Архив проектов</h1>
        <p className="text-gray-600 mb-6">Здесь находятся завершённые и архивированные проекты.</p>

        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-2 min-w-max">
            <div className="text-center p-4 bg-gray-50 rounded-lg min-w-[120px] flex-shrink-0">
              <div className="text-2xl font-bold text-gray-900">{archivedProjects.length}</div>
              <div className="text-sm text-gray-600">Всего в архиве</div>
            </div>
            {themes.map((theme, index) => {
              const colors = ["bg-green-50 text-green-600", "bg-blue-50 text-blue-600", "bg-yellow-50 text-yellow-600", "bg-purple-50 text-purple-600"];
              const colorClass = colors[index % colors.length];
              return (
                <div key={theme} className={`text-center p-4 rounded-lg min-w-[120px] flex-shrink-0 ${colorClass}`}>
                  <div className="text-2xl font-bold">{getThemeCount(theme)}</div>
                  <div className="text-sm">{theme}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex gap-2">
            <input
              type="text"
              placeholder="Поиск проектов..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <Button variant="primary">Найти</Button>
          </div>

          <div className="md:w-64">
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">Все темы ({archivedProjects.length})</option>
              {themes.map((theme) => (
                <option key={theme} value={theme}>
                  {theme} ({getThemeCount(theme)})
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => router.push('/projects')}>
              Перейти к проектам
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.id} project={project} onClick={handleProjectClick} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
          <div className="text-6xl mb-4">📦</div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Архив пуст</h3>
          <p className="text-gray-600">Здесь появятся завершённые проекты</p>
        </div>
      )}
    </div>
  );
}
