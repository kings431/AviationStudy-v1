import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import CourseList from '../components/courses/CourseList';
import CourseDetail from '../components/courses/CourseDetail';
import sanityClient from '../sanityClient';

const query = `*[_type == "course"]{
  _id, title, description, duration, students, price, level,
  quizzes[]->{
    _id, title,
    questions[]->{
      _id, text, options, correctAnswer, explanation
    }
  }
}`;

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    sanityClient.fetch(query).then((data) => {
      console.log("Sanity data:", data);
      setCourses(data);
      setLoading(false);
    }).catch((err) => {
      console.error("Sanity fetch error:", err);
      setLoading(false);
    });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
              <p className="mt-2 text-gray-600">Choose from our selection of professional aviation courses.</p>
            </div>
            <CourseList courses={courses} />
          </div>
        }
      />
      <Route path=":courseId" element={<CourseDetail courses={courses} />} />
    </Routes>
  );
}

export default CoursesPage;