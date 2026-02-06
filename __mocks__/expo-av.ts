const mockSound = {
  playAsync: jest.fn(),
  setPositionAsync: jest.fn(),
  unloadAsync: jest.fn(),
};

export const Audio = {
  Sound: {
    createAsync: jest.fn().mockResolvedValue({ sound: mockSound }),
  },
  setAudioModeAsync: jest.fn(),
};
