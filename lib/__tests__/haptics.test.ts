import { hapticVote, hapticResult, hapticTick } from '../haptics';
import * as Haptics from 'expo-haptics';

describe('haptics', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('hapticVote should call impactAsync with Medium', () => {
    hapticVote();

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Medium);
    expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
  });

  it('hapticResult should call notificationAsync with Success', () => {
    hapticResult();

    expect(Haptics.notificationAsync).toHaveBeenCalledWith(Haptics.NotificationFeedbackType.Success);
    expect(Haptics.notificationAsync).toHaveBeenCalledTimes(1);
  });

  it('hapticTick should call impactAsync with Light', () => {
    hapticTick();

    expect(Haptics.impactAsync).toHaveBeenCalledWith(Haptics.ImpactFeedbackStyle.Light);
    expect(Haptics.impactAsync).toHaveBeenCalledTimes(1);
  });
});
