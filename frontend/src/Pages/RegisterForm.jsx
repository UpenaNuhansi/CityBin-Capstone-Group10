import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BIN_IMAGE = 'https://png.pngtree.com/png-clipart/20250116/original/pngtree-cartoon-recycling-bin-illustration-with-a-smiling-face-surrounded-by-green-png-image_20201283.png';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const navigate = useNavigate();

  // Animation state
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowLeft(true), 100);
    setTimeout(() => setShowRight(true), 400);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      setMessage({
        type: 'success',
        content: 'Registration successful! Redirecting to Dashboard...'
      });
      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      setMessage({
        type: 'error',
        content: err.message || 'Registration failed. Please try again.'
      });
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-[#e8f5e9] to-[#f7f8f9] py-8 px-2">
      <div className="w-full h-[600px] max-w-6xl bg-[#f7f8f9] rounded-xl shadow-2xl flex flex-col md:flex-row overflow-hidden">
        {/* Left: Green box with bin image */}
        <div className={`md:w-1/2 w-full flex items-center justify-center bg-[#6ee36e] transition-all duration-700 ${showLeft ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-16'} p-8`}>
          <div className="w-full h-full flex items-center justify-center">
            <img
              src={BIN_IMAGE}
              alt="Bin"
              className="w-[320px] h-[320px] object-contain rounded-2xl"
              style={{ background: 'none' }}
            />
          </div>
        </div>
        {/* Right: Register form */}
        <div className={`md:w-1/2 w-full flex items-center justify-center transition-all duration-700 ${showRight ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-16'} p-8`}>
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-2xl md:text-2xl font-bold text-center mb-2 text-gray-800">Create Account</h2>
            <p className="text-center text-gray-500 mb-6">Sign up to get started with CityBin</p>
            {message.content && (
              <div className={`mb-6 p-3 rounded-lg text-center ${
                message.type === 'success' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                {message.content}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Username"
                  required
                />
              </div>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Email"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Password"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-[#6ee36e] hover:bg-[#4ec94e] text-white font-bold py-2 px-4 rounded-lg transition duration-300"
              >
                Sign Up
              </button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 hover:underline font-semibold">
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}