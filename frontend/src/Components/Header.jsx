import { useNavigate } from 'react-router-dom';

function Header() {

   const navigate = useNavigate();
   
  return (
    <div className="bg-white border-b border-gray-200 p-2 flex justify-between items-center">
      <div className="w-full max-w-md relative">
        <input
          type="text"
          placeholder="search something"
          className="w-full bg-gray-200 py-2 px-4 pl-10 rounded-full text-sm focus:outline-none"
        />
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
          </svg>
        </button>
      </div>
      
      <div className="ml-4">
        <button onClick={() => navigate('/settings')} className="rounded-full bg-gray-200 p-2">
          <svg className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Header;