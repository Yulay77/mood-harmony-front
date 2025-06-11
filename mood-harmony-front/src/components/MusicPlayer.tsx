
import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';
import { cn } from '../lib/utils';
import { Track } from '../data/musicData';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

interface MusicPlayerProps {
  track?: Track;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function MusicPlayer({ track, isPlaying, onPlayPause, onNext, onPrevious }: MusicPlayerProps) {
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(80);
  
  // Simulate progress updates when playing
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isPlaying && track) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + (100 / track.duration) * 0.25;
          return newProgress > 100 ? 0 : newProgress;
        });
      }, 250);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, track]);
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  if (!track) {
    return (
      <div className="p-4 rounded-lg bg-muted/50 text-center">
        <p className="text-muted-foreground">Aucune piste sélectionnée</p>
      </div>
    );
  }
  
  const currentTime = Math.floor((track.duration * progress) / 100);
  
  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col md:flex-row">
        {/* Album art */}
        <div className="w-full md:w-1/3 aspect-square">
          <img 
            src={track.albumArt} 
            alt={`${track.title} by ${track.artist}`} 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Player controls */}
        <div className="w-full md:w-2/3 p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-xl mb-1">{track.title}</h3>
            <p className="text-muted-foreground">{track.artist}</p>
            
            {/* Emotional attributes visualization */}
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>Tempo</span>
                  <span className="font-medium">{track.emotionalAttributes.tempo}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-therapy-purple"
                    style={{ width: `${track.emotionalAttributes.tempo}%` }}
                  ></div>
                </div>
              </div>
              <div className="text-sm">
                <div className="flex justify-between mb-1">
                  <span>Énergie</span>
                  <span className="font-medium">{track.emotionalAttributes.energy}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-therapy-purple"
                    style={{ width: `${track.emotionalAttributes.energy}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-6">
            <div className="music-progress">
              <div 
                className="music-progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-sm mt-1 text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(track.duration)}</span>
            </div>
          </div>
          
          {/* Controls */}
          <div className="mt-4 flex justify-center items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onPrevious}
              disabled={!onPrevious}
              className="rounded-full"
            >
              <SkipBack className="w-5 h-5" />
            </Button>
            <Button 
              onClick={onPlayPause}
              size="icon"
              className="w-12 h-12 rounded-full bg-therapy-vivid-purple hover:bg-therapy-dark-purple"
            >
              {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={onNext}
              disabled={!onNext}
              className="rounded-full"
            >
              <SkipForward className="w-5 h-5" />
            </Button>
          </div>
          
          {/* Volume */}
          <div className="mt-6 flex items-center gap-3">
            <Volume2 className="w-4 h-4 text-muted-foreground" />
            <Slider
              value={[volume]}
              min={0}
              max={100}
              step={1}
              onValueChange={(values) => setVolume(values[0])}
              className="w-full max-w-48"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
