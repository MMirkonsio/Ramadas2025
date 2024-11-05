import { useState, useEffect } from 'react';
import { Schedule, User } from './types';
import { AdminView } from './components/AdminView';
import { EmployeeView } from './components/EmployeeView';
import { Header } from './components/Header';
import { LoginForm } from './components/LoginForm';
import { storage } from './utils/storage';

// In a real app, these would be environment variables and the password would be hashed
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

export function App() {
  const [schedules, setSchedules] = useState<Schedule[]>(() => storage.getSchedules());
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const savedUser = storage.getUser();
    return savedUser || { role: 'employee', isAuthenticated: false };
  });
  const [loginError, setLoginError] = useState<string>();

  // Update schedules from storage periodically
  useEffect(() => {
    const updateInterval = setInterval(() => {
      const storedSchedules = storage.getSchedules();
      setSchedules(storedSchedules);
    }, 1000);

    return () => clearInterval(updateInterval);
  }, []);

  // Update remaining time
  useEffect(() => {
    const timer = setInterval(() => {
      setSchedules((currentSchedules) => {
        const updatedSchedules = currentSchedules.map((schedule) => ({
          ...schedule,
          remainingTime: Math.max(0, schedule.remainingTime - 1),
        }));
        storage.saveSchedules(updatedSchedules);
        return updatedSchedules;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleLogin = (username: string, password: string) => {
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const user: User = { role: 'admin', isAuthenticated: true };
      setCurrentUser(user);
      storage.saveUser(user);
      setLoginError(undefined);
    } else {
      setLoginError('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setCurrentUser({ role: 'employee', isAuthenticated: false });
    storage.clearUser();
  };

  const handleAddSchedule = (name: string, time: string) => {
    const newSchedule: Schedule = {
      id: crypto.randomUUID(),
      name,
      time,
      remainingTime: parseInt(time) * 60,
    };
    const updatedSchedules = [...schedules, newSchedule];
    setSchedules(updatedSchedules);
    storage.saveSchedules(updatedSchedules);
  };

  const handleDeleteSchedule = (id: string) => {
    const updatedSchedules = schedules.filter((schedule) => schedule.id !== id);
    setSchedules(updatedSchedules);
    storage.saveSchedules(updatedSchedules);
  };

  // Show login form if trying to access admin features without authentication
  if (!currentUser.isAuthenticated && window.location.hash === '#admin') {
    return <LoginForm onLogin={handleLogin} error={loginError} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentUser={currentUser} 
        onLogout={handleLogout}
      />
      <main className="container mx-auto py-8">
        {currentUser.role === 'admin' && currentUser.isAuthenticated ? (
          <AdminView
            schedules={schedules}
            onAddSchedule={handleAddSchedule}
            onDeleteSchedule={handleDeleteSchedule}
          />
        ) : (
          <EmployeeView schedules={schedules} />
        )}
      </main>
      {!currentUser.isAuthenticated && (
        <div className="fixed bottom-4 right-4">
          <a
            href="#admin"
            className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
          >
            Admin Login
          </a>
        </div>
      )}
    </div>
  );
}