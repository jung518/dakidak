import type { Cooking, MealType, Servings, Taste } from './menu';

/** "상관없음" 을 나타내는 값 */
export type AnyAnswer = 'any';

/** 단계별 선택 답변 (값이 없으면 아직 답하지 않은 단계) */
export interface QuizAnswers {
  mealType?: MealType | AnyAnswer;
  cooking?: Cooking | AnyAnswer;
  taste?: Taste | AnyAnswer;
  servings?: Servings | AnyAnswer;
}

export type QuizKey = keyof QuizAnswers;

export interface QuizOption<K extends QuizKey = QuizKey> {
  value: NonNullable<QuizAnswers[K]>;
  label: string;
  description?: string;
}

export interface QuizStep<K extends QuizKey = QuizKey> {
  key: K;
  question: string;
  options: QuizOption<K>[];
}

/** 키별 QuizStep 의 합집합 (배열에 서로 다른 단계를 함께 담기 위함) */
export type AnyQuizStep = { [K in QuizKey]: QuizStep<K> }[QuizKey];
