import { MILESTONES, getNextMilestone, isNewMilestone } from '../streaks';

describe('streaks', () => {
  describe('MILESTONES', () => {
    it('should have exact milestone values', () => {
      expect(MILESTONES).toEqual([3, 7, 14, 30, 50, 100]);
    });

    it('should contain only numbers in ascending order', () => {
      for (let i = 1; i < MILESTONES.length; i++) {
        expect(MILESTONES[i]).toBeGreaterThan(MILESTONES[i - 1]);
      }
    });

    it('should have length of 6', () => {
      expect(MILESTONES.length).toBe(6);
    });
  });

  describe('getNextMilestone', () => {
    it('should return 3 for streak 0', () => {
      expect(getNextMilestone(0)).toBe(3);
    });

    it('should return 3 for streak 2', () => {
      expect(getNextMilestone(2)).toBe(3);
    });

    it('should return 7 for streak 3', () => {
      expect(getNextMilestone(3)).toBe(7);
    });

    it('should return 14 for streak 7', () => {
      expect(getNextMilestone(7)).toBe(14);
    });

    it('should return 30 for streak 14', () => {
      expect(getNextMilestone(14)).toBe(30);
    });

    it('should return 50 for streak 30', () => {
      expect(getNextMilestone(30)).toBe(50);
    });

    it('should return 100 for streak 50', () => {
      expect(getNextMilestone(50)).toBe(100);
    });

    it('should return null for streak 100', () => {
      expect(getNextMilestone(100)).toBe(null);
    });

    it('should return null for streak 150', () => {
      expect(getNextMilestone(150)).toBe(null);
    });

    it('should return 7 for streak between 3 and 7', () => {
      expect(getNextMilestone(4)).toBe(7);
      expect(getNextMilestone(5)).toBe(7);
      expect(getNextMilestone(6)).toBe(7);
    });

    it('should return 14 for streak between 7 and 14', () => {
      expect(getNextMilestone(8)).toBe(14);
      expect(getNextMilestone(10)).toBe(14);
      expect(getNextMilestone(13)).toBe(14);
    });
  });

  describe('isNewMilestone', () => {
    it('should return true for streak 3', () => {
      expect(isNewMilestone(3)).toBe(true);
    });

    it('should return true for streak 7', () => {
      expect(isNewMilestone(7)).toBe(true);
    });

    it('should return true for streak 14', () => {
      expect(isNewMilestone(14)).toBe(true);
    });

    it('should return true for streak 30', () => {
      expect(isNewMilestone(30)).toBe(true);
    });

    it('should return true for streak 50', () => {
      expect(isNewMilestone(50)).toBe(true);
    });

    it('should return true for streak 100', () => {
      expect(isNewMilestone(100)).toBe(true);
    });

    it('should return false for streak 0', () => {
      expect(isNewMilestone(0)).toBe(false);
    });

    it('should return false for streak 1', () => {
      expect(isNewMilestone(1)).toBe(false);
    });

    it('should return false for streak 5', () => {
      expect(isNewMilestone(5)).toBe(false);
    });

    it('should return false for streak 99', () => {
      expect(isNewMilestone(99)).toBe(false);
    });

    it('should return false for streak 101', () => {
      expect(isNewMilestone(101)).toBe(false);
    });

    it('should return false for streak 2', () => {
      expect(isNewMilestone(2)).toBe(false);
    });

    it('should return false for streak 10', () => {
      expect(isNewMilestone(10)).toBe(false);
    });

    it('should return false for streak 25', () => {
      expect(isNewMilestone(25)).toBe(false);
    });
  });
});
