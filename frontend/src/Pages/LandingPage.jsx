import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
const TITLE = 'Welcome to CityBin!';
const DESCRIPTION = 'Real-Time Waste Tracking for a Cleaner Tomorrow.';
const IMAGE_URL = 'https://png.pngtree.com/png-clipart/20250116/original/pngtree-cartoon-recycling-bin-illustration-with-a-smiling-face-surrounded-by-green-png-image_20201283.png'; // Placeholder, replace as needed

export default function LandingPage() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [descIndex, setDescIndex] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const navigate = useNavigate();

  // Animate title
  useEffect(() => {
    if (titleIndex < TITLE.length) {
      const timeout = setTimeout(() => setTitleIndex(titleIndex + 1), 60);
      return () => clearTimeout(timeout);
    } else if (descIndex === 0) {
      // Start description after title
      setTimeout(() => setDescIndex(1), 400);
    }
  }, [titleIndex]);

  // Animate description
  useEffect(() => {
    if (descIndex > 0 && descIndex < DESCRIPTION.length) {
      const timeout = setTimeout(() => setDescIndex(descIndex + 1), 30);
      return () => clearTimeout(timeout);
    } else if (descIndex === DESCRIPTION.length) {
      // Show image after description
      setTimeout(() => setShowImage(true), 400);
    }
  }, [descIndex]);

  // Animate buttons after image
  useEffect(() => {
    if (showImage) {
      const timeout = setTimeout(() => setShowButtons(true), 900);
      return () => clearTimeout(timeout);
    }
  }, [showImage]);

  return (
    <div className="w-full h-[100vh] bg-gradient-to-b from-[#1BB237] via-[#7ADB8C] to-white flex flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="text-[64px] md:text-[100px] font-poppins text-white drop-shadow-lg min-h-[120px]">
          {TITLE.slice(0, titleIndex)}
        </div>
        <div className="text-[24px] md:text-[32px] text-white mt-2 min-h-[40px]">
          {descIndex > 0 ? DESCRIPTION.slice(0, descIndex) : ''}
        </div>
        <div className="mt-10 min-h-[320px] flex items-center justify-center">
          <img
            src={IMAGE_URL}
            alt="CityBin Illustration"
            className={`w-[350px] h-[350px] rounded-3xl shadow-xl relative right-70 top-10 transition-all duration-700 ${showImage ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-12'}`}
            style={{ transitionProperty: 'opacity, transform' }}
          />
        
          <div className={`flex flex-col relative left-70 top-30 gap-6 mt-8 transition-opacity duration-700 ${showButtons ? 'opacity-100' : 'opacity-0'}`}>
            <button className="w-[300px] py-4 bg-white text-green-500 rounded-[5px] shadow-md text-xl font-medium hover:bg-green-50 transition" onClick={() => navigate('/login')}>Login</button>
            <button className="w-[300px] py-4 bg-white text-green-500 rounded-[5px] shadow-md text-xl font-medium hover:bg-green-50 transition" onClick={() => navigate('/demo')}>See the Demo</button>
          </div>
        </div>
      </div>
    </div>
  );
}