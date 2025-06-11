
export interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number; // in seconds
  albumArt: string;
  emotionalAttributes: {
    tempo: number; // 0-100, low to high
    energy: number; // 0-100, low to high
    valence: number; // 0-100, negative to positive
    intensity: number; // 0-100, low to high
  };
  audioFeatures: {
    bpm: number;
    key: string;
    mode: 'major' | 'minor';
    instruments: string[];
  };
}

export const sampleTracks: Track[] = [
  {
    id: '1',
    title: 'Waves of Serenity',
    artist: 'Celestial Dreams',
    duration: 237,
    albumArt: 'https://images.unsplash.com/photo-1498036882173-b41c28a8ba34?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=simon-wilkes-S297j2CN6xk-unsplash.jpg',
    emotionalAttributes: {
      tempo: 35,
      energy: 20,
      valence: 75,
      intensity: 25
    },
    audioFeatures: {
      bpm: 68,
      key: 'C',
      mode: 'major',
      instruments: ['piano', 'strings', 'ambient sounds']
    }
  },
  {
    id: '2',
    title: 'Rising Spirit',
    artist: 'Elevation',
    duration: 195,
    albumArt: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=tim-stief-YFFGkE3y4F8-unsplash.jpg',
    emotionalAttributes: {
      tempo: 65,
      energy: 70,
      valence: 80,
      intensity: 60
    },
    audioFeatures: {
      bpm: 110,
      key: 'G',
      mode: 'major',
      instruments: ['guitar', 'drums', 'synth']
    }
  },
  {
    id: '3',
    title: 'Inner Reflection',
    artist: 'Mindful Journey',
    duration: 285,
    albumArt: 'https://images.unsplash.com/photo-1519834255828-9b0c9f0784de?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=nathan-dumlao-KpDAe2L2qug-unsplash.jpg',
    emotionalAttributes: {
      tempo: 45,
      energy: 30,
      valence: 60,
      intensity: 40
    },
    audioFeatures: {
      bpm: 82,
      key: 'D',
      mode: 'minor',
      instruments: ['piano', 'cello', 'ambient sounds']
    }
  },
  {
    id: '4',
    title: 'Electric Revival',
    artist: 'Pulse',
    duration: 210,
    albumArt: 'https://images.unsplash.com/photo-1559650656-5d1994173f89?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=austin-neill-hgO1wFPXl3I-unsplash.jpg',
    emotionalAttributes: {
      tempo: 85,
      energy: 90,
      valence: 75,
      intensity: 85
    },
    audioFeatures: {
      bpm: 128,
      key: 'A',
      mode: 'major',
      instruments: ['synth', 'drums', 'bass']
    }
  },
  {
    id: '5',
    title: 'Floating Memories',
    artist: 'Echo Chamber',
    duration: 265,
    albumArt: 'https://images.unsplash.com/photo-1513829596324-4bb2800c5efb?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&dl=aditya-chinchure-ZhQCZjr9fHo-unsplash.jpg',
    emotionalAttributes: {
      tempo: 50,
      energy: 40,
      valence: 55,
      intensity: 45
    },
    audioFeatures: {
      bpm: 94,
      key: 'F',
      mode: 'minor',
      instruments: ['piano', 'violin', 'ambient sounds']
    }
  }
];

export const ritualTemplates = [
  {
    id: 'morning',
    name: 'Rituel du matin',
    description: 'Commencez votre journée avec énergie et positivité',
    duration: 15, // minutes
    recommendedTime: '08:00',
    targetEmotion: 'joy',
    icon: '☀️'
  },
  {
    id: 'focus',
    name: 'Concentration profonde',
    description: 'Plongez dans un état de concentration optimale',
    duration: 30, // minutes
    recommendedTime: '10:00',
    targetEmotion: 'calm',
    icon: '🧠'
  },
  {
    id: 'afternoon-refresh',
    name: 'Rafraîchissement d\'après-midi',
    description: 'Retrouvez de l\'énergie pendant le creux de l\'après-midi',
    duration: 20, // minutes
    recommendedTime: '15:00',
    targetEmotion: 'hope',
    icon: '🌱'
  },
  {
    id: 'evening-wind-down',
    name: 'Détente du soir',
    description: 'Préparez-vous à une nuit reposante',
    duration: 25, // minutes
    recommendedTime: '21:00',
    targetEmotion: 'calm',
    icon: '🌙'
  }
];
