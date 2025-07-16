import { useState } from 'react';
import api from '../../../api/axios';
import BinImage from '../../../assets/BIN.jpg';
import { useNavigate } from 'react-router-dom';

function ReportPage() {
  const [selectedProblem, setSelectedProblem] = useState('overflow');
  const [description, setDescription] = useState('');
  const [selectedBin, setSelectedBin] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });
  const navigate = useNavigate();

  const submitReport = async (reportData) => {
    try {
      const response = await api.post('/reports', reportData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Submission error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Failed to submit report');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const reportData = {
        binCategory: selectedBin,
        problem: selectedProblem,
        description,
        userId: user._id,
        uniqueId: user.uniqueId,
        submittedAt: new Date(),
      };

      const response = await submitReport(reportData);
      if (response.success) {
        setMessage({ text: 'Report submitted successfully!', type: 'success' });
        setDescription('');
        setSelectedBin('');
        setSelectedProblem('overflow');
        setTimeout(() => {
          setMessage({ text: '', type: '' });
          navigate('/user/home');
        }, 2000);
      }
    } catch (err) {
      setMessage({ text: err.message, type: 'error' });
      setTimeout(() => setMessage({ text: '', type: '' }), 3000);
    }
  };

  return (
    <div className="ml-64 mt-10 relative min-h-screen bg-gray-100">
      {/* Background Image with opacity */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-100 z-0"
        style={{ backgroundImage: `url(${BinImage})` }}
      ></div>

      {/* Overlay to add slight darkness if needed */}
      <div className="absolute inset-0 bg-white bg-opacity-40 z-0"></div>

      {/* Content on top */}
      <div className="relative z-10  mx-auto py-12 px-6 bg-gradient-to-br from-green-50 to-green-100">
        <h1 className="text-3xl font-bold text-green-800 mb-6 text-center">
          Report an Issue
        </h1>

        {message.text && (
          <div
            className={`p-4 mb-6 rounded-md border text-sm font-medium text-center ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800 border-green-300'
                : 'bg-red-100 text-red-800 border-red-300'
            }`}
          >
            {message.text}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="space-y-6 bg-white bg-opacity-90 p-8 rounded-xl shadow-xl backdrop-blur-sm"
        >
          {/* Select Bin */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Select Bin</label>
            <select
              className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedBin}
              onChange={(e) => setSelectedBin(e.target.value)}
              required
            >
              <option value="" disabled>Select a bin</option>
              <option value="Home Bin">Home Bin</option>
              <option value="Office Bin">Office Bin</option>
              <option value="Community Bin">Community Bin</option>
            </select>
          </div>

          {/* Problem Type */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Problem Type</label>
            <div className="space-y-3">
              {['overflow', 'damage', 'gas', 'Other'].map((problem) => (
                <label key={problem} className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="problem"
                    value={problem}
                    checked={selectedProblem === problem}
                    onChange={() => setSelectedProblem(problem)}
                    className="form-radio text-green-600 focus:ring-green-500"
                  />
                  <span className="capitalize text-gray-700">{problem}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-lg font-semibold text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full h-32 border border-gray-300 rounded-md py-3 px-4 resize-none focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter any additional details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full bg-green-700 hover:bg-green-800 text-white py-3 px-6 rounded-md text-lg font-semibold transition duration-200"
            >
              Submit Report
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportPage;