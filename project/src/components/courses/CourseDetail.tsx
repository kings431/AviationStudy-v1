import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Quiz from './Quiz';
import type { Course } from '../../types';

interface CourseDetailProps {
  courses: Course[];
}

function CourseDetail({ courses }: CourseDetailProps) {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  const course = courses.find(c => c._id === courseId);

  if (!course) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Course not found</h2>
          <button
            onClick={() => navigate('/courses')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  if (selectedQuiz !== null) {
    const quiz = course.quizzes.find(q => q._id === selectedQuiz);
    if (!quiz) return null;

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => setSelectedQuiz(null)}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Course
        </button>
        <Quiz
          quiz={quiz}
          onComplete={(score) => {
            setQuizScore(score);
          }}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/courses')}
        className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Courses
      </button>

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">{course.title}</h1>
        <p className="text-gray-600 mb-6">{course.description}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Duration</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">{course.duration}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Level</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">{course.level}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="text-sm font-medium text-gray-500">Price</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900">{course.price}</p>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Quizzes</h2>
          <div className="space-y-4">
            {course.quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
                    <p className="text-gray-500">{quiz.questions.length} questions</p>
                  </div>
                  <button
                    onClick={() => setSelectedQuiz(quiz._id)}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Start Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseDetail; 