import React from 'react';
import { Link } from 'react-router-dom';
import { UserButton, useAuth } from '@clerk/clerk-react';
import { Plane } from 'lucide-react';

function Navbar() {
  const { isSignedIn } = useAuth();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <Plane className="h-8 w-8 text-blue-500" />
              <span className="ml-2 text-xl font-bold text-gray-900">AviationStudy</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {isSignedIn ? (
              <>
                <Link to="/dashboard\" className="text-gray-700 hover:text-blue-500">
                  Dashboard
                </Link>
                <Link to="/courses" className="text-gray-700 hover:text-blue-500">
                  Courses
                </Link>
                <UserButton afterSignOutUrl="/" />
              </>
            ) : (
              <>
                <Link 
                  to="/sign-in" 
                  className="text-gray-700 hover:text-blue-500"
                >
                  Sign In
                </Link>
                <Link 
                  to="/sign-up"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar