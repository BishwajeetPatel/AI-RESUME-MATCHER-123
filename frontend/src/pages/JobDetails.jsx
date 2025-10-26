import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useStore from '../store/useStore';

const JobDetails = () => {
  const { id } = useParams();
  const { currentJob, fetchJob } = useStore();

  useEffect(() => {
    fetchJob(id);
  }, [id]);

  if (!currentJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{currentJob.title}</h1>
          <p className="text-xl text-gray-600 mb-6">{currentJob.company}</p>
          <div className="prose max-w-none">
            <p>{currentJob.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
