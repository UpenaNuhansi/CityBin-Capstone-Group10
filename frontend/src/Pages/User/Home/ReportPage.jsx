import { useState } from 'react';
import BinImage from './../assets/BIN.jpg'

function ReportPage() {
  const [selectedProblem, setSelectedProblem] = useState('overflow');
  const [description, setDescription] = useState('');
  const [selectedBin, setSelectedBin] = useState('');
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({
      bin: selectedBin,
      problem: selectedProblem,
      description
    });
    
    // Reset form
    setDescription('');
  };
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Report</h1>
      
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
              <option value="bin1">Home Bin</option>
              <option value="bin2">Office Bin</option>
              <option value="bin3">Community Bin</option>
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
          </div>
        </div>
        
        <div className="mb-6 w-230">
          <h2 className="text-xl mb-3">Description</h2>
          <textarea
            className="w-full h-32 bg-citybin-light-green border border-green-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Enter additional details..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        
        <div className="mt-6">
          <button 
            type="submit"
            className="bg-citybin-green bg-green-700 text-white py-3 px-6 rounded-md text-lg w-100"
          >
            Submit
          </button>
        </div>
      </form>
      
      {/* Bin image - hidden on small screens */}
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