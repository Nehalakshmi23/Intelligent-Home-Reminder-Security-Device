import { Audio } from 'expo-av';

type AlertType = 'emergency' | 'reminder' | 'security' | 'motion';

// Map alert types to sound files (using require() which returns numbers for Expo)
const soundMap: Record<AlertType, number> = {
  emergency: require('../assets/sounds/emergency.mp3'),
  reminder: require('../assets/sounds/reminder.mp3'),
  security: require('../assets/sounds/security.mp3'),
  motion: require('../assets/sounds/security.mp3'),
};

class SoundService {
  private soundObjects: Map<AlertType, Audio.Sound> = new Map();
  private isInitialized = false;
  private isInitializing = false;

  async initialize() {
    if (this.isInitialized || this.isInitializing) return;
    
    this.isInitializing = true;
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: true,
        shouldDuckAndroid: true,
      });
      this.isInitialized = true;
      console.log('✅ Audio service initialized');
    } catch (error) {
      console.error('❌ Failed to initialize audio:', error);
    } finally {
      this.isInitializing = false;
    }
  }

  async loadSounds() {
    await this.initialize();

    try {
      // Pre-load all sounds for faster playback
      for (const [alertType, soundSource] of Object.entries(soundMap)) {
        try {
          const sound = new Audio.Sound();
          await sound.loadAsync(soundSource as any);
          this.soundObjects.set(alertType as AlertType, sound);
          console.log(`✅ Loaded sound: ${alertType}`);
        } catch (error) {
          console.error(`Failed to load ${alertType} sound:`, error);
        }
      }
      console.log('✅ All alert sounds loaded');
    } catch (error) {
      console.error('❌ Failed to load sounds:', error);
    }
  }

  async playSound(alertType: AlertType) {
    try {
      console.log(`🔊 playSound called for: ${alertType}`);
      
      // Ensure audio is initialized
      if (!this.isInitialized) {
        console.log('⚠️ Initializing audio...');
        await this.initialize();
      }

      const soundSource = soundMap[alertType];
      
      // Create a fresh sound object each time for reliability
      console.log(`🔄 Creating new sound instance for: ${alertType}`);
      const { sound } = await Audio.Sound.createAsync(
        soundSource as any,
        { shouldPlay: true, volume: 1.0 }
      );
      
      console.log(`✅ Sound playing: ${alertType}`);
      
      // Unload after playing to free resources
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          sound.unloadAsync().catch(console.error);
        }
      });
      
    } catch (error) {
      console.error(`❌ Failed to play ${alertType} sound:`, error);
    }
  }

  async stopSound() {
    try {
      for (const sound of this.soundObjects.values()) {
        await sound.stopAsync();
      }
    } catch (error) {
      console.error('❌ Failed to stop sounds:', error);
    }
  }

  async cleanup() {
    try {
      for (const sound of this.soundObjects.values()) {
        await sound.unloadAsync();
      }
      this.soundObjects.clear();
      console.log('✅ Sound resources cleaned up');
    } catch (error) {
      console.error('❌ Failed to cleanup sounds:', error);
    }
  }
}

// Export singleton instance
export const soundService = new SoundService();

// Initialize immediately on app load
soundService.loadSounds().catch(console.error);
