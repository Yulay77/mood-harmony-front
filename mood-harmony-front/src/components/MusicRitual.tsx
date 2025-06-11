
import React, { useState } from 'react';
import { ritualTemplates } from '../data/musicData';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { emotions } from '../data/emotions';

export default function MusicRitual() {
  const [openRitual, setOpenRitual] = useState<string | null>(null);
  const [scheduledRituals, setScheduledRituals] = useState<string[]>([]);
  
  const handleScheduleRitual = (ritualId: string) => {
    setScheduledRituals((prev) => [...prev, ritualId]);
    setOpenRitual(null);
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {ritualTemplates.map((ritual) => {
          const isScheduled = scheduledRituals.includes(ritual.id);
          const targetEmotion = emotions.find(e => e.id === ritual.targetEmotion);
          
          return (
            <Card 
              key={ritual.id} 
              className={`transition-all hover:shadow-md ${
                isScheduled ? 'border-therapy-purple' : ''
              }`}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      <span>{ritual.icon}</span> {ritual.name}
                    </CardTitle>
                    <CardDescription className="mt-1">{ritual.description}</CardDescription>
                  </div>
                  {isScheduled && (
                    <Badge variant="outline" className="bg-therapy-soft-purple border-therapy-purple text-therapy-dark-purple">
                      Programmé
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm">
                    {ritual.duration} minutes
                  </div>
                  {targetEmotion && (
                    <div className={`px-3 py-1 rounded-full text-sm ${targetEmotion.color}`}>
                      {targetEmotion.name}
                    </div>
                  )}
                  <div className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-sm">
                    {ritual.recommendedTime}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => setOpenRitual(ritual.id)}
                  variant={isScheduled ? "outline" : "default"}
                  className={isScheduled ? "border-therapy-purple text-therapy-purple" : ""}
                >
                  {isScheduled ? 'Modifier' : 'Programmer'}
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>
      
      {/* Ritual scheduling dialog */}
      <Dialog open={!!openRitual} onOpenChange={(open) => !open && setOpenRitual(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {openRitual && ritualTemplates.find(r => r.id === openRitual)?.name}
            </DialogTitle>
            <DialogDescription>
              Programmez ce rituel musical dans votre routine quotidienne
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Jours</label>
                <div className="flex flex-wrap gap-1.5">
                  {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((day, i) => (
                    <Badge 
                      key={i}
                      variant="outline" 
                      className="w-7 h-7 rounded-full flex items-center justify-center cursor-pointer hover:bg-therapy-soft-purple"
                    >
                      {day}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Heure</label>
                <div className="border rounded-md p-2">
                  {openRitual && ritualTemplates.find(r => r.id === openRitual)?.recommendedTime}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Options</label>
              <div className="space-y-2">
                <div className="flex items-center">
                  <input type="checkbox" id="notification" className="mr-2" defaultChecked />
                  <label htmlFor="notification">Notifications</label>
                </div>
                <div className="flex items-center">
                  <input type="checkbox" id="automatic" className="mr-2" defaultChecked />
                  <label htmlFor="automatic">Démarrage automatique</label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenRitual(null)}
            >
              Annuler
            </Button>
            <Button
              onClick={() => openRitual && handleScheduleRitual(openRitual)}
              className="bg-therapy-vivid-purple hover:bg-therapy-dark-purple"
            >
              Programmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
