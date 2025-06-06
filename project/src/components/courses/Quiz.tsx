import React, { useState, useEffect, useRef } from 'react';
import type { Quiz as QuizType, Question } from '../../types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizProps {
  quiz: QuizType;
  onComplete: (score: number) => void;
}

const MAX_TIME = 60 * 60; // 60 minutes in seconds
const PASSING_SCORE = 60;

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function Quiz({ quiz, onComplete }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MAX_TIME);
  const [isPaused, setIsPaused] = useState(false);
  const [reviewMode, setReviewMode] = useState(false);
  const [timeTaken, setTimeTaken] = useState(0);
  const [isManuallySubmitted, setIsManuallySubmitted] = useState(false);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Timer effect
  useEffect(() => {
    if (isPaused || isCompleted) return;
    if (timeLeft === 0) {
      setIsCompleted(true);
      setTimeTaken(MAX_TIME);
      setIsManuallySubmitted(false);
      return;
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [timeLeft, isPaused, isCompleted]);

  // Auto-complete when time runs out
  useEffect(() => {
    if (timeLeft === 0 && !isCompleted) {
      setIsCompleted(true);
      setTimeTaken(MAX_TIME);
      setIsManuallySubmitted(false);
    }
  }, [timeLeft, isCompleted]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setShowExplanation(false);
    }
  };

  const handleSubmitExam = () => {
    setIsCompleted(true);
    setTimeTaken(MAX_TIME - timeLeft);
    setIsManuallySubmitted(true);
    onComplete(score);

    fetch('/api/addUserStat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: clerkUserId, // get from Clerk
        stage: 'PPL', // or current stage
        subject: 'Air Law', // or current subject
        date: new Date().toISOString(),
        score: score,
      }),
    });
  };

  const handleJumpTo = (idx: number) => {
    setCurrentQuestion(idx);
    setShowExplanation(false);
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowExplanation(false);
    setIsCompleted(false);
    setTimeLeft(MAX_TIME);
    setIsPaused(false);
    setReviewMode(false);
    setTimeTaken(0);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === quiz.questions[index].correctAnswer) {
        correct++;
      }
    });
    return (correct / quiz.questions.length) * 100;
  };

  const question = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const timeProgress = ((MAX_TIME - timeLeft) / MAX_TIME) * 100;
  const score = calculateScore();

  // --- REVIEW MODE ---
  if (isCompleted && reviewMode) {
    const reviewQuestion = quiz.questions[currentQuestion];
    const userAnswer = selectedAnswers[currentQuestion];
    const correctAnswer = reviewQuestion.correctAnswer;
    const isCorrect = userAnswer === correctAnswer;
    const isSkipped = userAnswer === undefined;

    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        {/* Summary/Legend */}
        <div className="mb-6 border-b pb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div className="flex items-center space-x-6 mb-2 md:mb-0">
              <div className="flex items-center space-x-1 text-red-500"><XCircle className="w-5 h-5" /> <span>Wrong answer</span></div>
              <div className="flex items-center space-x-1 text-blue-600"><span className="font-bold">&#10003;</span> <span>Your answer</span></div>
              <div className="flex items-center space-x-1 text-green-600"><CheckCircle className="w-5 h-5" /> <span>Good answer</span></div>
            </div>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-6 text-sm">
              <span className="text-red-500">Your score {score.toFixed(0)}%</span>
              <span>Passing score {PASSING_SCORE}%</span>
              <span>Your time {formatTime(timeTaken)} (60 min max)</span>
            </div>
          </div>
          {/* Question Nav in review mode */}
          <div className="flex space-x-2 mt-2">
            {quiz.questions.map((_, idx) => {
              const userAns = selectedAnswers[idx];
              const correctAns = quiz.questions[idx].correctAnswer;
              const isCorrect = userAns === correctAns;
              const isSkipped = userAns === undefined;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestion(idx)}
                  className={`w-10 h-10 rounded text-base font-semibold border-2 transition-colors
                    ${currentQuestion === idx ? 'bg-red-700 text-white border-red-700' :
                      isSkipped ? 'bg-gray-100 text-gray-400 border-gray-300' :
                      isCorrect ? 'bg-green-400 text-white border-green-600' :
                      'bg-red-300 text-white border-red-400'}`}
                >
                  {(idx + 1).toString().padStart(2, '0')}
                </button>
              );
            })}
          </div>
        </div>

        {/* Question Review */}
        <div className="mb-4 text-lg font-bold text-blue-900">Question {(currentQuestion + 1).toString().padStart(2, '0')}</div>
        <div className="mb-4 text-gray-900 font-medium">{reviewQuestion.text}</div>
        <div className="space-y-3 mb-4">
          {reviewQuestion.options.map((option, idx) => {
            const isUser = userAnswer === idx;
            const isGood = correctAnswer === idx;
            const isWrong = isUser && !isGood;
            return (
              <div
                key={idx}
                className={`flex items-center p-3 rounded-md border transition-colors
                  ${isGood ? 'border-green-500 bg-green-50' :
                    isWrong ? 'border-red-500 bg-red-50' :
                    isUser ? 'border-blue-500 bg-blue-50' :
                    'border-gray-200'}
                `}
              >
                {isGood && <CheckCircle className="w-5 h-5 text-green-600 mr-2" />}
                {isWrong && <XCircle className="w-5 h-5 text-red-500 mr-2" />}
                {!isGood && !isWrong && isUser && <span className="w-5 h-5 text-blue-600 mr-2 font-bold">&#10003;</span>}
                {!isGood && !isWrong && !isUser && <span className="w-5 h-5 mr-2"></span>}
                <span className={isGood ? 'text-green-700 font-semibold' : isWrong ? 'text-red-700 font-semibold' : isUser ? 'text-blue-700 font-semibold' : 'text-gray-700'}>
                  {option}
                </span>
                {isSkipped && idx === 0 && <span className="ml-2 text-red-400">You skipped the question</span>}
              </div>
            );
          })}
        </div>
        <div className="mb-6">
          <div className="text-blue-700 font-semibold mb-1">Explanation</div>
          <div className="text-gray-800 text-sm whitespace-pre-line">{reviewQuestion.explanation}</div>
        </div>
        <div className="flex justify-between">
          <button
            onClick={() => setCurrentQuestion(q => Math.max(0, q - 1))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold"
            disabled={currentQuestion === 0}
          >
            Previous
          </button>
          <button
            onClick={handleRestart}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Try Again
          </button>
          <button
            onClick={() => setCurrentQuestion(q => Math.min(quiz.questions.length - 1, q + 1))}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-semibold"
            disabled={currentQuestion === quiz.questions.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    );
  }

  // --- END REVIEW MODE ---

  if (isCompleted) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quiz Completed!</h2>
        <p className="text-lg mb-4">Your score: {score.toFixed(1)}%</p>
        {isManuallySubmitted ? null : (
          <p className="text-red-500 mb-2">Time expired. Exam was auto-submitted.</p>
        )}
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mb-2"
        >
          Try Again
        </button>
        <button
          onClick={() => { setReviewMode(true); setCurrentQuestion(0); }}
          className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-2"
        >
          Review Answers
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Timer and Controls */}
      <div className="flex items-center mb-6 space-x-4">
        <button
          onClick={() => setIsPaused(p => !p)}
          className="rounded-full bg-blue-600 text-white w-10 h-10 flex items-center justify-center text-xl font-bold focus:outline-none"
        >
          {isPaused ? <span>&#9658;</span> : <span>||</span>}
        </button>
        <div className="flex-1">
          <span className="font-semibold text-lg align-middle">{formatTime(MAX_TIME - timeLeft)}</span>
          <span className="text-gray-500 ml-2 text-sm">(Max 60 min)</span>
          <div className="h-2 bg-gray-200 rounded mt-1">
            <div
              className="h-2 bg-blue-500 rounded"
              style={{ width: `${timeProgress}%` }}
            />
          </div>
        </div>
        <button
          onClick={handleRestart}
          className="px-4 py-2 bg-red-500 text-white rounded-full font-semibold text-base hover:bg-red-600"
        >
          Restart
        </button>
        <button
          onClick={handleSubmitExam}
          className="px-6 py-2 bg-green-500 text-white rounded-full font-semibold text-base hover:bg-green-600"
        >
          Submit Exam
        </button>
      </div>

      {/* Question Navigation */}
      <div className="flex space-x-2 mb-6">
        {quiz.questions.map((_, idx) => (
          <button
            key={idx}
            onClick={() => handleJumpTo(idx)}
            className={`w-10 h-10 rounded text-base font-semibold border-2 transition-colors
              ${currentQuestion === idx ? 'bg-blue-900 text-white border-blue-900' :
                selectedAnswers[idx] !== undefined ? 'bg-blue-200 text-blue-900 border-blue-400' :
                'bg-gray-100 text-gray-500 border-gray-300'}`}
          >
            {(idx + 1).toString().padStart(2, '0')}
          </button>
        ))}
      </div>

      {/* Progress Tracker */}
      <div className="mb-4 text-gray-700 font-medium">
        Question {currentQuestion + 1} of {quiz.questions.length}
      </div>

      {/* Question and Options */}
      <div className="mb-6">
        <p className="text-lg text-gray-900 mb-4">{question.text}</p>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={`w-full text-left p-4 rounded-md border transition-colors
                ${selectedAnswers[currentQuestion] === index
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          disabled={currentQuestion === quiz.questions.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Quiz;