import { supabase } from '../lib/supabase';

// Sample vocabulary words with real-world challenges
const sampleWords = [
  {
    word: 'Serendipity',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way',
    challenges: [
      'Share a story about a serendipitous moment in your life with a friend or family member',
      'Write down three unexpected positive things that happened to you this week and reflect on how they were serendipitous'
    ]
  },
  {
    word: 'Ephemeral',
    definition: 'Lasting for a very short time; transitory',
    challenges: [
      'Take a photo of something ephemeral in nature (like morning dew, a sunset, or falling leaves) and post it with the word "ephemeral"',
      'Write a short poem or paragraph describing an ephemeral moment you experienced recently'
    ]
  },
  {
    word: 'Ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    challenges: [
      'Identify three ubiquitous items in your daily environment and explain why they are so common',
      'Use the word "ubiquitous" in a conversation today when describing something that is everywhere'
    ]
  },
  {
    word: 'Mellifluous',
    definition: 'Having a smooth, flowing, sweet sound',
    challenges: [
      'Find a piece of music or a voice that you consider mellifluous and share it with someone, explaining why',
      'Practice reading a poem aloud in a mellifluous manner and record yourself'
    ]
  },
  {
    word: 'Perspicacious',
    definition: 'Having keen insight; mentally sharp and wise',
    challenges: [
      'Ask someone you consider perspicacious for advice on a current challenge you are facing',
      'Write about a time when you or someone else showed perspicacious judgment in a difficult situation'
    ]
  },
  {
    word: 'Quintessential',
    definition: 'Representing the most perfect example of a quality or class',
    challenges: [
      'Describe what you consider the quintessential example of your favorite hobby or interest to someone',
      'Find and share a photo or example of what you think is quintessential about your hometown or culture'
    ]
  },
  {
    word: 'Surreptitious',
    definition: 'Kept secret, especially because it would not be approved of',
    challenges: [
      'Plan a surreptitious act of kindness for someone (like leaving an anonymous positive note)',
      'Write about a time when you had to be surreptitious about something (keeping it appropriate and legal!)'
    ]
  },
  {
    word: 'Vicarious',
    definition: 'Experienced in the imagination through the feelings or actions of another person',
    challenges: [
      'Read about someone\'s adventure or achievement and write about the vicarious excitement you felt',
      'Watch a documentary or read a biography and discuss the vicarious experience with someone'
    ]
  },
  {
    word: 'Magnanimous',
    definition: 'Very generous or forgiving, especially toward a rival or less powerful person',
    challenges: [
      'Perform a magnanimous act by forgiving someone or being generous to someone who may not expect it',
      'Write about a time when someone was magnanimous toward you and how it made you feel'
    ]
  },
  {
    word: 'Ineffable',
    definition: 'Too great or extreme to be expressed or described in words',
    challenges: [
      'Try to describe an ineffable experience you\'ve had (like a beautiful sunset or moment of joy) and note the challenge',
      'Find a piece of art, music, or poetry that captures something ineffable and share why it moves you'
    ]
  },
  {
    word: 'Sagacious',
    definition: 'Having or showing keen mental discernment and good judgment; wise',
    challenges: [
      'Seek out sagacious advice from an elder or mentor about an important life decision',
      'Practice sagacious thinking by carefully analyzing a current news event from multiple perspectives'
    ]
  },
  {
    word: 'Ebullient',
    definition: 'Cheerful and full of energy; exuberant',
    challenges: [
      'Spend time with someone who is naturally ebullient and notice how their energy affects your mood',
      'Practice being ebullient yourself by enthusiastically encouraging someone who needs support'
    ]
  },
  {
    word: 'Fastidious',
    definition: 'Very attentive to and concerned about accuracy and detail',
    challenges: [
      'Apply fastidious attention to detail in organizing one area of your living space',
      'Complete a task today with fastidious care, taking extra time to ensure everything is perfect'
    ]
  },
  {
    word: 'Gregarious',
    definition: 'Fond of the company of others; sociable',
    challenges: [
      'If you\'re naturally gregarious, help someone shy feel included in a group conversation',
      'If you\'re not typically gregarious, challenge yourself to initiate a conversation with someone new'
    ]
  },
  {
    word: 'Loquacious',
    definition: 'Tending to talk a great deal; talkative',
    challenges: [
      'If you\'re loquacious, practice active listening by asking questions and letting others speak more',
      'If you\'re quiet, try being more loquacious by sharing a detailed story about something you\'re passionate about'
    ]
  }
];

// Additional dictionary entries with more detailed information
const dictionaryEntries = [
  {
    word: 'Serendipity',
    definition: 'The occurrence and development of events by chance in a happy or beneficial way',
    part_of_speech: 'noun',
    pronunciation: '/ˌserənˈdipədē/',
    example_sentence: 'It was pure serendipity that led her to discover the hidden café that became her favorite writing spot.',
    difficulty_level: 3
  },
  {
    word: 'Ephemeral',
    definition: 'Lasting for a very short time; transitory',
    part_of_speech: 'adjective',
    pronunciation: '/əˈfem(ə)rəl/',
    example_sentence: 'The cherry blossoms were ephemeral, lasting only a few weeks before falling to the ground.',
    difficulty_level: 4
  },
  {
    word: 'Ubiquitous',
    definition: 'Present, appearing, or found everywhere',
    part_of_speech: 'adjective',
    pronunciation: '/yo͞oˈbikwədəs/',
    example_sentence: 'Smartphones have become ubiquitous in modern society, found in nearly every pocket.',
    difficulty_level: 4
  },
  {
    word: 'Mellifluous',
    definition: 'Having a smooth, flowing, sweet sound',
    part_of_speech: 'adjective',
    pronunciation: '/məˈliflo͞oəs/',
    example_sentence: 'The singer\'s mellifluous voice captivated the entire audience.',
    difficulty_level: 5
  },
  {
    word: 'Perspicacious',
    definition: 'Having keen insight; mentally sharp and wise',
    part_of_speech: 'adjective',
    pronunciation: '/ˌpərspəˈkāSHəs/',
    example_sentence: 'Her perspicacious analysis of the market trends helped the company avoid a major loss.',
    difficulty_level: 5
  },
  {
    word: 'Benevolent',
    definition: 'Well meaning and kindly; charitable',
    part_of_speech: 'adjective',
    pronunciation: '/bəˈnevələnt/',
    example_sentence: 'The benevolent donor wished to remain anonymous despite their generous contribution.',
    difficulty_level: 2
  },
  {
    word: 'Eloquent',
    definition: 'Fluent or persuasive in speaking or writing',
    part_of_speech: 'adjective',
    pronunciation: '/ˈeləkwənt/',
    example_sentence: 'His eloquent speech moved the audience to tears and inspired them to action.',
    difficulty_level: 3
  },
  {
    word: 'Resilient',
    definition: 'Able to withstand or recover quickly from difficult conditions',
    part_of_speech: 'adjective',
    pronunciation: '/rəˈzilyənt/',
    example_sentence: 'The resilient community rebuilt stronger after the natural disaster.',
    difficulty_level: 2
  },
  {
    word: 'Meticulous',
    definition: 'Showing great attention to detail; very careful and precise',
    part_of_speech: 'adjective',
    pronunciation: '/məˈtikyələs/',
    example_sentence: 'The scientist\'s meticulous research methodology ensured accurate and reliable results.',
    difficulty_level: 3
  },
  {
    word: 'Pragmatic',
    definition: 'Dealing with things sensibly and realistically in a practical way',
    part_of_speech: 'adjective',
    pronunciation: '/praɡˈmadik/',
    example_sentence: 'She took a pragmatic approach to the problem, focusing on solutions rather than ideals.',
    difficulty_level: 3
  },
  {
    word: 'Tenacious',
    definition: 'Tending to keep a firm hold of something; persistent',
    part_of_speech: 'adjective',
    pronunciation: '/təˈnāSHəs/',
    example_sentence: 'His tenacious pursuit of justice never wavered, even in the face of opposition.',
    difficulty_level: 3
  },
  {
    word: 'Vivacious',
    definition: 'Attractively lively and animated',
    part_of_speech: 'adjective',
    pronunciation: '/vəˈvāSHəs/',
    example_sentence: 'Her vivacious personality made her the life of every party she attended.',
    difficulty_level: 3
  },
  {
    word: 'Astute',
    definition: 'Having or showing an ability to accurately assess situations and turn them to advantage',
    part_of_speech: 'adjective',
    pronunciation: '/əˈst(y)o͞ot/',
    example_sentence: 'The astute investor recognized the potential of the startup before anyone else.',
    difficulty_level: 4
  },
  {
    word: 'Candid',
    definition: 'Truthful and straightforward; frank',
    part_of_speech: 'adjective',
    pronunciation: '/ˈkandəd/',
    example_sentence: 'I appreciate your candid feedback about my presentation.',
    difficulty_level: 2
  },
  {
    word: 'Diligent',
    definition: 'Having or showing care and conscientiousness in work or duties',
    part_of_speech: 'adjective',
    pronunciation: '/ˈdiləjənt/',
    example_sentence: 'The diligent student spent hours perfecting her research paper.',
    difficulty_level: 2
  },
  {
    word: 'Empathetic',
    definition: 'Showing an ability to understand and share the feelings of another',
    part_of_speech: 'adjective',
    pronunciation: '/ˌempəˈTHedik/',
    example_sentence: 'The empathetic counselor helped her clients feel understood and supported.',
    difficulty_level: 2
  },
  {
    word: 'Innovative',
    definition: 'Featuring new methods; advanced and original',
    part_of_speech: 'adjective',
    pronunciation: '/ˈinəˌvādiv/',
    example_sentence: 'The company\'s innovative approach to renewable energy impressed investors.',
    difficulty_level: 2
  },
  {
    word: 'Judicious',
    definition: 'Having, showing, or done with good judgment or sense',
    part_of_speech: 'adjective',
    pronunciation: '/jo͞oˈdiSHəs/',
    example_sentence: 'Her judicious use of resources helped the project stay within budget.',
    difficulty_level: 4
  },
  {
    word: 'Luminous',
    definition: 'Giving off light; bright or shining',
    part_of_speech: 'adjective',
    pronunciation: '/ˈlo͞omənəs/',
    example_sentence: 'The luminous moon cast a silver glow across the peaceful lake.',
    difficulty_level: 3
  },
  {
    word: 'Nostalgic',
    definition: 'Feeling or inspiring a sentimental longing for the past',
    part_of_speech: 'adjective',
    pronunciation: '/nəˈstaljik/',
    example_sentence: 'The old photograph made her feel nostalgic for her childhood summers.',
    difficulty_level: 2
  }
];

