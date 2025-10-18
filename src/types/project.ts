export interface Project {
  id: string;
  title: string;
  description: string;
  theme: string;
  startDate: string;
  endDate?: string;
  team: TeamMember[];
  image?: string;
  curator?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
}

export interface ProjectCardProps {
  project: Project;
  onClick: (projectId: string) => void;
}
