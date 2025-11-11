export interface Question {
  id: string;
  title: string;
  text: string;
}

export const mockQuestions: Question[] = [
  {
    id: 'q-1',
    title: 'Название',
    text: 'Текст автоматических вопросов для тг бота',
  },
  {
    id: 'q-2',
    title: 'Название',
    text: 'Текст автоматических вопросов для тг бота',
  },
];
