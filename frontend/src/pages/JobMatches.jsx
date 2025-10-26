import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import JobCard from '../components/JobCard';
import { Search, Briefcase } from 'lucide-react';

const JobMatches = () => {
  const { jobs, resumes, searchJobs, fetchJobMatches } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        console.log('📋 Loading jobs...');
        
        // First, just try to search for all jobs
        await searchJobs({});
        
        console.log('✅ Jobs loaded from store:', jobs);
      } catch (error) {
        console.error('❌ Error loading jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [searchJobs]);

  const handleSearch = async () => {
    setLoading(true);
    await searchJobs({ keywords: searchTerm });
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Display jobs from store or matches
  const displayJobs = matches.length > 0 ? matches : jobs;

  console.log('📊 Displaying jobs:', displayJobs.length);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          {matches.length > 0 ? 'Matched Jobs' : 'Browse Jobs'}
        </h1>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Search className="w-5 h-5" />
              Search
            </button>
          </div>
        </div>

        {/* Job List */}
        {displayJobs.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
            <p className="text-gray-600">Try adjusting your search criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayJobs.map((item) => {
              const job = item.job || item;
              return (
                <JobCard
                  key={job._id || job.id}
                  job={job}
                  matchScore={item.matchScore}
                  matchingSkills={item.matchingSkills}
                  missingSkills={item.missingSkills}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobMatches;