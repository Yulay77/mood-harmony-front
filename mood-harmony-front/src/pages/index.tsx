import React, { useState } from 'react';
import { sampleTracks } from '../data/musicData';
import { emotions, Emotion } from '../data/emotions';
import EmotionWheel from '../components/EmotionWheel';
import MusicPlayer from '../components/MusicPlayer';
import EmotionalJournal from '../components/EmotionalJournal';
import MusicRitual from '../components/MusicRitual';
import Navigation from '../components/Navigation';
import EmotionalTransition from '../components/EmotionalTransition';
import PathChoice from '../components/PathChoice';
import TargetEmotionSelector from '../components/TargetEmotionSelector';
import TransitionDurationSelector from '../components/TransitionDurationSelector';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

const Index = () => {
  const [activeTab, setActiveTab] = useState('emotions');
  const [selectedEmotion, setSelectedEmotion] = useState<Emotion | null>(null);
  const [targetEmotion, setTargetEmotion] = useState<Emotion | null>(null);
  const [transitionDuration, setTransitionDuration] = useState<number | null>(null);
  const [pathChoice, setPathChoice] = useState<'adapt' | 'transition' | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(sampleTracks[0]);
  const [isTransitionActive, setIsTransitionActive] = useState(false);
  
  const handleEmotionSelect = (emotion: Emotion) => {
    setSelectedEmotion(emotion);
    setPathChoice(null);
    setTargetEmotion(null);
    setTransitionDuration(null);
    setIsTransitionActive(false);
    console.log(`Selected emotion: ${emotion.name} with intensity ${emotion.intensity}`);
  };
  
  const handlePathChoice = (choice: 'adapt' | 'transition') => {
    setPathChoice(choice);
    
    if (choice === 'adapt') {
      // Navigate to music tab for adaptation
      setActiveTab('music');
      
      // Find a suitable track based on emotion
      let trackIndex = 0;
      if (selectedEmotion?.group === 'positive' && selectedEmotion.intensity > 0.6) {
        trackIndex = 3; // Energetic track
      } else if (selectedEmotion?.group === 'positive') {
        trackIndex = 2; // Moderately positive track
      } else if (selectedEmotion && selectedEmotion.intensity > 0.6) {
        trackIndex = 1; // Intense but not positive
      } else {
        trackIndex = 0; // Calm/reflective
      }
      
      setCurrentTrack(sampleTracks[trackIndex % sampleTracks.length]);
    }
  };
  
  const handleTargetEmotionSelect = (emotion: Emotion) => {
    setTargetEmotion(emotion);
    // Ne pas activer la transition encore, attendre la sélection de la durée
  };
  
  const handleDurationSelect = (duration: number) => {
    setTransitionDuration(duration);
    setIsTransitionActive(true);
    setActiveTab('transitions');
  };
  
  const handleBackToEmotions = () => {
    setSelectedEmotion(null);
    setPathChoice(null);
    setTargetEmotion(null);
    setTransitionDuration(null);
    setIsTransitionActive(false);
    setActiveTab('emotions');
  };
  
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };
  
  const handleNextTrack = () => {
    const currentIndex = sampleTracks.findIndex(track => track.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % sampleTracks.length;
    setCurrentTrack(sampleTracks[nextIndex]);
  };
  
  const handlePreviousTrack = () => {
    const currentIndex = sampleTracks.findIndex(track => track.id === currentTrack.id);
    const previousIndex = (currentIndex - 1 + sampleTracks.length) % sampleTracks.length;
    setCurrentTrack(sampleTracks[previousIndex]);
  };
  
  const handleTransitionStop = () => {
    setSelectedEmotion(null);
    setTargetEmotion(null);
    setTransitionDuration(null);
    setPathChoice(null);
    setIsTransitionActive(false);
    setActiveTab('emotions');
  };
  
  const renderTabContent = () => {
    switch (activeTab) {
      case 'emotions':
        // Show emotion wheel or path choice based on state
        if (!selectedEmotion) {
          return (
            <div className="max-w-2xl mx-auto">
              <h1 className="text-2xl font-bold text-center mb-8">Comment vous sentez-vous aujourd'hui ?</h1>
              <EmotionWheel 
                onEmotionSelect={handleEmotionSelect}
                selectedEmotion={selectedEmotion}
              />
            </div>
          );
        } else if (!pathChoice) {
          return (
            <div className="max-w-2xl mx-auto">
              <PathChoice
                selectedEmotion={selectedEmotion}
                onPathChoice={handlePathChoice}
                onBack={handleBackToEmotions}
              />
            </div>
          );
        } else if (pathChoice === 'transition' && !targetEmotion) {
          return (
            <div className="max-w-2xl mx-auto">
              <TargetEmotionSelector
                fromEmotion={selectedEmotion}
                onTargetSelect={handleTargetEmotionSelect}
                onBack={() => setPathChoice(null)}
              />
            </div>
          );
        } else if (pathChoice === 'transition' && targetEmotion && !transitionDuration) {
          // Nouvelle étape : sélection de la durée
          return (
            <div className="max-w-3xl mx-auto">
              <TransitionDurationSelector
                fromEmotion={selectedEmotion}
                targetEmotion={targetEmotion}
                onDurationSelect={handleDurationSelect}
                onBack={() => setTargetEmotion(null)}
              />
            </div>
          );
        }
        // If we reach here with a transition active, redirect to transitions tab
        if (isTransitionActive) {
          return (
            <div className="max-w-2xl mx-auto text-center">
              <p className="text-muted-foreground mb-4">Redirection vers votre transition...</p>
              <Button onClick={() => setActiveTab('transitions')}>
                Voir ma transition
              </Button>
            </div>
          );
        }
        break;
        
      case 'music':
        return (
          <div className="grid gap-8 max-w-3xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Votre Flow Mental+</CardTitle>
                {selectedEmotion && (
                  <CardDescription>
                    Adapté à votre état émotionnel: {selectedEmotion.name}
                  </CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <MusicPlayer 
                  track={currentTrack}
                  isPlaying={isPlaying}
                  onPlayPause={handlePlayPause}
                  onNext={handleNextTrack}
                  onPrevious={handlePreviousTrack}
                />
              </CardContent>
            </Card>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[15, 30, 45].map((duration) => (
                <Button
                  key={duration}
                  className="h-auto py-3 flex flex-col"
                >
                  <span className="text-lg font-medium">{duration} min</span>
                  <span className="text-xs text-muted-foreground mt-1">Flow musical</span>
                </Button>
              ))}
            </div>
            
            <div className="text-center">
              <Button onClick={handleBackToEmotions}>
                Retour aux émotions
              </Button>
            </div>
          </div>
        );
        
      case 'journal':
        return <EmotionalJournal />;
        
      case 'rituals':
        return (
          <>
            <h1 className="text-2xl font-bold mb-8 text-center">Rituels musicaux</h1>
            <MusicRitual />
          </>
        );
        
      case 'transitions':
        return (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-2xl font-bold">Transitions émotionnelles</h1>
              <div className="flex items-center gap-4">
                {transitionDuration && (
                  <div className="text-sm text-muted-foreground">
                    Durée: {transitionDuration} minutes
                  </div>
                )}
                <Button onClick={handleBackToEmotions}>
                  Nouvelle transition
                </Button>
              </div>
            </div>
            <EmotionalTransition 
              fromEmotion={selectedEmotion}
              targetEmotion={targetEmotion}
              duration={transitionDuration}
              onTransitionStop={handleTransitionStop}
            />
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border py-4">
        <div className="container flex items-center justify-center">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo_deezer.svg"
              alt="Deezer Logo"
              width={24}
              height={24}
              className="text-therapy-purple"
            />
            <span className="font-bold text-lg">Mood Harmony</span>
          </div>
        </div>
      </header>
      
      <main className="container py-8">
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;