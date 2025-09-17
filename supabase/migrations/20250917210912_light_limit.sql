/*
  # Add Dictionary Table

  1. New Tables
    - dictionary
      - id (uuid, primary key)
      - word (text, unique)
      - definition (text)
      - part_of_speech (text)
      - pronunciation (text, optional)
      - example_sentence (text, optional)
      - difficulty_level (integer, 1-5)
      - created_at (timestamp)

  2. Security
    - Enable RLS on dictionary table
    - Add policy for authenticated users to read all dictionary entries

  3. Indexes
    - Add index on word for fast searching
    - Add index on difficulty_level for filtering
*/

-- Create dictionary table
CREATE TABLE IF NOT EXISTS dictionary (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  word text UNIQUE NOT NULL,
  definition text NOT NULL,
  part_of_speech text DEFAULT '',
  pronunciation text DEFAULT '',
  example_sentence text DEFAULT '',
  difficulty_level integer DEFAULT 3 CHECK (difficulty_level >= 1 AND difficulty_level <= 5),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE dictionary ENABLE ROW LEVEL SECURITY;

-- Create policy for reading dictionary entries
CREATE POLICY "Authenticated users can read dictionary"
  ON dictionary
  FOR SELECT
  TO authenticated
  USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_dictionary_word ON dictionary(word);
CREATE INDEX IF NOT EXISTS idx_dictionary_difficulty ON dictionary(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_dictionary_part_of_speech ON dictionary(part_of_speech);

-- Insert sample dictionary entries
INSERT INTO dictionary (word, definition, part_of_speech, pronunciation, example_sentence, difficulty_level) VALUES
('serendipity', 'The occurrence and development of events by chance in a happy or beneficial way', 'noun', '/ˌserənˈdipədē/', 'Finding that old book was pure serendipity - it contained exactly the information I needed.', 4),
('ephemeral', 'Lasting for a very short time', 'adjective', '/əˈfem(ə)rəl/', 'The beauty of cherry blossoms is ephemeral, lasting only a few weeks each spring.', 4),
('ubiquitous', 'Present, appearing, or found everywhere', 'adjective', '/yo͞oˈbikwədəs/', 'Smartphones have become ubiquitous in modern society.', 3),
('perspicacious', 'Having a ready insight into and understanding of things', 'adjective', '/ˌpərspəˈkāSHəs/', 'Her perspicacious analysis of the market trends impressed the entire board.', 5),
('mellifluous', 'Sweet or musical; pleasant to hear', 'adjective', '/məˈliflo͞oəs/', 'The singer''s mellifluous voice captivated the entire audience.', 4),
('sanguine', 'Optimistic or positive, especially in an apparently bad or difficult situation', 'adjective', '/ˈsaNGɡwən/', 'Despite the setbacks, she remained sanguine about the project''s success.', 3),
('quixotic', 'Extremely idealistic; unrealistic and impractical', 'adjective', '/kwikˈsädik/', 'His quixotic plan to solve world hunger was admirable but unrealistic.', 4),
('laconic', 'Using few words; expressing much in few words', 'adjective', '/ləˈkänik/', 'His laconic response of "maybe" left everyone wondering what he really thought.', 3),
('magnanimous', 'Very generous or forgiving, especially toward a rival or someone less powerful', 'adjective', '/maɡˈnanəməs/', 'The champion was magnanimous in victory, praising his opponent''s skill.', 3),
('vicarious', 'Experienced in the imagination through the feelings or actions of another person', 'adjective', '/vīˈkerēəs/', 'She lived vicariously through her daughter''s adventures abroad.', 3),
('panacea', 'A solution or remedy for all difficulties or diseases', 'noun', '/ˌpanəˈsēə/', 'There is no panacea for the complex problems facing our education system.', 4),
('zeitgeist', 'The defining spirit or mood of a particular period of history', 'noun', '/ˈtsītˌɡīst/', 'The movie perfectly captured the zeitgeist of the 1960s counterculture movement.', 4),
('cogent', 'Clear, logical, and convincing', 'adjective', '/ˈkōjənt/', 'She presented a cogent argument for increasing the education budget.', 3),
('ineffable', 'Too great or extreme to be expressed or described in words', 'adjective', '/inˈefəb(ə)l/', 'The beauty of the sunset was ineffable, leaving us all speechless.', 5),
('sagacious', 'Having or showing keen mental discernment and good judgment', 'adjective', '/səˈɡāSHəs/', 'The sagacious old professor always gave the best advice to his students.', 4);

-- Update daily_words table to reference dictionary entries
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'daily_words' AND column_name = 'dictionary_id'
  ) THEN
    ALTER TABLE daily_words ADD COLUMN dictionary_id uuid REFERENCES dictionary(id);
  END IF;
END $$;

-- Insert sample daily words that reference dictionary entries
INSERT INTO daily_words (word, definition, challenges, dictionary_id) 
SELECT 
  d.word,
  d.definition,
  CASE d.word
    WHEN 'serendipity' THEN ARRAY[
      'Use "serendipity" in a conversation today when describing a fortunate coincidence',
      'Write a short paragraph about a serendipitous moment in your life'
    ]
    WHEN 'ephemeral' THEN ARRAY[
      'Describe something ephemeral you observed today (like morning dew or a sunset)',
      'Use "ephemeral" when discussing temporary trends or moments with someone'
    ]
    ELSE ARRAY[
      'Use this word in a sentence during a conversation today',
      'Write down three synonyms for this word and use them in sentences'
    ]
  END,
  d.id
FROM dictionary d
WHERE d.word IN ('serendipity', 'ephemeral')
ON CONFLICT DO NOTHING;