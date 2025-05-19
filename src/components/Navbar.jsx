import { Link, useLocation } from 'react-router-dom';
import { ConnectKitButton } from 'connectkit';

const formatAddress = (address, ensName) => {
  if (!address) return '';
  return ensName || `${address.slice(0, 6)}...${address.slice(-4)}`;
};

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="flex justify-between items-center p-4 bg-white shadow-sm sticky top-0 z-50">
      <Link to="/" className="text-xl font-bold text-indigo-600">
        LensCollective
      </Link>
      
      <div className="hidden md:flex items-center gap-1">
        <Link 
          to="/" 
          className={`px-4 py-2 rounded-lg ${isActive('/') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-500 hover:bg-indigo-50'}`}
        >
          Home
        </Link>
        <Link 
          to="/explore" 
          className={`px-4 py-2 rounded-lg ${isActive('/explore') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-500 hover:bg-indigo-50'}`}
        >
          Explore
        </Link>
        <Link 
          to="/profile" 
          className={`px-4 py-2 rounded-lg ${isActive('/profile') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:text-indigo-500 hover:bg-indigo-50'}`}
        >
          Profile
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <Link 
          to="/create" 
          className="hidden sm:flex items-center gap-1 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium shadow-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Create
        </Link>

        <ConnectKitButton.Custom>
          {({ isConnected, isConnecting, show, address, ensName }) => (
            <button
              onClick={show}
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded-lg shadow-sm disabled:opacity-50"
              disabled={isConnecting}
            >
              {isConnecting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connecting...
                </>
              ) : isConnected ? (
                <>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  {formatAddress(address, ensName)}
                </>
              ) : (
                "Connect Wallet"
              )}
            </button>
          )}
        </ConnectKitButton.Custom>
      </div>
    </nav>
  );
}

export default Navbar;