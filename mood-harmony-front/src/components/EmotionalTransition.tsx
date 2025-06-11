import React, { useState, useEffect, useRef } from 'react';
import { emotionalTransitions } from '../data/emotions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { emotions, Emotion } from '../data/emotions';
import { Textarea } from '@/components/ui/textarea';
import { Star, ChevronLeft, ChevronRight, Pause, Play, Square } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface TransitionPhase {
  name: string;
  duration: number;
  progress?: number;
}

interface EmotionalTransitionProps {
  fromEmotion?: Emotion | null;
  targetEmotion?: Emotion | null;
  onTransitionStop?: () => void;
}

interface TransitionEvaluation {
  currentEmotion: Emotion;
  effectiveness: number;
  feedback?: string;
}

export default function EmotionalTransition({ fromEmotion, targetEmotion, onTransitionStop }: EmotionalTransitionProps) {
  const [activeTransition, setActiveTransition] = useState<string | null>(null);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [showEvaluation, setShowEvaluation] = useState(false);
  const [evaluation, setEvaluation] = useState<TransitionEvaluation | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showStopDialog, setShowStopDialog] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Clear interval when component unmounts or transition stops
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);
  
  // Auto-start transition if both emotions are provided
  useEffect(() => {
    if (fromEmotion && targetEmotion && !activeTransition) {
      // Find matching transition or create a custom one
      const existingTransition = emotionalTransitions.find(t => 
        t.fromEmotion === fromEmotion.id && t.toEmotion === targetEmotion.id
      );
      
      if (existingTransition) {
        handleStartTransition(existingTransition.id);
      } else {
        // Create custom transition
        const customTransition = {
          id: `${fromEmotion.id}-to-${targetEmotion.id}`,
          name: `De ${fromEmotion.name} à ${targetEmotion.name}`,
          description: `Transition personnalisée de ${fromEmotion.name} vers ${targetEmotion.name}`,
          fromEmotion: fromEmotion.id,
          toEmotion: targetEmotion.id,
          duration: 30,
          phases: [
            { name: 'Reconnaissance', duration: 7 },
            { name: 'Transition', duration: 16 },
            { name: 'Intégration', duration: 7 }
          ]
        };
        
        startCustomTransition(customTransition);
      }
    }
  }, [fromEmotion, targetEmotion, activeTransition]);
  
  // Handle pause/play toggle
  const handlePlayPause = () => {
    const newPlayingState = !isPlaying;
    setIsPlaying(newPlayingState);
    
    if (newPlayingState && activeTransitionData) {
      // Resume: start the timer
      startTimer(activeTransitionData);
      toast({
        title: 'Transition reprise',
        description: 'La transition continue où vous l\'aviez laissée',
      });
    } else {
      // Pause: stop the timer
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      toast({
        title: 'Transition en pause',
        description: 'Cliquez sur lecture pour reprendre',
      });
    }
  };
  
  const startCustomTransition = (customTransition: any) => {
    setActiveTransition(customTransition.id);
    setCurrentPhase(0);
    setElapsedTime(0);
    setShowEvaluation(false);
    setIsPlaying(true);
    
    startTimer(customTransition);
  };
  
  const handleStartTransition = (transitionId: string) => {
    const transition = emotionalTransitions.find(t => t.id === transitionId);
    if (!transition) return;
    
    setActiveTransition(transitionId);
    setCurrentPhase(0);
    setElapsedTime(0);
    setShowEvaluation(false);
    setIsPlaying(true);
    
    startTimer(transition);
  };
  
  const startTimer = (transition: any) => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    intervalRef.current = setInterval(() => {
      setElapsedTime((prevTime) => {
        const newTime = prevTime + 1;
        const totalDuration = transition.phases.reduce((sum: number, phase: any) => sum + phase.duration, 0);
        
        // Calculate current phase based on elapsed time
        let cumulativeTime = 0;
        let newPhase = 0;
        
        for (let i = 0; i < transition.phases.length; i++) {
          cumulativeTime += transition.phases[i].duration;
          if (newTime < cumulativeTime) {
            newPhase = i;
            break;
          }
          newPhase = transition.phases.length - 1;
        }
        
        // Update phase if changed
        setCurrentPhase(prevPhase => {
          if (newPhase !== prevPhase && newPhase < transition.phases.length) {
            console.log(`Phase transition: ${transition.phases[newPhase].name}`);
          }
          return newPhase;
        });
        
        // Complete transition
        if (newTime >= totalDuration) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          setIsPlaying(false);
          console.log('Transition completed');
          setShowEvaluation(true);
          return totalDuration;
        }
        
        return newTime;
      });
    }, 1000);
  };
  
  // Update timer when isPlaying changes
  useEffect(() => {
    if (activeTransition && activeTransitionData) {
      // If we're playing and no interval is running, start it
      if (isPlaying && !intervalRef.current) {
        startTimer(activeTransitionData);
      }
      // If we're paused, the timer logic will handle it via the isPlaying check
    }
  }, [isPlaying, activeTransition]);
  
  const handleManualPhaseChange = (direction: 'previous' | 'next') => {
    if (!activeTransitionData) return;
    
    const newPhase = direction === 'next' 
      ? Math.min(currentPhase + 1, activeTransitionData.phases.length - 1)
      : Math.max(currentPhase - 1, 0);
    
    if (newPhase !== currentPhase) {
      setCurrentPhase(newPhase);
      
      // Calculate elapsed time for the new phase
      let cumulativeTime = 0;
      for (let i = 0; i < newPhase; i++) {
        cumulativeTime += activeTransitionData.phases[i].duration;
      }
      setElapsedTime(cumulativeTime + 1); // +1 to be in the new phase
      
      toast({
        title: direction === 'next' ? 'Étape suivante' : 'Étape précédente',
        description: `Vous êtes maintenant à l'étape: ${activeTransitionData.phases[newPhase].name}`,
      });
    }
  };
  
  const handleStopTransition = () => {
    // Clear the timer immediately
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Reset all states
    setActiveTransition(null);
    setCurrentPhase(0);
    setElapsedTime(0);
    setIsPlaying(false);
    setShowEvaluation(false);
    setEvaluation(null);
    
    // Notify parent component to reset its states
    if (onTransitionStop) {
      onTransitionStop();
    }
    
    toast({
      title: 'Transition arrêtée',
      description: 'Vous êtes revenu à la sélection des transitions',
    });
  };
  
  const handleSaveProgress = () => {
    // Clear the timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    // Save progress to localStorage
    const progressData = {
      transitionId: activeTransition,
      currentPhase,
      elapsedTime,
      fromEmotion: fromEmotion?.id,
      targetEmotion: targetEmotion?.id,
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('savedTransitionProgress', JSON.stringify(progressData));
    
    toast({
      title: 'Progression sauvegardée',
      description: 'Vous pourrez reprendre votre transition plus tard.',
    });
    
    setActiveTransition(null);
    setShowStopDialog(false);
    setElapsedTime(0);
    setCurrentPhase(0);
    setIsPlaying(false);
  };
  
  const handleAbandonProgress = () => {
    // Clear the timer
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    
    setActiveTransition(null);
    setShowStopDialog(false);
    setElapsedTime(0);
    setCurrentPhase(0);
    setIsPlaying(false);
    
    toast({
      title: 'Transition interrompue',
      description: 'Votre progression n\'a pas été sauvegardée.',
    });
  };
  
  const handleEvaluationSubmit = () => {
    console.log('Evaluation submitted:', evaluation);
    setShowEvaluation(false);
    setActiveTransition(null);
    setElapsedTime(0);
    setCurrentPhase(0);
    setEvaluation(null);
    setIsPlaying(false);
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Get details for the active transition
  const activeTransitionData = activeTransition 
    ? emotionalTransitions.find(t => t.id === activeTransition) ||
      // Handle custom transition
      (fromEmotion && targetEmotion ? {
        id: activeTransition,
        name: `De ${fromEmotion.name} à ${targetEmotion.name}`,
        description: `Transition personnalisée de ${fromEmotion.name} vers ${targetEmotion.name}`,
        fromEmotion: fromEmotion.id,
        toEmotion: targetEmotion.id,
        duration: 30,
        phases: [
          { name: 'Reconnaissance', duration: 7 },
          { name: 'Transition', duration: 16 },
          { name: 'Intégration', duration: 7 }
        ]
      } : null)
    : null;
  
  // Calculate overall progress and remaining time
  const calculateProgressDetails = () => {
    if (!activeTransitionData) return { progressPercentage: 0, remainingTime: 0 };
    
    const totalDuration = activeTransitionData.phases.reduce((sum, phase) => sum + phase.duration, 0);
    const progressPercentage = Math.min(100, (elapsedTime / totalDuration) * 100);
    const remainingTime = Math.max(0, totalDuration - elapsedTime);
    
    return { progressPercentage, remainingTime };
  };
  
  const { progressPercentage, remainingTime } = calculateProgressDetails();
  
  // Find emotion objects for from/to
  const getEmotionFromId = (id?: string): Emotion | undefined => {
    return id ? emotions.find(e => e.id === id) : undefined;
  };
  
  const fromEmotionData = activeTransitionData && getEmotionFromId(activeTransitionData.fromEmotion);
  const toEmotionData = activeTransitionData && getEmotionFromId(activeTransitionData.toEmotion);
  
  // Generate emotional progression steps
  const getEmotionalProgression = () => {
    if (!fromEmotionData || !toEmotionData || !activeTransitionData) return [];
    
    const steps = [fromEmotionData.name];
    
    // Add intermediate emotions based on phases
    if (activeTransitionData.phases.length > 2) {
      const intermediateEmotions = ['Mélancolie', 'Sérénité']; // Example intermediate states
      steps.push(...intermediateEmotions);
    }
    
    steps.push(toEmotionData.name);
    return steps;
  };
  
  const emotionalSteps = getEmotionalProgression();
  
  // Show evaluation screen
  if (showEvaluation && fromEmotionData && toEmotionData) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Évaluation de votre transition</CardTitle>
          <CardDescription>
            Comment vous sentez-vous après cette transition de {fromEmotionData.name} vers {toEmotionData.name} ?
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Before/After comparison */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full ${fromEmotionData.color} flex items-center justify-center text-3xl mx-auto mb-2`}>
                {fromEmotionData.icon}
              </div>
              <div className="text-sm font-medium">État initial</div>
              <div className="text-xs text-muted-foreground">{fromEmotionData.name}</div>
            </div>
            
            <div className="text-2xl text-muted-foreground">→</div>
            
            <div className="text-center">
              <div className={`w-16 h-16 rounded-full ${toEmotionData.color} flex items-center justify-center text-3xl mx-auto mb-2`}>
                {toEmotionData.icon}
              </div>
              <div className="text-sm font-medium">État cible</div>
              <div className="text-xs text-muted-foreground">{toEmotionData.name}</div>
            </div>
          </div>
          
          {/* Current emotion selector */}
          <div>
            <label className="text-sm font-medium mb-3 block">Comment vous sentez-vous maintenant ?</label>
            <div className="grid grid-cols-3 gap-2">
              {emotions.slice(0, 6).map((emotion) => (
                <button
                  key={emotion.id}
                  onClick={() => setEvaluation(prev => ({ ...prev, currentEmotion: emotion, effectiveness: prev?.effectiveness || 3 }))}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    evaluation?.currentEmotion?.id === emotion.id 
                      ? 'border-therapy-purple bg-therapy-soft-purple' 
                      : 'border-muted hover:border-therapy-purple/50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full ${emotion.color} flex items-center justify-center text-lg mx-auto mb-1`}>
                    {emotion.icon}
                  </div>
                  <div className="text-xs">{emotion.name}</div>
                </button>
              ))}
            </div>
          </div>
          
          {/* Effectiveness rating */}
          <div>
            <label className="text-sm font-medium mb-3 block">Efficacité de la transition</label>
            <div className="flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setEvaluation(prev => ({ 
                    currentEmotion: prev?.currentEmotion || emotions[0], 
                    effectiveness: rating,
                    feedback: prev?.feedback 
                  }))}
                  className={`p-1 ${evaluation?.effectiveness === rating ? 'text-yellow-500' : 'text-muted-foreground'}`}
                >
                  <Star className={`w-6 h-6 ${evaluation?.effectiveness === rating ? 'fill-current' : ''}`} />
                </button>
              ))}
            </div>
          </div>
          
          {/* Optional feedback */}
          <div>
            <label className="text-sm font-medium mb-2 block">Commentaires (optionnel)</label>
            <Textarea
              placeholder="Partagez votre ressenti sur cette transition..."
              value={evaluation?.feedback || ''}
              onChange={(e) => setEvaluation(prev => ({ 
                currentEmotion: prev?.currentEmotion || emotions[0], 
                effectiveness: prev?.effectiveness || 3,
                feedback: e.target.value 
              }))}
              className="min-h-[80px]"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowEvaluation(false)}
            className="flex-1"
          >
            Plus tard
          </Button>
          <Button 
            onClick={handleEvaluationSubmit}
            disabled={!evaluation?.currentEmotion}
            className="flex-1 bg-therapy-vivid-purple hover:bg-therapy-dark-purple"
          >
            Valider
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Stop dialog */}
      <Dialog open={showStopDialog} onOpenChange={setShowStopDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Arrêter la transition</DialogTitle>
            <DialogDescription>
              Souhaitez-vous sauvegarder votre progression pour reprendre plus tard ?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={handleAbandonProgress}>
              Abandonner
            </Button>
            <Button onClick={handleSaveProgress}>
              Sauvegarder
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {activeTransition ? (
        <Card className="relative overflow-hidden">
          <div 
            className="absolute inset-0 bg-gradient-to-r from-therapy-soft-purple to-therapy-soft-blue opacity-20 transition-all duration-1000"
            style={{
              clipPath: `polygon(0 0, ${progressPercentage}% 0, ${progressPercentage}% 100%, 0 100%)`
            }}
          ></div>
          
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {activeTransitionData?.name}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePlayPause}
                  className="hover:bg-therapy-soft-purple"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleStopTransition}
                  className="hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                >
                  <Square className="w-4 h-4 mr-1" />
                  Arrêter
                </Button>
              </div>
            </CardTitle>
            <CardDescription>
              {activeTransitionData?.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Detailed emotional progression */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <h3 className="font-medium mb-3">Progression émotionnelle</h3>
              <div className="flex items-center justify-between">
                {emotionalSteps.map((step, idx) => (
                  <div key={step} className="flex items-center">
                    <div className={`text-center ${idx === currentPhase ? 'font-bold text-therapy-purple' : idx < currentPhase ? 'text-therapy-purple' : 'text-muted-foreground'}`}>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs mx-auto mb-1 ${
                        idx === currentPhase ? 'border-therapy-purple bg-therapy-soft-purple' : 
                        idx < currentPhase ? 'border-therapy-purple bg-therapy-purple text-white' : 
                        'border-muted-foreground'
                      }`}>
                        {idx + 1}
                      </div>
                      <div className="text-xs">{step}</div>
                    </div>
                    {idx < emotionalSteps.length - 1 && (
                      <div className={`flex-1 h-0.5 mx-2 ${idx < currentPhase ? 'bg-therapy-purple' : 'bg-muted-foreground'}`}></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Emotional transition visualization */}
            <div className="flex items-center justify-between">
              {fromEmotionData && (
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full ${fromEmotionData.color} flex items-center justify-center text-2xl mx-auto`}>
                    {fromEmotionData.icon}
                  </div>
                  <div className="mt-2 text-sm font-medium">{fromEmotionData.name}</div>
                </div>
              )}
              
              <div className="flex-1 px-4">
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-therapy-vivid-purple to-therapy-light-purple transition-all duration-1000"
                    style={{ width: `${progressPercentage}%` }}
                  ></div>
                </div>
              </div>
              
              {toEmotionData && (
                <div className="text-center">
                  <div className={`w-12 h-12 rounded-full ${toEmotionData.color} flex items-center justify-center text-2xl mx-auto`}>
                    {toEmotionData.icon}
                  </div>
                  <div className="mt-2 text-sm font-medium">{toEmotionData.name}</div>
                </div>
              )}
            </div>
            
            {/* Current phase with manual controls */}
            <div className="bg-muted/30 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium">
                  Phase actuelle: {activeTransitionData?.phases[currentPhase]?.name || 'En cours...'}
                </h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleManualPhaseChange('previous')}
                    disabled={currentPhase === 0}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {currentPhase + 1}/{activeTransitionData?.phases.length}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleManualPhaseChange('next')}
                    disabled={!activeTransitionData || currentPhase >= activeTransitionData.phases.length - 1}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <Progress value={progressPercentage} className="h-3" />
              <div className="flex justify-between mt-2 text-sm text-muted-foreground">
                <span>Écoulé: {formatTime(elapsedTime)}</span>
                <span>Restant: {formatTime(remainingTime)}</span>
              </div>
            </div>
            
            {/* Phase timeline */}
            <div className="flex justify-between gap-1 mt-4">
              {activeTransitionData?.phases.map((phase, idx) => (
                <div 
                  key={idx} 
                  className={`flex-1 p-2 text-center rounded-md text-xs transition-all cursor-pointer ${
                    idx === currentPhase 
                      ? 'bg-therapy-soft-purple text-therapy-dark-purple font-medium' 
                      : idx < currentPhase 
                        ? 'bg-therapy-soft-purple/50 text-therapy-dark-purple'
                        : 'bg-muted/30 hover:bg-muted/50'
                  }`}
                  onClick={() => {
                    setCurrentPhase(idx);
                    let cumulativeTime = 0;
                    for (let i = 0; i < idx; i++) {
                      cumulativeTime += activeTransitionData.phases[i].duration;
                    }
                    setElapsedTime(cumulativeTime + 1);
                  }}
                >
                  {phase.name}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : !fromEmotion ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {emotionalTransitions.map((transition) => {
            const fromEmotionData = getEmotionFromId(transition.fromEmotion);
            const toEmotionData = getEmotionFromId(transition.toEmotion);
            
            return (
              <Card key={transition.id} className="hover:shadow-md transition-all">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{transition.name}</CardTitle>
                  <CardDescription>{transition.description}</CardDescription>
                </CardHeader>
                
                <CardContent>
                  <div className="flex items-center justify-between mt-2">
                    {fromEmotionData && (
                      <div className="text-center flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full ${fromEmotionData.color} flex items-center justify-center text-xl`}>
                          {fromEmotionData.icon}
                        </div>
                        <span className="text-xs mt-1">{fromEmotionData.name}</span>
                      </div>
                    )}
                    
                    <div className="flex-1 px-3">
                      <div className="h-[2px] bg-muted relative">
                        <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-around">
                          {transition.phases.map((_, idx) => (
                            <div key={idx} className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {toEmotionData && (
                      <div className="text-center flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full ${toEmotionData.color} flex items-center justify-center text-xl`}>
                          {toEmotionData.icon}
                        </div>
                        <span className="text-xs mt-1">{toEmotionData.name}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{transition.phases.length} phases</span>
                      <span>{transition.duration} minutes</span>
                    </div>
                  </div>
                </CardContent>
                
                <CardFooter>
                  <Button 
                    onClick={() => handleStartTransition(transition.id)}
                    className="w-full bg-therapy-vivid-purple hover:bg-therapy-dark-purple"
                  >
                    Démarrer
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center">
          <p className="text-muted-foreground">
            Transition en cours de préparation depuis {fromEmotion.name}...
          </p>
        </div>
      )}
    </div>
  );
}
