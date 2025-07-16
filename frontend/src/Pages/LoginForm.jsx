import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Lock, Mail, Loader2 } from 'lucide-react';
import localImage from '../assets/binsLogin.jpg';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setShowForm(true), 100);

    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (token && user.role) {
      if (user.role === 'User') {
        navigate('/user/home', { replace: true });
      } else if (['Admin', 'Operator'].includes(user.role)) {
        navigate('/admin/dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });
    setIsLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });

      if (response.data.success) {
        // Normalize user object to always have id and role
        let user = response.data.user;
        if (user && !user.id && user._id) {
          user.id = user._id;
        }
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(user));
        console.log('Login: user saved to localStorage:', user);

        setMessage({
          type: 'success',
          content: 'Login successful! Redirecting...'
        });

        const role = response.data.user.role;
        setTimeout(() => {
          navigate(role === 'User' ? '/user/home' : '/admin/dashboard');
        }, 1000);
      } else {
        setMessage({ type: 'error', content: response.data.message || 'Login failed' });
      }
    } catch (err) {
      setMessage({
        type: 'error',
        content: err.response?.data?.message || 'Network error. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex">
      {/* Left column with green background */}
      <div className="hidden md:flex md:w-1/2 bg-green-600 items-center justify-center p-8 flex-col">
        {/* Square image container */}
        <div className="mb-8 w-72 h-72 bg-white rounded-lg overflow-hidden shadow-xl border-4 border-white/30">
          <img
            src={localImage}
            alt="CityBin Illustration"
            className="w-full h-full object-cover"
            style={{ boxShadow: '0 10px 30px rgba(0, 100, 0, 0.4)' }}
            loading="lazy"
          />
        </div>
        
        <div className="max-w-md text-white text-center">
          <h1 className="text-4xl font-bold mb-4">Welcome to CityBin</h1>
          <p className="text-xl">Efficient waste management for cleaner cities</p>
        </div>
      </div>

      {/* Right column with white background */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white py-8 px-4">
        <div className={`w-full max-w-md bg-white rounded-2xl shadow-xl p-8 ${showForm ? 'opacity-100' : 'opacity-0'}`}>
          <h2 className="text-3xl font-bold text-center text-green-800 mb-2">Sign In</h2>
          <p className="text-center text-gray-600 mb-6">Sign in to access your dashboard</p>

          {message.content && (
            <div className={`mb-6 p-3 rounded-lg text-center ${message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {message.content}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
                placeholder="Email"
                required
                autoComplete="username"
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
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 flex items-center justify-center disabled:opacity-50"
            >
              {isLoading && <Loader2 className="animate-spin h-5 w-5 mr-2" />}
              Sign In
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 hover:underline font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}