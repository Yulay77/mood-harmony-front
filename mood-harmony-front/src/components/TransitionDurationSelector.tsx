import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, ArrowLeft } from 'lucide-react';
import { Emotion } from '../data/emotions';
// Ce fichier sera intégré dans le projet existant

interface TransitionDurationSelectorProps {
  fromEmotion: Emotion;
  targetEmotion: Emotion;
  onDurationSelect: (duration: number) => void;
  onBack: () => void;
}

const TransitionDurationSelector: React.FC<TransitionDurationSelectorProps> = ({
  fromEmotion,
  targetEmotion,
  onDurationSelect,
  onBack
}) => {
  const durations = [
    { 
      minutes: 15, 
      description: "Transition rapide",
      detail: "Pour un changement léger et immédiat"
    },
    { 
      minutes: 30, 
      description: "Transition équilibrée",
      detail: "Pour un changement progressif et naturel"
    },
    { 
      minutes: 45, 
      description: "Transition profonde",
      detail: "Pour un changement en douceur et durable"
    },
    { 
      minutes: 60, 
      description: "Transition complète",
      detail: "Pour une transformation émotionnelle profonde"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour
        </Button>
        
        <div className="flex-1">
          <h2 className="text-xl font-semibold">Choisissez la durée de votre transition</h2>
          <p className="text-muted-foreground text-sm mt-1">
            De <span className="font-medium text-foreground">{fromEmotion.name}</span> vers{' '}
            <span className="font-medium text-foreground">{targetEmotion.name}</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {durations.map((duration) => (
          <Card 
            key={duration.minutes}
            className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1.02] border-2 hover:border-primary/50"
            onClick={() => onDurationSelect(duration.minutes)}
          >
            <CardHeader className="text-center pb-3">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <CardTitle className="text-2xl font-bold text-primary">
                  {duration.minutes} min
                </CardTitle>
              </div>
              <CardDescription className="font-medium text-base">
                {duration.description}
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center pt-0">
              <p className="text-sm text-muted-foreground">
                {duration.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center mt-8">
        <p className="text-sm text-muted-foreground">
          La durée détermine l'intensité et la progressivité de votre transition musicale
        </p>
      </div>
    </div>
  );
};

export default TransitionDurationSelector;