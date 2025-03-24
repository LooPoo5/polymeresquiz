
import { createContext } from 'react';
import { QuizContextType } from '../types/quiz';

// Create the context with a default empty value
const QuizContext = createContext<QuizContextType>({} as QuizContextType);

export default QuizContext;
