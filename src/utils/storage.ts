import { Schedule, User } from '../types';

const SCHEDULES_KEY = 'scheduler_schedules';
const USER_KEY = 'scheduler_user';
const LAST_UPDATE_KEY = 'scheduler_last_update';

export const storage = {
  saveSchedules: (schedules: Schedule[]) => {
    localStorage.setItem(SCHEDULES_KEY, JSON.stringify(schedules));
    localStorage.setItem(LAST_UPDATE_KEY, Date.now().toString());
  },

  getSchedules: (): Schedule[] => {
    const saved = localStorage.getItem(SCHEDULES_KEY);
    const lastUpdate = localStorage.getItem(LAST_UPDATE_KEY);
    
    if (!saved || !lastUpdate) {
      return [];
    }

    const schedules: Schedule[] = JSON.parse(saved);
    const timeDiff = Math.floor((Date.now() - parseInt(lastUpdate)) / 1000);

    // Update remaining time but keep completed schedules
    return schedules.map(schedule => ({
      ...schedule,
      remainingTime: Math.max(0, schedule.remainingTime - timeDiff)
    }));
  },

  saveUser: (user: User) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },

  getUser: (): User | null => {
    const saved = localStorage.getItem(USER_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  clearUser: () => {
    localStorage.removeItem(USER_KEY);
  }
};