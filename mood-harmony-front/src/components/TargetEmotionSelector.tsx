
import React from 'react';
import { emotions, Emotion } from '../data/emotions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

interface TargetEmotionSelectorProps {
  fromEmotion: Emotion;
  onTargetSelect: (emotion: Emotion) => void;
  onBack: () => void;
}

export default function TargetEmotionSelector({ fromEmotion, onTargetSelect, onBack }: TargetEmotionSelectorProps) {
  // Filter emotions that make sense for transition
  const getRecommendedTransitions = (fromEmotion: Emotion): Emotion[] => {
    // Logic to determine which emotions are good transition targets
    if (fromEmotion.group === 'negative') {
      // From negative emotions, suggest positive or neutral ones
      return emotions.filter(e => 
        e.id !== fromEmotion.id && 
        (e.group === 'positive' || (e.group === 'neutral' && e.intensity < fromEmotion.intensity))
      );
    } else if (fromEmotion.group === 'positive' && fromEmotion.intensity > 0.7) {
      // From high-intensity positive, suggest calmer states
      return emotions.filter(e => 
        e.id !== fromEmotion.id && 
        e.intensity < fromEmotion.intensity
      );
    } else {
      // From calm/neutral states, suggest various options
      return emotions.filter(e => e.id !== fromEmotion.id);
    }
  };

  const recommendedEmotions = getRecommendedTransitions(fromEmotion);

  const getTransitionDuration = (from: Emotion, to: Emotion): number => {
    // Estimate duration based on emotional distance
    const intensityDiff = Math.abs(from.intensity - to.intensity);
    const groupDiff = from.group !== to.group ? 1 : 0;
    
    const baseDuration = 20;
    const intensityBonus = intensityDiff * 15;
    const groupBonus = groupDiff * 10;
    
    return Math.min(45, baseDuration + intensityBonus + groupBonus);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour
        </Button>
        
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className={`w-12 h-12 rounded-full ${fromEmotion.color} flex items-center justify-center text-2xl`}>
            {fromEmotion.icon}
          </div>
          <ArrowRight className="w-6 h-6 text-muted-foreground" />
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center text-2xl">
            ?
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Vers quel état souhaitez-vous aller ?</h1>
        <p className="text-muted-foreground mb-8">
          Sélectionnez l'émotion que vous aimeriez ressentir
        </p>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommendedEmotions.map((emotion) => {
          const duration = getTransitionDuration(fromEmotion, emotion);
          
          return (
            <Card 
              key={emotion.id} 
              className="hover:shadow-lg transition-all cursor-pointer hover:scale-105"
              onClick={() => onTargetSelect(emotion)}
            >
              <CardHeader className="text-center pb-2">
                <div className={`w-16 h-16 rounded-full ${emotion.color} flex items-center justify-center text-3xl mx-auto`}>
                  {emotion.icon}
                </div>
                <CardTitle className="text-lg">{emotion.name}</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-center text-sm mb-3">
                  {emotion.description}
                </CardDescription>
                <div className="text-center">
                  <div className="bg-therapy-soft-purple py-1 px-2 rounded-full text-xs font-medium">
                    ~{duration} min
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <div className="text-center text-sm text-muted-foreground">
        <p>Les durées sont estimées selon l'intensité de la transition émotionnelle</p>
      </div>
    </div>
  );
}
