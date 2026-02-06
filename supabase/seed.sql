-- ============================================
-- Split Second - Seed Data (30 Questions)
-- Run this in Supabase Dashboard > SQL Editor
-- Update dates to start from today!
-- ============================================

-- Replace '2026-02-05' with today's date, then each subsequent day follows
INSERT INTO questions (question_text, option_a, option_b, scheduled_date, category) VALUES

-- Day 1-5
('Would you rather be able to fly or be invisible?', 'Fly', 'Be invisible', '2026-02-05', 'superpower'),
('Would you rather always be 10 minutes late or 20 minutes early?', 'Always late', 'Always early', '2026-02-06', 'lifestyle'),
('Would you rather have unlimited money or unlimited time?', 'Unlimited money', 'Unlimited time', '2026-02-07', 'philosophy'),
('Would you rather live in the mountains or by the beach?', 'Mountains', 'Beach', '2026-02-08', 'lifestyle'),
('Would you rather know the future or change the past?', 'Know the future', 'Change the past', '2026-02-09', 'philosophy'),

-- Day 6-10
('Would you rather have no phone for a year or no laptop for a year?', 'No phone', 'No laptop', '2026-02-10', 'technology'),
('Would you rather be famous or be the best friend of someone famous?', 'Be famous', 'Best friend of famous', '2026-02-11', 'lifestyle'),
('Would you rather eat only pizza or only sushi for the rest of your life?', 'Only pizza', 'Only sushi', '2026-02-12', 'food'),
('Would you rather read minds or predict the future?', 'Read minds', 'Predict future', '2026-02-13', 'superpower'),
('Would you rather always be too hot or always be too cold?', 'Too hot', 'Too cold', '2026-02-14', 'lifestyle'),

-- Day 11-15
('Would you rather have a pause button or a rewind button for your life?', 'Pause', 'Rewind', '2026-02-15', 'philosophy'),
('Would you rather speak every language or play every instrument?', 'Every language', 'Every instrument', '2026-02-16', 'skills'),
('Would you rather never use social media again or never watch a movie again?', 'No social media', 'No movies', '2026-02-17', 'technology'),
('Would you rather be stuck in a horror movie or an action movie?', 'Horror movie', 'Action movie', '2026-02-18', 'entertainment'),
('Would you rather have free Wi-Fi everywhere or free coffee everywhere?', 'Free Wi-Fi', 'Free coffee', '2026-02-19', 'lifestyle'),

-- Day 16-20
('Would you rather travel to the past or to the future?', 'The past', 'The future', '2026-02-20', 'philosophy'),
('Would you rather be the funniest person or the smartest person in the room?', 'Funniest', 'Smartest', '2026-02-21', 'personality'),
('Would you rather win the lottery or live twice as long?', 'Win lottery', 'Live twice as long', '2026-02-22', 'philosophy'),
('Would you rather have a personal chef or a personal trainer?', 'Personal chef', 'Personal trainer', '2026-02-23', 'lifestyle'),
('Would you rather explore deep space or the deep ocean?', 'Deep space', 'Deep ocean', '2026-02-24', 'adventure'),

-- Day 21-25
('Would you rather always have to sing instead of speak or dance everywhere you walk?', 'Sing everything', 'Dance everywhere', '2026-02-25', 'funny'),
('Would you rather have the ability to teleport or to stop time?', 'Teleport', 'Stop time', '2026-02-26', 'superpower'),
('Would you rather live in a world without music or without color?', 'No music', 'No color', '2026-02-27', 'philosophy'),
('Would you rather be a great writer or a great speaker?', 'Great writer', 'Great speaker', '2026-02-28', 'skills'),
('Would you rather have a photographic memory or an extremely high IQ?', 'Photographic memory', 'High IQ', '2026-03-01', 'skills'),

-- Day 26-30
('Would you rather live in a big city or a small town?', 'Big city', 'Small town', '2026-03-02', 'lifestyle'),
('Would you rather always know when someone is lying or always get away with lying?', 'Detect lies', 'Get away with lies', '2026-03-03', 'personality'),
('Would you rather be able to breathe underwater or walk through walls?', 'Breathe underwater', 'Walk through walls', '2026-03-04', 'superpower'),
('Would you rather have one real superpower or be the richest person on Earth?', 'One superpower', 'Richest person', '2026-03-05', 'philosophy'),
('Would you rather relive your favorite day or erase your worst day?', 'Relive best day', 'Erase worst day', '2026-03-06', 'philosophy');
