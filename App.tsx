
import React, { useState, useCallback } from 'react';
import { User, UserRole } from './types';
import LoginCard from './components/LoginCard';
import Dashboard from './components/Dashboard';
import Navbar from './components/Navbar';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = useCallback((loggedInUser: User) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
  }, []);

  const handleLogout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {isAuthenticated && user ? (
        <>
          <Navbar user={user} onLogout={handleLogout} />
          <main className="flex-grow p-4 md:p-8 animate-in fade-in duration-500">
            <Dashboard user={user} />
          </main>
        </>
      ) : (
        <div className="flex-grow flex flex-col items-center justify-center p-4 py-12 bg-gradient-to-br from-slate-50 to-blue-50">
          <LoginCard onLogin={handleLogin} />
        </div>
      )}
      
      <footer className="py-6 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} AA2001 Security and Technology Solutions Inc. All Rights Reserved.
      </footer>
    </div>
  );
};

export default App;
