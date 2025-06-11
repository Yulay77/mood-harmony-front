
import React from 'react';
import { emotions } from '../data/emotions';
import { sampleTracks } from '../data/musicData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface JournalEntry {
  date: string;
  emotion: string;
  intensity: number;
  notes?: string;
  tracks?: string[];
}

// Mock data for demonstration
const journalData: JournalEntry[] = [
  { date: '2023-05-01', emotion: 'anxiety', intensity: 0.7, tracks: ['1'] },
  { date: '2023-05-02', emotion: 'anxiety', intensity: 0.6, tracks: ['1', '3'] },
  { date: '2023-05-03', emotion: 'calm', intensity: 0.4, tracks: ['3'] },
  { date: '2023-05-04', emotion: 'calm', intensity: 0.5, tracks: ['1'] },
  { date: '2023-05-05', emotion: 'joy', intensity: 0.6, tracks: ['2', '4'] },
  { date: '2023-05-06', emotion: 'joy', intensity: 0.8, tracks: ['4'] },
  { date: '2023-05-07', emotion: 'joy', intensity: 0.7, tracks: ['2', '5'] },
];

// Transform data for chart
const chartData = journalData.map(entry => {
  const emotionObj = emotions.find(e => e.id === entry.emotion);
  return {
    date: entry.date.slice(-5), // Format as MM-DD
    intensity: Math.round(entry.intensity * 100),
    emotion: emotionObj?.name || entry.emotion,
  };
});

export default function EmotionalJournal() {
  // Calculate most effective tracks
  const trackEffectiveness = sampleTracks.map(track => {
    const entriesWithTrack = journalData.filter(entry => 
      entry.tracks?.includes(track.id) && 
      emotions.find(e => e.id === entry.emotion)?.group === 'positive'
    );
    
    const effectiveness = entriesWithTrack.length > 0
      ? entriesWithTrack.reduce((sum, entry) => sum + entry.intensity, 0) / entriesWithTrack.length
      : 0;
      
    return {
      ...track,
      effectiveness: Math.round(effectiveness * 100),
      usageCount: entriesWithTrack.length
    };
  }).sort((a, b) => b.effectiveness - a.effectiveness || b.usageCount - a.usageCount);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Votre parcours émotionnel</CardTitle>
          <CardDescription>
            Évolution de votre bien-être sur les 7 derniers jours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  formatter={(value, name) => [`${value}%`, 'Intensité']}
                  labelFormatter={(label) => {
                    const entry = journalData.find(e => e.date.endsWith(label));
                    const emotion = emotions.find(e => e.id === entry?.emotion);
                    return `${label}: ${emotion?.name || ''}`;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="intensity"
                  stroke="#9b87f5"
                  strokeWidth={3}
                  dot={{ stroke: '#7E69AB', strokeWidth: 2, r: 4, fill: '#D6BCFA' }}
                  activeDot={{ r: 6, stroke: '#6E59A5', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Morceaux les plus efficaces</CardTitle>
          <CardDescription>
            Basé sur votre journal émotionnel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {trackEffectiveness.slice(0, 3).map(track => (
              <div key={track.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                <img 
                  src={track.albumArt} 
                  alt={track.title} 
                  className="w-16 h-16 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-medium">{track.title}</h4>
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-therapy-purple">{track.effectiveness}%</div>
                  <div className="text-xs text-muted-foreground">Efficacité</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
