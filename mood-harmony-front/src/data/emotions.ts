
export interface Emotion {
  id: string;
  name: string;
  description: string;
  color: string;
  intensity: number;
  icon: string;
  group: 'positive' | 'negative' | 'neutral';
}

export const emotions: Emotion[] = [
  {
    id: 'joy',
    name: 'Joie',
    description: 'Sentiment de bonheur et de contentement',
    color: 'bg-therapy-soft-yellow',
    intensity: 0.8,
    icon: '😊',
    group: 'positive'
  },
  {
    id: 'calm',
    name: 'Calme',
    description: 'Sentiment de tranquillité et de paix intérieure',
    color: 'bg-therapy-soft-blue',
    intensity: 0.3,
    icon: '😌',
    group: 'positive'
  },
  {
    id: 'gratitude',
    name: 'Gratitude',
    description: 'Sentiment de reconnaissance et d\'appréciation',
    color: 'bg-therapy-soft-green',
    intensity: 0.6,
    icon: '🙏',
    group: 'positive'
  },
  {
    id: 'hope',
    name: 'Espoir',
    description: 'Sentiment d\'optimisme pour l\'avenir',
    color: 'bg-therapy-soft-purple',
    intensity: 0.7,
    icon: '✨',
    group: 'positive'
  },
  {
    id: 'anxiety',
    name: 'Anxiété',
    description: 'Sentiment d\'inquiétude et de nervosité',
    color: 'bg-therapy-soft-orange',
    intensity: 0.7,
    icon: '😰',
    group: 'negative'
  },
  {
    id: 'sadness',
    name: 'Tristesse',
    description: 'Sentiment de mélancolie et de chagrin',
    color: 'bg-therapy-soft-blue',
    intensity: 0.6,
    icon: '😢',
    group: 'negative'
  },
  {
    id: 'anger',
    name: 'Colère',
    description: 'Sentiment d\'irritation et de frustration',
    color: 'bg-therapy-soft-pink',
    intensity: 0.8,
    icon: '😠',
    group: 'negative'
  },
  {
    id: 'lethargy',
    name: 'Léthargie',
    description: 'Sentiment de fatigue et de manque d\'énergie',
    color: 'bg-muted',
    intensity: 0.4,
    icon: '😴',
    group: 'negative'
  }
];

export const emotionalTransitions = [
  {
    id: 'anxiety-to-calm',
    name: 'De l\'anxiété au calme',
    description: 'Un parcours musical pour réduire l\'anxiété et trouver le calme',
    fromEmotion: 'anxiety',
    toEmotion: 'calm',
    duration: 30, // minutes
    phases: [
      { name: 'Reconnaissance', duration: 5 },
      { name: 'Stabilisation', duration: 10 },
      { name: 'Transition', duration: 10 },
      { name: 'Intégration', duration: 5 }
    ]
  },
  {
    id: 'lethargy-to-joy',
    name: 'De la léthargie à la joie',
    description: 'Un parcours musical pour retrouver l\'énergie et la joie',
    fromEmotion: 'lethargy',
    toEmotion: 'joy',
    duration: 25, // minutes
    phases: [
      { name: 'Éveil', duration: 5 },
      { name: 'Stimulation', duration: 8 },
      { name: 'Motivation', duration: 7 },
      { name: 'Célébration', duration: 5 }
    ]
  },
  {
    id: 'sadness-to-hope',
    name: 'De la tristesse à l\'espoir',
    description: 'Un parcours musical pour transformer la tristesse en espoir',
    fromEmotion: 'sadness',
    toEmotion: 'hope',
    duration: 35, // minutes
    phases: [
      { name: 'Acceptation', duration: 8 },
      { name: 'Guérison', duration: 10 },
      { name: 'Ouverture', duration: 10 },
      { name: 'Perspective', duration: 7 }
    ]
  },
  {
    id: 'anger-to-gratitude',
    name: 'De la colère à la gratitude',
    description: 'Un parcours musical pour apaiser la colère et cultiver la gratitude',
    fromEmotion: 'anger',
    toEmotion: 'gratitude',
    duration: 40, // minutes
    phases: [
      { name: 'Expression', duration: 10 },
      { name: 'Relâchement', duration: 10 },
      { name: 'Apaisement', duration: 10 },
      { name: 'Reconnaissance', duration: 10 }
    ]
  }
];
