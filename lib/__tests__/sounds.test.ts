jest.mock('expo-av');

// Mock the sound file requires
jest.mock('../../assets/sounds/tick.mp3', () => 1, { virtual: true });
jest.mock('../../assets/sounds/vote.mp3', () => 2, { virtual: true });
jest.mock('../../assets/sounds/result.mp3', () => 3, { virtual: true });

describe('sounds', () => {
  let Audio: any;
  let loadSounds: typeof import('../sounds').loadSounds;
  let playTick: typeof import('../sounds').playTick;
  let playVote: typeof import('../sounds').playVote;
  let playResult: typeof import('../sounds').playResult;
  let unloadSounds: typeof import('../sounds').unloadSounds;

  let mockTickSound: any;
  let mockVoteSound: any;
  let mockResultSound: any;

  beforeEach(() => {
    // Reset modules to get fresh state
    jest.resetModules();
    jest.clearAllMocks();

    // Create fresh mock sounds
    mockTickSound = {
      playAsync: jest.fn().mockResolvedValue(undefined),
      setPositionAsync: jest.fn().mockResolvedValue(undefined),
      unloadAsync: jest.fn().mockResolvedValue(undefined),
    };

    mockVoteSound = {
      playAsync: jest.fn().mockResolvedValue(undefined),
      setPositionAsync: jest.fn().mockResolvedValue(undefined),
      unloadAsync: jest.fn().mockResolvedValue(undefined),
    };

    mockResultSound = {
      playAsync: jest.fn().mockResolvedValue(undefined),
      setPositionAsync: jest.fn().mockResolvedValue(undefined),
      unloadAsync: jest.fn().mockResolvedValue(undefined),
    };

    // Re-import Audio after resetModules
    Audio = require('expo-av').Audio;

    // Mock Audio.Sound.createAsync to return different sounds in sequence
    let callCount = 0;
    (Audio.Sound.createAsync as jest.Mock).mockImplementation(() => {
      callCount++;
      if (callCount === 1) return Promise.resolve({ sound: mockTickSound });
      if (callCount === 2) return Promise.resolve({ sound: mockVoteSound });
      if (callCount === 3) return Promise.resolve({ sound: mockResultSound });
      return Promise.resolve({ sound: mockTickSound });
    });

    (Audio.setAudioModeAsync as jest.Mock).mockResolvedValue(undefined);

    // Re-import the module
    const mod = require('../sounds');
    loadSounds = mod.loadSounds;
    playTick = mod.playTick;
    playVote = mod.playVote;
    playResult = mod.playResult;
    unloadSounds = mod.unloadSounds;
  });

  describe('loadSounds', () => {
    it('calls setAudioModeAsync with correct config', async () => {
      await loadSounds();

      expect(Audio.setAudioModeAsync).toHaveBeenCalledWith({
        playsInSilentModeIOS: false,
        staysActiveInBackground: false,
      });
    });

    it('creates all three sounds with correct parameters', async () => {
      await loadSounds();

      expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(3);

      // First call - tick sound
      expect(Audio.Sound.createAsync).toHaveBeenNthCalledWith(
        1,
        expect.any(Number), // require() returns a number
        { volume: 0.3 }
      );

      // Second call - vote sound
      expect(Audio.Sound.createAsync).toHaveBeenNthCalledWith(
        2,
        expect.any(Number),
        { volume: 0.5 }
      );

      // Third call - result sound
      expect(Audio.Sound.createAsync).toHaveBeenNthCalledWith(
        3,
        expect.any(Number),
        { volume: 0.5 }
      );
    });

    it('only loads sounds once (subsequent calls are no-op)', async () => {
      await loadSounds();
      await loadSounds();
      await loadSounds();

      expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(3);
      expect(Audio.setAudioModeAsync).toHaveBeenCalledTimes(1);
    });

    it('handles errors gracefully and logs them', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const error = new Error('Sound file not found');

      (Audio.setAudioModeAsync as jest.Mock).mockRejectedValue(error);

      await loadSounds();

      expect(consoleSpy).toHaveBeenCalledWith('Sound loading skipped:', error);

      consoleSpy.mockRestore();
    });

    it('continues without sounds when createAsync fails', async () => {
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      const error = new Error('Asset not found');

      (Audio.Sound.createAsync as jest.Mock).mockRejectedValue(error);

      await loadSounds();

      expect(consoleSpy).toHaveBeenCalledWith('Sound loading skipped:', error);

      consoleSpy.mockRestore();
    });
  });

  describe('playTick', () => {
    it('calls setPositionAsync(0) and playAsync on tick sound', async () => {
      await loadSounds();
      await playTick();

      expect(mockTickSound.setPositionAsync).toHaveBeenCalledWith(0);
      expect(mockTickSound.playAsync).toHaveBeenCalled();
    });

    it('is no-op when sounds not loaded', async () => {
      await playTick();

      // Should not throw, but also not call anything
      expect(mockTickSound.setPositionAsync).not.toHaveBeenCalled();
      expect(mockTickSound.playAsync).not.toHaveBeenCalled();
    });

    it('handles play errors silently', async () => {
      await loadSounds();
      mockTickSound.playAsync.mockRejectedValue(new Error('Play failed'));

      await playTick();

      // Should not throw
      expect(mockTickSound.playAsync).toHaveBeenCalled();
    });
  });

  describe('playVote', () => {
    it('calls setPositionAsync(0) and playAsync on vote sound', async () => {
      await loadSounds();
      await playVote();

      expect(mockVoteSound.setPositionAsync).toHaveBeenCalledWith(0);
      expect(mockVoteSound.playAsync).toHaveBeenCalled();
    });

    it('is no-op when sounds not loaded', async () => {
      await playVote();

      expect(mockVoteSound.setPositionAsync).not.toHaveBeenCalled();
      expect(mockVoteSound.playAsync).not.toHaveBeenCalled();
    });

    it('handles errors silently', async () => {
      await loadSounds();
      mockVoteSound.setPositionAsync.mockRejectedValue(new Error('Position failed'));

      await playVote();

      expect(mockVoteSound.setPositionAsync).toHaveBeenCalled();
    });
  });

  describe('playResult', () => {
    it('calls setPositionAsync(0) and playAsync on result sound', async () => {
      await loadSounds();
      await playResult();

      expect(mockResultSound.setPositionAsync).toHaveBeenCalledWith(0);
      expect(mockResultSound.playAsync).toHaveBeenCalled();
    });

    it('is no-op when sounds not loaded', async () => {
      await playResult();

      expect(mockResultSound.setPositionAsync).not.toHaveBeenCalled();
      expect(mockResultSound.playAsync).not.toHaveBeenCalled();
    });

    it('handles errors silently', async () => {
      await loadSounds();
      mockResultSound.playAsync.mockRejectedValue(new Error('Play error'));

      await playResult();

      expect(mockResultSound.playAsync).toHaveBeenCalled();
    });
  });

  describe('unloadSounds', () => {
    it('calls unloadAsync on all sounds', async () => {
      await loadSounds();
      await unloadSounds();

      expect(mockTickSound.unloadAsync).toHaveBeenCalled();
      expect(mockVoteSound.unloadAsync).toHaveBeenCalled();
      expect(mockResultSound.unloadAsync).toHaveBeenCalled();
    });

    it('resets soundsLoaded flag so sounds can be reloaded', async () => {
      await loadSounds();
      expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(3);

      await unloadSounds();

      // Clear the call count for createAsync
      jest.clearAllMocks();

      // Should load again since soundsLoaded is now false
      await loadSounds();
      expect(Audio.Sound.createAsync).toHaveBeenCalledTimes(3);
    });

    it('handles errors silently when sounds not loaded', async () => {
      await unloadSounds();

      // Should not throw
    });

    it('handles unload errors silently', async () => {
      await loadSounds();
      mockTickSound.unloadAsync.mockRejectedValue(new Error('Unload failed'));

      await unloadSounds();

      expect(mockTickSound.unloadAsync).toHaveBeenCalled();
    });
  });
});
