import { Timer, LogOut } from 'lucide-react';
import { User } from '../types';

interface HeaderProps {
  currentUser: User;
  onLogout: () => void;
}

export function Header({ currentUser, onLogout }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Timer className="h-8 w-8 text-blue-600" />
            <h1 className="ml-2 text-2xl font-bold text-gray-900">
              Sistema de Ramadas 2025
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            {currentUser.isAuthenticated && (
              <button
                onClick={onLogout}
                className="flex items-center px-4 py-2 rounded-lg bg-red-50 text-red-700 hover:bg-red-100 transition duration-200"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Salir
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}