import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { User, Mail, Lock, Loader2 } from 'lucide-react';

import localImage from '../assets/binsLogin.jpg';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Animation state
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowForm(true), 100);
    if (localStorage.getItem('token')) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user.role === 'User') navigate('/user/home');
      else navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });
    setIsLoading(true);

    try {
      const response = await api.post('/auth/register', {
        username,
        email,
        password,
        role: 'User' // Force User role
      });
      if (response.data.success) {
        setMessage({
          type: 'success',
          content: 'Registration successful! Redirecting to login...'
        });
        setTimeout(() => {
          navigate('/login');
          setIsLoading(false);
        }, 1500);
      }
    } catch (err) {
      setIsLoading(false);
      setMessage({
        type: 'error',
        content: err.response?.data?.message || 'Registration failed. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-white">
      {/* Left column with green background */}
      <div className="hidden md:flex md:w-1/2 bg-green-600 items-center justify-center p-8">
        <div className="flex flex-col items-center">
          <div className="mb-8 w-72 h-72 bg-white rounded-lg overflow-hidden shadow-xl border-4 border-white/30">
            <img
              src={localImage}
              alt="CityBin Illustration"
              className="w-full h-full object-cover"
              style={{ boxShadow: '0 10px 30px rgba(0, 100, 0, 0.4)' }}
              loading="lazy"
            />
          </div>
          <h1 className="text-4xl font-bold mb-4 text-white">Join CityBin</h1>
          <p className="text-xl text-white">Be part of our waste management community</p>
        </div>
      </div>

      {/* Right column with white background and sign-up form */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white py-8 px-4">
        <div className={`w-full max-w-md bg-white rounded-2xl shadow-xl p-8 transform transition-all duration-500 ${showForm ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h2 className="text-3xl font-bold text-center text-green-800 mb-2">Sign Up</h2>
          <p className="text-center text-gray-600 mb-6">Create an account to get started</p>
          {message.content && (
            <div className={`mb-6 p-3 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.content}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                placeholder="Username"
                required
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                placeholder="Email"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                placeholder="Password"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : null}
              Sign Up
            </button>
          </form>
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:underline font-semibold">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}