import { Audio } from 'expo-av';

let tickSound: Audio.Sound | null = null;
let voteSound: Audio.Sound | null = null;
let resultSound: Audio.Sound | null = null;
let soundsLoaded = false;

export async function loadSounds() {
  if (soundsLoaded) return;

  try {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
    });

    const { sound: tick } = await Audio.Sound.createAsync(
      require('../assets/sounds/tick.mp3'),
      { volume: 0.3 }
    );
    tickSound = tick;

    const { sound: vote } = await Audio.Sound.createAsync(
      require('../assets/sounds/vote.mp3'),
      { volume: 0.5 }
    );
    voteSound = vote;

    const { sound: result } = await Audio.Sound.createAsync(
      require('../assets/sounds/result.mp3'),
      { volume: 0.5 }
    );
    resultSound = result;

    soundsLoaded = true;
  } catch (error) {
    // Sound files not found - silently continue without sounds
    console.log('Sound loading skipped:', error);
  }
}

export async function playTick() {
  try {
    if (tickSound) {
      await tickSound.setPositionAsync(0);
      await tickSound.playAsync();
    }
  } catch {}
}

export async function playVote() {
  try {
    if (voteSound) {
      await voteSound.setPositionAsync(0);
      await voteSound.playAsync();
    }
  } catch {}
}

export async function playResult() {
  try {
    if (resultSound) {
      await resultSound.setPositionAsync(0);
      await resultSound.playAsync();
    }
  } catch {}
}

export async function unloadSounds() {
  try {
    await tickSound?.unloadAsync();
    await voteSound?.unloadAsync();
    await resultSound?.unloadAsync();
    soundsLoaded = false;
  } catch {}
}
