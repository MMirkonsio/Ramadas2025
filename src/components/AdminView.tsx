import React, { useState } from 'react';
import { Clock, Trash2, UserPlus, Users } from 'lucide-react';
import { Schedule } from '../types';
import { EmployeeView } from './EmployeeView';

interface AdminViewProps {
  schedules: Schedule[];
  onAddSchedule: (name: string, time: string) => void;
  onDeleteSchedule: (id: string) => void;
}

export function AdminView({ schedules, onAddSchedule, onDeleteSchedule }: AdminViewProps) {
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [activeTab, setActiveTab] = useState<'manage' | 'preview'>('manage');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && time) {
      onAddSchedule(name, time);
      setName('');
      setTime('');
    }
  };

  const getStatusColor = (remainingTime: number) => {
    return remainingTime === 0 ? 'bg-green-600' : 'bg-blue-600';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getStatusText = (remainingTime: number) => {
    if (remainingTime === 0) {
      return (
        <span className="px-3 py-1 bg-green-100 text-green-900 rounded-full text-base font-medium">
          Terminado
        </span>
      );
    }
    return (
      <span
  className="px-3 py-1 bg-gray-200 text-neutral-900 rounded-full text-base font-medium flex items-center justify-center"
  style={{ minWidth: '130px', maxWidth: '180px', display: 'inline-flex' }}
>
  <span>{formatTime(remainingTime)}</span>
  <span>&nbsp;restante</span>
</span>


    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 flex space-x-4 justify-center">
        <button
          onClick={() => setActiveTab('manage')}
          className={`flex items-center px-4 py-2 rounded-lg transition duration-200 ${
            activeTab === 'manage'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <UserPlus className="h-5 w-5 mr-2" />
          <span className='font-semibold'>
          Ingresar Niños
          </span>
          
        </button>
        <button
          onClick={() => setActiveTab('preview')}
          className={`flex items-center px-4 py-2 rounded-lg transition duration-200 ${
            activeTab === 'preview'
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-600 hover:bg-gray-50'
          }`}
        >
          <Users className="h-5 w-5 mr-2" />
          <span className='font-semibold'>
          Ver Niños
          </span>
        </button>
      </div>

      {activeTab === 'manage' ? (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <UserPlus className="mr-2 text-blue-600" />
              AÑADIR NIÑO
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre del Niño
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingrese el nombre del niño"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tiempo (minutos)
                  </label>
                  <input
                    type="number"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Ingrese el tiempo en minutos"
                    min="1"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 font-semibold text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200"
              >
                INGRESAR
              </button>
            </form>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Clock className="mr-2 text-blue-600" />
              Niños en juego
            </h2>
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div
                  key={schedule.id}
                  className={`p-4 rounded-lg border ${
                    schedule.remainingTime === 0
                      ? 'bg-green-50 border-green-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-800 text-2xl">{schedule.name}</h3>
                    {getStatusText(schedule.remainingTime)}
                  </div>
                  <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden mb-3">
                    <div
                      className={`absolute top-0 left-0 h-full ${getStatusColor(
                        schedule.remainingTime
                      )} transition-all duration-1000 rounded-full`}
                      style={{
                        width: `${(schedule.remainingTime / (parseInt(schedule.time) * 60)) * 100}%`,
                      }}
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => onDeleteSchedule(schedule.id)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-full transition duration-200"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
              {schedules.length === 0 && (
                <p className="text-center text-gray-500 py-4">No hay horarios activos</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg">
          <div className="border-b border-gray-200 p-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <Users className="mr-2 text-blue-600" />
              Niños en juego
            </h2>
          </div>
          <div className="p-4">
            <EmployeeView schedules={schedules} />
          </div>
        </div>
      )}
    </div>
  );
}
