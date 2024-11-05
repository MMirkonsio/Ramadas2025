import { Clock } from 'lucide-react';
import { Schedule } from '../types';

interface EmployeeViewProps {
  schedules: Schedule[];
}

export function EmployeeView({ schedules }: EmployeeViewProps) {
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
    <div className="w-full max-w-4xl mx-auto p-6">
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
              <div className="relative w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`absolute top-0 left-0 h-full ${getStatusColor(
                    schedule.remainingTime
                  )} transition-all duration-1000 rounded-full`}
                  style={{
                    width: `${(schedule.remainingTime / (parseInt(schedule.time) * 60)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ))}
          {schedules.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No schedules assigned</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}