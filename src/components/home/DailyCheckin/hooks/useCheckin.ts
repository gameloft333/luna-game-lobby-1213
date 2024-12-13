import React from 'react';
import { CheckinState } from '../types';
import { STORAGE_KEY } from '../constants';

export function useCheckin(testMode = false) {
  const [state, setState] = React.useState<CheckinState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {
      lastCheckin: null,
      completedDays: [],
      currentWeek: 1,
    };
  });

  const canClaimToday = React.useCallback((day: number) => {
    if (testMode) return true;

    const today = new Date().toDateString();
    const isToday = day === state.completedDays.length + 1;
    const hasntClaimedToday = state.lastCheckin !== today;

    return isToday && hasntClaimedToday;
  }, [state.lastCheckin, state.completedDays, testMode]);

  const claim = React.useCallback((day: number) => {
    if (!canClaimToday(day) && !testMode) return false;

    setState(prev => {
      const newState = {
        lastCheckin: new Date().toDateString(),
        completedDays: [...prev.completedDays, day],
        currentWeek: prev.currentWeek,
      };

      // Reset week if completed
      if (newState.completedDays.length === 7) {
        newState.completedDays = [];
        newState.currentWeek += 1;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    });

    return true;
  }, [canClaimToday, testMode]);

  // Check for new day at midnight
  React.useEffect(() => {
    const checkNewDay = () => {
      const now = new Date();
      const tomorrow = new Date(now);
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const timeUntilMidnight = tomorrow.getTime() - now.getTime();
      
      setTimeout(() => {
        setState(prev => ({ ...prev })); // Trigger re-render
        checkNewDay(); // Schedule next check
      }, timeUntilMidnight);
    };

    checkNewDay();
  }, []);

  return {
    state,
    canClaimToday,
    claim,
  };
}