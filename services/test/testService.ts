import { api } from '@/lib/axios';
import { Test, TestResult, UserAnswer, Question, QuestionResult } from '@/types/test'

// Mock test data
const mockTests: Test[] = [
  {
    test_id: 'test-1',
    name: 'JavaScript Fundamentals',
    description: 'Test your knowledge of JavaScript basics including variables, functions, and data types.',
    duration: 30,
    total_points: 100,
    questions: [
      {
        test_id: 'q1',
        type: 'multiple-choice',
        question: 'What is the correct way to declare a variable in JavaScript?',
        options: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'declare x = 5;'],
        correctAnswer: 0,
        points: 10,
        explanation: 'The "var" keyword is used to declare variables in JavaScript.'
      },
      {
        test_id: 'q2',
        type: 'multiple-choice',
        question: 'Which method is used to add an element to the end of an array?',
        options: ['append()', 'push()', 'add()', 'insert()'],
        correctAnswer: 1,
        points: 10,
        explanation: 'The push() method adds one or more elements to the end of an array.'
      },
      {
        test_id: 'q3',
        type: 'essay',
        question: 'Explain the difference between "let", "const", and "var" in JavaScript.',
        points: 20,
        explanation: 'let and const have block scope, var has function scope. const cannot be reassigned.'
      },
      {
        test_id: 'q4',
        type: 'multiple-choice',
        question: 'What does "=== " operator do in JavaScript?',
        options: ['Assignment', 'Equality without type checking', 'Strict equality with type checking', 'Not equal'],
        correctAnswer: 2,
        points: 15,
        explanation: 'The === operator checks for strict equality, comparing both value and type.'
      },
      {
        test_id: 'q5',
        type: 'multiple-choice',
        question: 'Which of the following is NOT a JavaScript data type?',
        options: ['String', 'Boolean', 'Integer', 'Undefined'],
        correctAnswer: 2,
        points: 10,
        explanation: 'JavaScript has Number type, not specifically Integer. All numbers are of type Number.'
      }
    ]
  },
  {
    test_id: 'test-2',
    name: 'React Development',
    description: 'Assess your React skills including components, hooks, and state management.',
    duration: 45,
    total_points: 120,
    questions: [
      {
        test_id: 'q1',
        type: 'multiple-choice',
        question: 'What is JSX?',
        options: ['A JavaScript library', 'A syntax extension for JavaScript', 'A CSS framework', 'A database'],
        correctAnswer: 1,
        points: 15,
        explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in JavaScript.'
      },
      {
        test_id: 'q2',
        type: 'essay',
        question: 'Explain the useState hook and provide an example of its usage.',
        points: 25,
        explanation: 'useState is a React hook that allows you to add state to functional components.'
      },
      {
        test_id: 'q3',
        type: 'multiple-choice',
        question: 'What is the purpose of useEffect hook?',
        options: ['To manage state', 'To handle side effects', 'To create components', 'To style components'],
        correctAnswer: 1,
        points: 20,
        explanation: 'useEffect is used to handle side effects in functional components, like data fetching or subscriptions.'
      }
    ]
  },
  {
    test_id: 'test-3',
    name: 'TypeScript Essentials',
    description: 'Test your understanding of TypeScript types, interfaces, and advanced features.',
    duration: 25,
    total_points: 80,
    questions: [
      {
        test_id: 'q1',
        type: 'multiple-choice',
        question: 'What is the main benefit of using TypeScript?',
        options: ['Faster execution', 'Type safety', 'Smaller bundle size', 'Better performance'],
        correctAnswer: 1,
        points: 15,
        explanation: 'TypeScript provides static type checking, which helps catch errors at compile time.'
      },
      {
        test_id: 'q2',
        type: 'essay',
        question: 'Describe the difference between interfaces and types in TypeScript.',
        points: 25,
        explanation: 'Interfaces are extendable and mainly for object shapes, while types are more flexible for unions and primitives.'
      }
    ]
  }
];

// export const api = {
//   // Get all available tests
//   getTests: async (): Promise<Test[]> => {
//     await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
//     return mockTests;
//   },

//   // Get a specific test by ID
//   getTest: async (test_id: string): Promise<Test | null> => {
//     await new Promise(resolve => setTimeout(resolve, 300));
//     return mockTests.find(test => test.test_id === test_id) || null;
//   },

//   // Submit test answers and get results
//   submitTest: async (test_id: string, answers: UserAnswer[], timeSpent: number): Promise<TestResult> => {
//     await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate grading time