// Additional daily tips
const additionalTips = [
  {
    tip_text: 'The average person learns 1,000-3,000 new words per year through reading. Make reading a daily habit!',
    tip_type: 'fun_fact',
    category: 'reading'
  },
  {
    tip_text: 'When you encounter a new word, try to use it in three different sentences within 24 hours to help it stick.',
    tip_type: 'learning',
    category: 'retention'
  },
  {
    tip_text: '"The limits of my language mean the limits of my world." - Ludwig Wittgenstein',
    tip_type: 'motivation',
    category: 'philosophy'
  },
  {
    tip_text: 'Keep a vocabulary journal and write down new words with their definitions and a personal example.',
    tip_type: 'challenge_specific',
    category: 'practice'
  },
  {
    tip_text: 'English has borrowed words from over 350 languages, making it one of the most diverse languages in the world.',
    tip_type: 'fun_fact',
    category: 'language_history'
  },
  {
    tip_text: 'Practice the "word of the day" by setting a goal to use it in conversation at least once.',
    tip_type: 'challenge_specific',
    category: 'daily_practice'
  },
  {
    tip_text: '"Words have no single fixed meaning. Like wayward electrons, they can spin away from their initial orbit and enter a wider magnetic field." - David Lehman',
    tip_type: 'motivation',
    category: 'language_beauty'
  },
  {
    tip_text: 'Reading diverse genres exposes you to different vocabulary sets - try mixing fiction, non-fiction, and poetry.',
    tip_type: 'learning',
    category: 'reading_strategy'
  },
  {
    tip_text: 'The word "set" has the most different meanings in English - over 430 distinct definitions!',
    tip_type: 'fun_fact',
    category: 'word_trivia'
  },
  {
    tip_text: 'Create mental images or stories to remember new words - your brain loves visual and narrative connections.',
    tip_type: 'learning',
    category: 'memory_techniques'
  }
];

export async function populateDatabase() {
  try {
    console.log('Starting database population...');

    // Insert daily words
    console.log('Inserting daily words...');
    const { error: wordsError } = await supabase
      .from('daily_words')
      .insert(sampleWords);

    if (wordsError) {
      console.error('Error inserting daily words:', wordsError);
    } else {
      console.log(`Successfully inserted ${sampleWords.length} daily words`);
    }

    // Insert dictionary entries
    console.log('Inserting dictionary entries...');
    const { error: dictError } = await supabase
      .from('dictionary')
      .insert(dictionaryEntries);

    if (dictError) {
      console.error('Error inserting dictionary entries:', dictError);
    } else {
      console.log(`Successfully inserted ${dictionaryEntries.length} dictionary entries`);
    }

    // Insert additional tips
    console.log('Inserting additional tips...');
    const { error: tipsError } = await supabase
      .from('daily_tips')
      .insert(additionalTips);

    if (tipsError) {
      console.error('Error inserting tips:', tipsError);
    } else {
      console.log(`Successfully inserted ${additionalTips.length} additional tips`);
    }

    console.log('Database population completed successfully!');
    return { success: true };

  } catch (error) {
    console.error('Error populating database:', error);
    return { success: false, error };
  }
}