
import React from 'react';
import { Emotion } from '../data/emotions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Music, TrendingUp, ArrowLeft } from 'lucide-react';

interface PathChoiceProps {
  selectedEmotion: Emotion;
  onPathChoice: (choice: 'adapt' | 'transition') => void;
  onBack: () => void;
}

export default function PathChoice({ selectedEmotion, onPathChoice, onBack }: PathChoiceProps) {
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
          <div className={`w-16 h-16 rounded-full ${selectedEmotion.color} flex items-center justify-center text-3xl`}>
            {selectedEmotion.icon}
          </div>
          <div>
            <h2 className="text-xl font-semibold">Vous ressentez : {selectedEmotion.name}</h2>
            <p className="text-muted-foreground">{selectedEmotion.description}</p>
          </div>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">Que souhaitez-vous faire ?</h1>
        <p className="text-muted-foreground mb-8">
          Choisissez votre approche pour cette session
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => onPathChoice('adapt')}>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-therapy-soft-blue rounded-full flex items-center justify-center mx-auto mb-4">
              <Music className="w-8 h-8 text-therapy-dark-purple" />
            </div>
            <CardTitle className="text-lg">M'adapter à mon état actuel</CardTitle>
            <CardDescription>
              Écoutez de la musique qui correspond à votre émotion actuelle
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-therapy-vivid-purple rounded-full"></div>
                <span>Musique adaptée à votre état : {selectedEmotion.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-therapy-vivid-purple rounded-full"></div>
                <span>Session de 15 à 45 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-therapy-vivid-purple rounded-full"></div>
                <span>Accompagnement sans changement d'état</span>
              </div>
            </div>
            <Button className="w-full bg-therapy-vivid-purple hover:bg-therapy-dark-purple">
              Commencer l'écoute
            </Button>
          </CardContent>
        </Card>
        
        <Card className="hover:shadow-lg transition-all cursor-pointer" onClick={() => onPathChoice('transition')}>
          <CardHeader className="text-center pb-4">
            <div className="w-16 h-16 bg-therapy-soft-green rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-therapy-dark-purple" />
            </div>
            <CardTitle className="text-lg">Transitionner vers un autre état</CardTitle>
            <CardDescription>
              Parcours musical progressif pour changer d'état émotionnel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-therapy-vivid-purple rounded-full"></div>
                <span>Transition guidée depuis : {selectedEmotion.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-therapy-vivid-purple rounded-full"></div>
                <span>Session de 15 à 45 minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-therapy-vivid-purple rounded-full"></div>
                <span>Progression émotionnelle étape par étape</span>
              </div>
            </div>
            <Button className="w-full bg-therapy-vivid-purple hover:bg-therapy-dark-purple">
              Choisir ma destination
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
