import { mockProjects } from "@/data/mockProjects";
import { Project } from "@/types/project";

export async function fetchProjects(): Promise<Project[]> {
  await delay(200);
  return mockProjects;
}

export async function fetchProjectsByUniversity(university: string): Promise<Project[]> {
  await delay(200);
  return mockProjects.filter((p) => (p.curator?.includes(university) || false));
}

export async function fetchProjectsByCurator(curator: string): Promise<Project[]> {
  await delay(200);
  return mockProjects.filter((p) => (p.curator?.toLowerCase().includes(curator.toLowerCase()) || false));
}

export async function createProject(data: Omit<Project, "id">): Promise<Project> {
  await delay(150);
  const created: Project = { ...data, id: String(Date.now()) };
  mockProjects.push(created);
  return created;
}

export async function updateProject(id: string, data: Partial<Project>): Promise<Project> {
  await delay(150);
  const idx = mockProjects.findIndex((p) => p.id === id);
  if (idx === -1) throw new Error("Проект не найден");
  mockProjects[idx] = { ...mockProjects[idx], ...data };
  return mockProjects[idx];
}

export async function archiveProject(id: string): Promise<Project> {
  await delay(100);
  const project = await updateProject(id, {});
  return project;
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}


