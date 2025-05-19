import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // After authentication logic
    navigate('/admin'); // or `/user` based on role
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h2 className="text-2xl mb-4 font-bold">Sign In</h2>
        <input type="email" placeholder="Email" className="w-full mb-3 p-2 border rounded" />
        <input type="password" placeholder="Password" className="w-full mb-3 p-2 border rounded" />
        <button onClick={handleSignIn} className="w-full bg-green-600 text-white p-2 rounded">Sign In</button>
        <p className="mt-4 text-sm">
          Don’t have an account? <a href="/signup" className="text-green-700 font-medium">Sign Up</a>
        </p>
      </div>
    </div>
  );
}
