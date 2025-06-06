import React, { useEffect, useState } from 'react';
import sanityClient from '../sanityClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';
import { BookOpen, Cloud, Map, Book, Star } from 'lucide-react';

const SUBJECTS = [
  { key: 'Air Law', label: 'Air Law', icon: <BookOpen /> },
  { key: 'Meteorology', label: 'Meteorology', icon: <Cloud /> },
  { key: 'Navigation', label: 'Navigation', icon: <Map /> },
  { key: 'G Knowledge', label: 'G Knowledge', icon: <Book /> },
  { key: 'Complete Exam', label: 'Complete Exam', icon: <Star /> },
];

const PASSING_SCORE = 60;

function Dashboard() {
  const [stats, setStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].key);

  useEffect(() => {
    const query = `*[_type == "userStat" && userId == "testuser123"]|order(date asc){
      _id, stage, subject, date, score
    }`;
    sanityClient.fetch(query).then((data) => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const filteredStats = stats.filter(s => s.subject === selectedSubject);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="h-20 flex items-center justify-center border-b">
          <div className="rounded-full bg-blue-600 w-12 h-12 flex items-center justify-center text-white text-2xl font-bold">Z</div>
        </div>
        <nav className="flex-1 py-6 px-4 space-y-2">
          <a href="#" className="block px-4 py-2 rounded text-gray-700 hover:bg-blue-50 font-medium">My Stages</a>
          <a href="#" className="block px-4 py-2 rounded bg-blue-100 text-blue-700 font-semibold">My Statistics</a>
          <a href="#" className="block px-4 py-2 rounded text-gray-700 hover:bg-blue-50 font-medium">My Information</a>
          <a href="#" className="block px-4 py-2 rounded text-gray-700 hover:bg-blue-50 font-medium">Sponsorship</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Statistics</h1>
        <p className="text-blue-600 mb-6">Tip: Click on the results to show details.</p>

        {/* Subject Tabs */}
        <div className="flex space-x-4 mb-8">
          {SUBJECTS.map(subj => (
            <button
              key={subj.key}
              onClick={() => setSelectedSubject(subj.key)}
              className={`flex flex-col items-center px-6 py-2 rounded-t-lg border-b-2 transition-colors focus:outline-none
                ${selectedSubject === subj.key ? 'border-blue-600 bg-white text-blue-700' : 'border-transparent bg-gray-100 text-gray-500 hover:bg-blue-50'}`}
            >
              <span className="mb-1">{subj.icon}</span>
              <span className="text-sm font-medium">{subj.label}</span>
            </button>
          ))}
        </div>

        {/* Chart */}
        <div className="bg-white rounded-lg shadow p-6">
          {loading ? (
            <div>Loading...</div>
          ) : filteredStats.length === 0 ? (
            <div className="text-gray-500">No statistics for this subject yet.</div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={filteredStats} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tickFormatter={d => new Date(d).toLocaleDateString()} />
                <YAxis domain={[0, 100]} />
                <Tooltip labelFormatter={d => new Date(d).toLocaleDateString()} />
                <ReferenceLine y={PASSING_SCORE} stroke="green" strokeDasharray="3 3" label="Passing" />
                <Bar dataKey="score" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;