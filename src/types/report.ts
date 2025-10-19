export interface InteractionReport {
  id: string;
  period: { from: string; to: string };
  by: "universities" | "employees" | "projects";
  generatedAt: string;
  data: unknown; // структура отчетов может различаться, оставим generic
}


