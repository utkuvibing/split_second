// Mock implementation of lib/supabase
// This mock supports chainable query patterns used throughout the app

const mockSingle = jest.fn().mockResolvedValue({ data: null, error: null });
const mockEq = jest.fn().mockReturnValue({
  eq: jest.fn().mockReturnValue({ single: mockSingle }),
  single: mockSingle
});
const mockSelect = jest.fn().mockReturnValue({
  eq: mockEq,
  single: mockSingle
});

export const supabase = {
  auth: {
    getSession: jest.fn().mockResolvedValue({
      data: { session: null },
      error: null
    }),
    signInAnonymously: jest.fn().mockResolvedValue({
      data: { session: null },
      error: null
    }),
  },
  from: jest.fn().mockReturnValue({
    select: mockSelect,
  }),
  rpc: jest.fn().mockResolvedValue({ data: null, error: null }),
};
