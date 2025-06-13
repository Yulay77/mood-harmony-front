import React, { useState } from 'react';
import { emotions, Emotion } from '../data/emotions';
import { cn } from '../lib/utils';

interface EmotionWheelProps {
  onEmotionSelect: (emotion: Emotion) => void;
  selectedEmotion?: Emotion | null;
}

export default function EmotionWheel({ onEmotionSelect, selectedEmotion }: EmotionWheelProps) {
  const [hoveredEmotion, setHoveredEmotion] = useState<Emotion | null>(null);
  
  // Calculate position for each emotion segment in the wheel
  const totalEmotions = emotions.length;
  const anglePerEmotion = 360 / totalEmotions;
  
  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="relative aspect-square rounded-full bg-gradient-to-br from-therapy-purple/20 to-therapy-dark-purple/20 p-4 flex items-center justify-center">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-center">
            {selectedEmotion ? selectedEmotion.name : hoveredEmotion ? hoveredEmotion.name : ""}
          </span>
        </div>

        <div className="relative w-full h-full">
        {emotions.map((emotion, index) => {
          const angle = index * anglePerEmotion;
          const radians = (angle - 90) * (Math.PI / 180);
            const radius = 42; // percentage from center

            // Calculate position on the wheel
          const x = 50 + radius * Math.cos(radians);
          const y = 50 + radius * Math.sin(radians);

            // Determine if this emotion is selected
          const isSelected = selectedEmotion?.id === emotion.id;

          return (
            <div
              key={emotion.id}
              className={cn(
                  "emotion-wheel-segment absolute w-20 h-20 -translate-x-1/2 -translate-y-1/2 rounded-full flex flex-col items-center justify-center cursor-pointer",
                emotion.color,
                isSelected ? "ring-4 ring-primary shadow-lg scale-110" : "",
                hoveredEmotion?.id === emotion.id ? "scale-105" : ""
              )}
              style={{
                left: `${x}%`,
                top: `${y}%`,
              }}
              onClick={() => onEmotionSelect(emotion)}
              onMouseEnter={() => setHoveredEmotion(emotion)}
              onMouseLeave={() => setHoveredEmotion(null)}
            >
              <div className="text-3xl">{emotion.icon}</div>
              <div className="text-xs font-medium mt-1 text-foreground">{emotion.name}</div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Emotion description */}
      <div className="mt-6 text-center">
        {selectedEmotion && (
          <div className="p-4 rounded-lg bg-white dark:bg-slate-800 shadow-sm animate-fade-in">
            <p className="text-muted-foreground">{selectedEmotion.description}</p>
            <div className="mt-4 flex justify-center gap-2">
              <div className="bg-therapy-soft-blue py-1 px-3 rounded-full text-sm font-medium">
                Intensité: {Math.round(selectedEmotion.intensity * 100)}%
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
