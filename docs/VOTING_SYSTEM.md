# Система лайков и дизлайков для кейсов

## Описание

Реализована система лайков и дизлайков для кейсов, привязанная к пользователю (не анонимная).

## Архитектура

### Компоненты системы

1. **Redux Store (`votesSlice.ts`)**
   - Управляет состоянием голосов
   - Хранит голоса по кейсам и пользователям
   - Синхронные операции с mock данными

2. **React Компонент (`components/CaseLikeButton.tsx`)**
   - Интерактивные кнопки лайка/дизлайка
   - Отображает счетчик голосов
   - Визуальная обратная связь при взаимодействии

3. **Mock Data (`data/mockCaseVotes.ts`)**
   - Тестовые данные голосов
   - Функции для работы с mock данными (getCaseVoteStats, getUserVoteForCase, getCaseVotes)

## Использование

### Добавление компонента в страницу

```tsx
import CaseLikeButton from '@/components/CaseLikeButton';

// В компоненте
<CaseLikeButton 
  caseId="case-1"
  userId={currentUser?.id}
  showCounts={true}
/>
```

### Props компонента

- `caseId` (string, обязательно): ID кейса
- `userId` (string, опционально): ID текущего пользователя. Если не указан, кнопки будут отключены
- `showCounts` (boolean, по умолчанию true): Показывать ли счетчик голосов

## Типы данных

### CaseVote

```typescript
interface CaseVote {
  id: string;
  caseId: string;
  userId: string;
  reactionType: 'like' | 'dislike' | 'neutral';
  case?: ProjectCase;
  user?: User;
}
```

## Redux селекторы

```typescript
// Получить голос пользователя за конкретный кейс
const userVote = useSelector(selectUserVoteForCase('case-1'));

// Получить все голоса за кейс
const caseVotes = useSelector(selectCaseVotesForCase('case-1'));

// Получить статистику голосов
const stats = useSelector(selectCaseVoteStats('case-1'));
```

## Redux actions

```typescript
// Отправить голос
dispatch(submitVote({
  caseId: 'case-1',
  userId: 'user-123',
  reactionType: 'like' // или 'dislike', или 'neutral'
}));

// Удалить голос
dispatch(removeVote({
  caseId: 'case-1',
  userId: 'user-123'
}));

// Загрузить голоса за кейс
dispatch(loadCaseVotes('case-1'));

// Загрузить голос пользователя
dispatch(loadUserVote({
  caseId: 'case-1',
  userId: 'user-123'
}));
```

## Особенности

✅ **Привязка к пользователю** - каждый голос связан с конкретным пользователем
✅ **Типизация** - полная поддержка TypeScript
✅ **Redux интеграция** - управление состоянием через Redux
✅ **Синхронные операции** - прямое обновление состояния
✅ **Mock данные** - все данные хранятся в mock файлах
✅ **UI компонент** - готовый React компонент с иконками
✅ **Frontend-only** - полностью работает на фронтенде без API

## Стиль и внешний вид

Компонент использует Tailwind CSS с цветовыми схемами:

- **Like активно**: зеленый фон (bg-green-100, text-green-700)
- **Dislike активно**: красный фон (bg-red-100, text-red-700)
- **Неактивно**: серый фон (bg-gray-100, text-gray-600)

Кнопки отключаются (opacity-50) при отсутствии userId.

## Файлы структуры

```
src/
├── components/
│   └── CaseLikeButton.tsx          # React компонент кнопок
├── data/
│   └── mockCaseVotes.ts             # Mock данные голосов
└── store/
    ├── index.ts                      # Redux store
    ├── selectors.ts                  # Redux селекторы
    └── slices/
        └── votesSlice.ts             # Redux слайс для голосов (синхронный)
```
