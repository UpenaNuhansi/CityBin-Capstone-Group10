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
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
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
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Report</h1>
      
      {message.text && (
        <div className={`p-4 mb-4 rounded border ${message.type === 'success' ? 'bg-green-100 text-green-800 border-green-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <h2 className="text-xl mb-3">Select Bin</h2>
          <div className="relative">
            <select
              className="w-full bg-citybin-light-green border border-green-300 rounded-md py-3 px-4 appearance-none focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedBin}
              onChange={(e) => setSelectedBin(e.target.value)}
              required
            >
              <option value="" disabled>Select a bin</option>
              <option value="Home Bin">Home Bin</option>
              <option value="Office Bin">Office Bin</option>
              <option value="Community Bin">Community Bin</option>
            </select>
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
              <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl mb-3">Problem</h2>
          <div className="space-y-3">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  className="opacity-0 absolute h-6 w-6"
                  name="problem"
                  value="overflow"
                  checked={selectedProblem === 'overflow'}
                  onChange={() => setSelectedProblem('overflow')}
                />
                <div className={`border-2 rounded-full h-6 w-6 flex items-center justify-center ${selectedProblem === 'overflow' ? 'border-citybin-green' : 'border-gray-400'}`}>
                  {selectedProblem === 'overflow' && (
                    <div className="bg-citybin-green rounded-full h-4 w-4"></div>
                  )}
                </div>
              </div>
              <span className="ml-2">Overflow</span>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  className="opacity-0 absolute h-6 w-6"
                  name="problem"
                  value="damage"
                  checked={selectedProblem === 'damage'}
                  onChange={() => setSelectedProblem('damage')}
                />
                <div className={`border-2 rounded-full h-6 w-6 flex items-center justify-center ${selectedProblem === 'damage' ? 'border-citybin-green' : 'border-gray-400'}`}>
                  {selectedProblem === 'damage' && (
                    <div className="bg-citybin-green rounded-full h-4 w-4"></div>
                  )}
                </div>
              </div>
              <span className="ml-2">Damage</span>
            </label>
            
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  className="opacity-0 absolute h-6 w-6"
                  name="problem"
                  value="gas"
                  checked={selectedProblem === 'gas'}
                  onChange={() => setSelectedProblem('gas')}
                />
                <div className={`border-2 rounded-full h-6 w-6 flex items-center justify-center ${selectedProblem === 'gas' ? 'border-citybin-green' : 'border-gray-400'}`}>
                  {selectedProblem === 'gas' && (
                    <div className="bg-citybin-green rounded-full h-4 w-4"></div>
                  )}
                </div>
              </div>
              <span className="ml-2">Gas</span>
            </label>

            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="radio"
                  className="opacity-0 absolute h-6 w-6"
                  name="problem"
                  value="Other"
                  checked={selectedProblem === 'Other'}
                  onChange={() => setSelectedProblem('Other')}
                />
                <div className={`border-2 rounded-full h-6 w-6 flex items-center justify-center ${selectedProblem === 'Other' ? 'border-citybin-green' : 'border-gray-400'}`}>
                  {selectedProblem === 'Other' && (
                    <div className="bg-citybin-green rounded-full h-4 w-4"></div>
                  )}
                </div>
              </div>
              <span className="ml-2">Other</span>
            </label>
          </div>
        </div>
        
        <div className="mb-6">
          <h2 className="text-xl mb-3">Description</h2>
          <textarea
            className="w-full h-32 bg-citybin-light-green border border-green-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter additional details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit"
            className="bg-citybin-green bg-green-700 text-white py-3 px-6 rounded-md text-lg w-full"
          >
            Submit
          </button>
        </div>
      </form>
      
      <div className="hidden md:block fixed right-6 bottom-6 w-1/4 max-w-xs">
        <img 
          src={BinImage}
          alt="Recycle bin" 
          className="w-full"
        />
      </div>
    </div>
  );
}

export default ReportPage;