import { useCallback } from 'react';

type AlertType = 'motion' | 'emergency' | 'security' | 'reminder';

// Map alert types to audio files
const audioMap: Record<AlertType, string> = {
  motion: '/sounds/security.mp3',
  emergency: '/sounds/emergency.mp3',
  security: '/sounds/security.mp3',
  reminder: '/sounds/reminder.mp3',
};

export const useAlertSound = () => {
  const playSound = useCallback((alertType: AlertType) => {
    try {
      const audioPath = audioMap[alertType];
      if (!audioPath) {
        console.warn(`No sound mapping for alert type: ${alertType}`);
        return;
      }

      const audio = new Audio(audioPath);
      audio.volume = 0.8; // Set volume to 80%
      audio.play().catch((error) => {
        console.error(`Failed to play ${alertType} sound:`, error);
      });

      console.log(`🔊 Playing ${alertType} alert sound`);
    } catch (error) {
      console.error('Failed to play alert sound:', error);
    }
  }, []);

  return { playSound };
};
