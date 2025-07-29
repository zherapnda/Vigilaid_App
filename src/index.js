// Import all lessons
import { chokingReliefLesson } from './lessons/chokingRelief';

// Import other lessons as you create them...

// Import all quizzes
import { chokingReliefQuiz } from './quizzes/chokingRelief';

// Import other quizzes...

export const lessons = {
  'choking-relief': chokingReliefLesson,
  // Add more as you create them
};

export const quizzes = {
  'choking-relief': chokingReliefQuiz,

  // Add more as you create them
};

export const getLessonContent = (lessonId) => {
  return lessons[lessonId] || null;
};

export const getQuizQuestions = (lessonId) => {
  return quizzes[lessonId] || [];
};