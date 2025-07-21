import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import localImage from '../assets/bin.jpg';

const TITLE = 'Welcome to CityBin!';
const DESCRIPTION = 'Real-Time Waste Tracking for a Cleaner Tomorrow.';

export default function LandingPage() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [descIndex, setDescIndex] = useState(0);
  const [showImage, setShowImage] = useState(false);
  const [showButtons, setShowButtons] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const navigate = useNavigate();

  // Animate title
  useEffect(() => {
    if (titleIndex < TITLE.length) {
      const timeout = setTimeout(() => setTitleIndex(titleIndex + 1), 60);
      return () => clearTimeout(timeout);
    } else if (descIndex === 0) {
      setTimeout(() => setDescIndex(1), 400);
    }
  }, [titleIndex]);

  // Animate description
  useEffect(() => {
    if (descIndex > 0 && descIndex < DESCRIPTION.length) {
      const timeout = setTimeout(() => setDescIndex(descIndex + 1), 30);
      return () => clearTimeout(timeout);
    } else if (descIndex === DESCRIPTION.length) {
      setTimeout(() => {
        setShowImage(true);
        setShowCursor(false); 
      }, 400);
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
    <div className="w-full min-h-screen bg-gradient-to-b from-green-600 via-green-500 to-green-100 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Animated floating leaves */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute text-green-400 opacity-40"
            style={{
              fontSize: `${Math.random() * 20 + 10}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animation: `float ${Math.random() * 15 + 10}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          >
            🍃
          </div>
        ))}
      </div>

      {/* Glowing spotlight effect */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-400 rounded-full filter blur-3xl opacity-20"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-green-300 rounded-full filter blur-3xl opacity-20"></div>

      <div className="relative z-10 flex flex-col items-center px-4">
        {/* Animated title with stronger shadow */}
        <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-center text-white drop-shadow-[0_5px_10px_rgba(0,0,0,0.3)] min-h-[120px]">
          {TITLE.slice(0, titleIndex)}
          {showCursor && <span className="text-green-300 animate-pulse">|</span>}
        </h1>

        {/* Description with glowing effect */}
        <p className="text-2xl md:text-3xl text-white mt-4 text-center text-shadow min-h-[40px]">
          {descIndex > 0 ? DESCRIPTION.slice(0, descIndex) : ''}
          {showCursor && <span className={`inline-block w-2 h-8 bg-green-300 ml-2 ${descIndex === DESCRIPTION.length ? 'animate-blink' : 'opacity-0'}`} />}
        </p>

        <div className="mt-16 flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Image with styling */}
          <div className={`relative transition-all duration-1000 ${showImage ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}>
            <img
              src={localImage}
              alt="CityBin Illustration"
              className="w-72 h-72 md:w-96 md:h-96 rounded-3xl shadow-2xl border-4 border-white/30 transform hover:scale-105 transition-transform duration-500"
              style={{ boxShadow: '0 10px 30px rgba(0, 100, 0, 0.4)' }}
              loading="lazy"
            />
            {/* Green glow effect */}
            <div className="absolute inset-0 rounded-3xl border-2 border-green-300/50 pointer-events-none animate-pulse"></div>
          </div>

         
          <div className={`flex flex-col gap-6 transition-opacity duration-700 ${showButtons ? 'opacity-100' : 'opacity-0'}`}>
            <button 
              className="w-[300px] py-4 bg-white text-green-500 rounded-[5px] shadow-md text-xl font-medium hover:bg-green-50 transition" 
              onClick={() => navigate('/login')}
            >
              Login
            </button>
            {/*<button 
              className="w-[300px] py-4 bg-white text-green-500 rounded-[5px] shadow-md text-xl font-medium hover:bg-green-50 transition" 
              onClick={() => navigate('/demo')}
            >
              See the Demo
            </button>*/}
          </div>
        </div>
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0) translateX(0) rotate(0deg); }
          50% { transform: translateY(-50px) translateX(20px) rotate(180deg); }
          100% { transform: translateY(-100px) translateX(40px) rotate(360deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .text-shadow {
          text-shadow: 0 2px 8px rgba(0, 100, 0, 0.5);
        }
      `}</style>
    </div>
  );
}