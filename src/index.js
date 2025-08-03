// Import all lessons
import { Choking } from './lessons/Choking.js';

// Import other lessons as you create them...

// Import all quizzes
import { chokingReliefQuiz } from './quizzes/Choking.js';

// Import other quizzes...

export const lessons = {
  'Choking Relief': Choking,
  'Choking': Choking,
  // Add more as you create them
};

export const quizzes = {
  'Choking': chokingReliefQuiz,

  // Add more as you create them
};

export const getLessonContent = (lessonId) => {
  console.log('getLessonContent called with:', lessonId);
  console.log('Available lessons:', Object.keys(lessons));
  const result = lessons[lessonId] || null;
  console.log('Returning:', result);
  return result;
};

export const getQuizQuestions = (lessonId) => {
  return quizzes[lessonId] || [];
};