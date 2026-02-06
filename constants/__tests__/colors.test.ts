import { Colors } from '../colors';

describe('Colors', () => {
  describe('Color object structure', () => {
    it('should have all expected color keys', () => {
      const expectedKeys = [
        'background',
        'surface',
        'optionA',
        'optionB',
        'text',
        'textMuted',
        'accent',
        'success',
        'warning',
      ];

      expectedKeys.forEach(key => {
        expect(Colors).toHaveProperty(key);
      });
    });

    it('should have exactly 9 color keys', () => {
      const keys = Object.keys(Colors);
      expect(keys.length).toBe(9);
    });

    it('should include background color', () => {
      expect(Colors).toHaveProperty('background');
    });

    it('should include surface color', () => {
      expect(Colors).toHaveProperty('surface');
    });

    it('should include optionA color', () => {
      expect(Colors).toHaveProperty('optionA');
    });

    it('should include optionB color', () => {
      expect(Colors).toHaveProperty('optionB');
    });

    it('should include text color', () => {
      expect(Colors).toHaveProperty('text');
    });

    it('should include textMuted color', () => {
      expect(Colors).toHaveProperty('textMuted');
    });

    it('should include accent color', () => {
      expect(Colors).toHaveProperty('accent');
    });

    it('should include success color', () => {
      expect(Colors).toHaveProperty('success');
    });

    it('should include warning color', () => {
      expect(Colors).toHaveProperty('warning');
    });
  });

  describe('Hex color format validation', () => {
    const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

    it('should have all colors in valid hex format', () => {
      Object.values(Colors).forEach(color => {
        expect(color).toMatch(hexColorRegex);
      });
    });

    it('should have background color in hex format', () => {
      expect(Colors.background).toMatch(hexColorRegex);
    });

    it('should have surface color in hex format', () => {
      expect(Colors.surface).toMatch(hexColorRegex);
    });

    it('should have optionA color in hex format', () => {
      expect(Colors.optionA).toMatch(hexColorRegex);
    });

    it('should have optionB color in hex format', () => {
      expect(Colors.optionB).toMatch(hexColorRegex);
    });

    it('should have text color in hex format', () => {
      expect(Colors.text).toMatch(hexColorRegex);
    });

    it('should have textMuted color in hex format', () => {
      expect(Colors.textMuted).toMatch(hexColorRegex);
    });

    it('should have accent color in hex format', () => {
      expect(Colors.accent).toMatch(hexColorRegex);
    });

    it('should have success color in hex format', () => {
      expect(Colors.success).toMatch(hexColorRegex);
    });

    it('should have warning color in hex format', () => {
      expect(Colors.warning).toMatch(hexColorRegex);
    });
  });

  describe('Exact color values', () => {
    it('should have background color as #0F0E17', () => {
      expect(Colors.background).toBe('#0F0E17');
    });

    it('should have surface color as #1A1926', () => {
      expect(Colors.surface).toBe('#1A1926');
    });

    it('should have optionA color as #FF6B6B', () => {
      expect(Colors.optionA).toBe('#FF6B6B');
    });

    it('should have optionB color as #4ECDC4', () => {
      expect(Colors.optionB).toBe('#4ECDC4');
    });

    it('should have text color as #FFFFFE', () => {
      expect(Colors.text).toBe('#FFFFFE');
    });

    it('should have textMuted color as #A7A9BE', () => {
      expect(Colors.textMuted).toBe('#A7A9BE');
    });

    it('should have accent color as #E53170', () => {
      expect(Colors.accent).toBe('#E53170');
    });

    it('should have success color as #4ADE80', () => {
      expect(Colors.success).toBe('#4ADE80');
    });

    it('should have warning color as #FBBF24', () => {
      expect(Colors.warning).toBe('#FBBF24');
    });
  });

  describe('Color immutability', () => {
    it('should preserve original values (as const provides compile-time safety)', () => {
      // as const is a TypeScript-only assertion — no runtime freeze
      // Verify the original values are intact
      expect(Colors.background).toBe('#0F0E17');
      expect(Colors.text).toBe('#FFFFFE');
    });
  });

  describe('Color contrast pairs', () => {
    it('should have distinct option colors', () => {
      expect(Colors.optionA).not.toBe(Colors.optionB);
    });

    it('should have distinct text colors', () => {
      expect(Colors.text).not.toBe(Colors.textMuted);
    });

    it('should have distinct background colors', () => {
      expect(Colors.background).not.toBe(Colors.surface);
    });
  });
});