//     const test = mockTests.find(t => t.test_id === test_id);
//     if (!test) throw new Error('Test not found');

//     const questionResults: QuestionResult[] = test.questions.map(question => {
//       const userAnswer = answers.find(a => a.question_id === question.test_id);
//       let isCorrect = false;
//       let earnedPoints = 0;

//       if (question.type === 'multiple-choice' && userAnswer) {
//         isCorrect = userAnswer.answer === question.correctAnswer;
//         earnedPoints = isCorrect ? question.points : 0;
//       } else if (question.type === 'essay' && userAnswer) {
//         // Simple essay grading - in real app, this would use AI
//         const answerLength = String(userAnswer.answer).length;
//         if (answerLength > 50) {
//           earnedPoints = Math.floor(question.points * 0.8); // Give 80% for substantial answers
//           isCorrect = true;
//         } else if (answerLength > 20) {
//           earnedPoints = Math.floor(question.points * 0.6); // Give 60% for moderate answers
//           isCorrect = true;
//         } else {
//           earnedPoints = Math.floor(question.points * 0.3); // Give 30% for minimal answers
//           isCorrect = false;
//         }
//       }

//       return {
//         question_id: question.test_id,
//         question: question.question,
//         userAnswer: userAnswer?.answer || 'No answer',
//         correctAnswer: question.correctAnswer,
//         isCorrect,
//         points: question.points,
//         earnedPoints,
//         explanation: question.explanation
//       };
//     });

//     const earnedPoints = questionResults.reduce((sum, result) => sum + result.earnedPoints, 0);
//     const correctAnswers = questionResults.filter(result => result.isCorrect).length;

//     return {
//       test_id,
//       testName: test.name,
//       totalQuestions: test.questions.length,
//       correctAnswers,
//       total_points: test.total_points,
//       earnedPoints,
//       percentage: Math.round((earnedPoints / test.total_points) * 100),
//       timeSpent,
//       questionResults,
//       completedAt: new Date()
//     };
//   }
// };



export const testService = {
  createTest: async (data: any) => {
    try {
      const res = await api.post('/test/create', data);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  },

  getTestById: async (test_id: number) => {
    try {
      const res = await api.get(`/test/${test_id}`);
      return res.data;
    } catch (error) {
      console.log(`Error when fetching test: ${error}`);
    }
  },

  getTestsByInstructorId: async (instructor_id: number) => { 
    try {
      const res=await api.get(`/test/instructor/${instructor_id}`);
      return res.data;
    } catch (error) { 
      console.log(error)
    }
  },

  submitTest: async (test_id: number, answers: UserAnswer[], timeSpent: number): Promise<TestResult> => {
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate grading time

    const test = mockTests.find(t => t.test_id === test_id);
    if (!test) throw new Error('Test not found');

    const questionResults: QuestionResult[] = test.questions.map(question => {
      const userAnswer = answers.find(a => a.question_id === question.test_id);
      let isCorrect = false;
      let earnedPoints = 0;

      if (question.type === 'multiple-choice' && userAnswer) {
        isCorrect = userAnswer.answer === question.correctAnswer;
        earnedPoints = isCorrect ? question.points : 0;
      } else if (question.type === 'essay' && userAnswer) {
        // Simple essay grading - in real app, this would use AI
        const answerLength = String(userAnswer.answer).length;
        if (answerLength > 50) {
          earnedPoints = Math.floor(question.points * 0.8); // Give 80% for substantial answers
          isCorrect = true;
        } else if (answerLength > 20) {
          earnedPoints = Math.floor(question.points * 0.6); // Give 60% for moderate answers
          isCorrect = true;
        } else {
          earnedPoints = Math.floor(question.points * 0.3); // Give 30% for minimal answers
          isCorrect = false;
        }
      }

      return {
        question_id: question.test_id,
        question: question.question,
        userAnswer: userAnswer?.answer || 'No answer',
        correctAnswer: question.correctAnswer,
        isCorrect,
        points: question.points,
        earnedPoints,
        explanation: question.explanation
      };
    });

    const earnedPoints = questionResults.reduce((sum, result) => sum + result.earnedPoints, 0);
    const correctAnswers = questionResults.filter(result => result.isCorrect).length;

    return {
      test_id,
      testName: test.name,
      totalQuestions: test.questions.length,
      correctAnswers,
      total_points: test.total_points,
      earnedPoints,
      percentage: Math.round((earnedPoints / test.total_points) * 100),
      timeSpent,
      questionResults,
      completedAt: new Date()
    };
  }
}