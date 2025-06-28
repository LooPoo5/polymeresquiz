
export interface User {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  created_at: Date;
  updated_at: Date;
}

export interface Quiz {
  id: string;
  title: string;
  image_url?: string;
  questions: Question[];
  user_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface Question {
  id: string;
  text: string;
  type: 'multiple-choice' | 'checkbox' | 'open-ended';
  points: number;
  image_url?: string;
  answers: Answer[];
  correct_answer?: string; // Pour les questions ouvertes
  quiz_id: string;
  order_index: number;
}

export interface Answer {
  id: string;
  text: string;
  is_correct: boolean;
  points: number;
  question_id: string;
}

export interface QuizResult {
  id: string;
  quiz_id: string;
  quiz_title: string;
  participant_name: string;
  participant_date: string;
  participant_instructor: string;
  participant_signature: string;
  answers: ResultAnswer[];
  total_points: number;
  max_points: number;
  start_time: Date;
  end_time: Date;
  user_id: string;
  created_at: Date;
}

export interface ResultAnswer {
  question_id: string;
  answer_id?: string;
  answer_ids?: string[];
  answer_text?: string;
  is_correct: boolean;
  points: number;
}

export interface AuthRequest extends Request {
  user?: User;
}
