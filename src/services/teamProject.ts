// Интеграция с TeamProject УрФУ (мок): возвращаем статусы и сроки
export interface TeamProjectInfo {
  id: string;
  studentTeam: string;
  status: "planned" | "in_progress" | "done";
  deadline: string;
}

const teamProjects: TeamProjectInfo[] = [
  { id: "tp1", studentTeam: "Команда А", status: "in_progress", deadline: "2025-12-20" },
  { id: "tp2", studentTeam: "Команда Б", status: "planned", deadline: "2025-11-05" },
];

export async function getTeamProjects(): Promise<TeamProjectInfo[]> {
  await delay(150);
  return teamProjects;
}

export async function getTeamProjectById(id: string): Promise<TeamProjectInfo | undefined> {
  await delay(120);
  return teamProjects.find((x) => x.id === id);
}

function delay(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}


