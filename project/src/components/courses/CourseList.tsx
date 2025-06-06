import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Users } from 'lucide-react';
import type { Course } from '../../types';

interface CourseListProps {
  courses: Course[];
}

function CourseList({ courses }: CourseListProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <div key={course._id} className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">{course.title}</h2>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            <div className="space-y-2">
              <div className="flex items-center text-gray-500">
                <Clock className="h-5 w-5 mr-2" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <Users className="h-5 w-5 mr-2" />
                <span>{course.students} students</span>
              </div>
              <div className="flex items-center text-gray-500">
                <BookOpen className="h-5 w-5 mr-2" />
                <span>{course.level}</span>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">{course.price}</span>
                <Link 
                  to={`/courses/${course._id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Start Learning
                </Link>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CourseList