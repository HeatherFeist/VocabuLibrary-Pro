/*
  # Add Daily Tips Table

  1. New Tables
    - daily_tips
      - id (uuid, primary key)
      - tip_text (text)
      - tip_type (text) - 'learning', 'motivation', 'fun_fact', 'challenge_specific'
      - category (text) - optional category for organization
      - is_active (boolean) - to enable/disable tips
      - created_at (timestamp)

  2. Security
    - Enable RLS on daily_tips table
    - Add policy for authenticated users to read all tips

  3. Sample Data
    - Insert variety of learning tips, motivational quotes, and fun facts
*/

-- Create daily_tips table
CREATE TABLE IF NOT EXISTS daily_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tip_text text NOT NULL,
  tip_type text DEFAULT 'learning' CHECK (tip_type IN ('learning', 'motivation', 'fun_fact', 'challenge_specific')),
  category text DEFAULT '',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE daily_tips ENABLE ROW LEVEL SECURITY;

-- Create policy for reading tips
CREATE POLICY "Authenticated users can read daily tips"
  ON daily_tips
  FOR SELECT
  TO authenticated
  USING (is_active = true);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_daily_tips_type ON daily_tips(tip_type);
CREATE INDEX IF NOT EXISTS idx_daily_tips_active ON daily_tips(is_active);

-- Insert sample daily tips
INSERT INTO daily_tips (tip_text, tip_type, category) VALUES
-- Learning Tips
('Your brain cannot remember anything you read after coming to a word you don''t understand. Use the dictionary so you don''t get stuck!', 'learning', 'comprehension'),
('Reading just 20 minutes a day exposes you to about 1.8 million words per year. That''s vocabulary growth in action!', 'learning', 'reading'),
('The best way to remember a new word is to use it in conversation within 24 hours of learning it.', 'learning', 'retention'),
('Context is king! Try to learn new words in sentences rather than in isolation for better retention.', 'learning', 'context'),
('Write new words by hand - the physical act of writing helps cement them in your memory better than typing.', 'learning', 'memory'),
('Create mental images or stories with new words. Your brain remembers visual and narrative information much better.', 'learning', 'visualization'),
('Don''t just memorize definitions - learn the word''s etymology. Understanding word roots helps you decode similar words.', 'learning', 'etymology'),
('Practice active recall: cover the definition and try to remember it, rather than just re-reading passively.', 'learning', 'study_technique'),

-- Motivational Quotes
('Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown. - Robin Sharma', 'motivation', 'growth'),
('The limits of my language mean the limits of my world. - Ludwig Wittgenstein', 'motivation', 'language'),
('A different language is a different vision of life. - Federico Fellini', 'motivation', 'perspective'),
('Language is the road map of a culture. It tells you where its people come from and where they are going. - Rita Mae Brown', 'motivation', 'culture'),
('To have another language is to possess a second soul. - Charlemagne', 'motivation', 'multilingual'),
('Words are, of course, the most powerful drug used by mankind. - Rudyard Kipling', 'motivation', 'power_of_words'),
('The more that you read, the more things you will know. The more that you learn, the more places you''ll go. - Dr. Seuss', 'motivation', 'learning'),
('Learning never exhausts the mind. - Leonardo da Vinci', 'motivation', 'continuous_learning'),

-- Fun Facts
('The average person knows between 20,000 to 35,000 words, but uses only about 2,000 in everyday conversation.', 'fun_fact', 'vocabulary_size'),
('Shakespeare invented over 1,700 words that we still use today, including "eyeball," "fashionable," and "lonely."', 'fun_fact', 'shakespeare'),
('The word "set" has the most different meanings in English - over 430 distinct definitions!', 'fun_fact', 'word_meanings'),
('Your vocabulary peaks around age 40-50, then gradually declines unless you actively work to maintain it.', 'fun_fact', 'age_vocabulary'),
('Reading fiction increases empathy and emotional intelligence more than reading non-fiction.', 'fun_fact', 'reading_benefits'),
('The human brain can process visual information 60,000 times faster than text, which is why word visualization techniques work so well.', 'fun_fact', 'brain_processing'),
('Bilingual people have been shown to develop dementia an average of 4.5 years later than monolingual people.', 'fun_fact', 'bilingual_benefits'),
('The word "bookworm" originally referred to actual insects that would eat through books, not avid readers!', 'fun_fact', 'word_origins'),

-- Challenge-Specific Tips
('When using a new word in conversation, don''t worry about sounding pretentious. Most people appreciate learning something new!', 'challenge_specific', 'conversation'),
('If you''re nervous about using a big word, try it first with family or close friends who will appreciate your vocabulary growth.', 'challenge_specific', 'practice'),
('Writing challenges help solidify new words in your memory. Don''t skip the writing exercises!', 'challenge_specific', 'writing'),
('When describing something with your new vocabulary word, use gestures and expressions to make it more memorable.', 'challenge_specific', 'expression'),
('Keep a vocabulary journal on your phone. Jot down when and how you used each new word successfully.', 'challenge_specific', 'tracking'),
('If you forget a new word mid-conversation, don''t panic! Describe what you mean and the word will come back to you.', 'challenge_specific', 'confidence'),
('Challenge yourself to use new words in different contexts - formal, casual, written, and spoken.', 'challenge_specific', 'variety'),
('The best conversations happen when you''re genuinely curious about words. Ask others about words they use that you don''t know!', 'challenge_specific', 'curiosity');