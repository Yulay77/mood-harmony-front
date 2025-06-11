
import React from 'react';
import { cn } from '../lib/utils';
import { Music, Activity, Calendar, BarChart } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'emotions', label: 'Émotions', icon: Activity },
    { id: 'music', label: 'Flow Mental+', icon: Music },
    { id: 'transitions', label: 'Transitions', icon: BarChart },
    { id: 'rituals', label: 'Rituels', icon: Calendar },
  ];
  
  return (
    <div className="flex justify-center mb-8">
      <div className="flex gap-2 p-1 bg-muted/50 rounded-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all text-sm md:text-base",
                isActive 
                  ? "bg-white dark:bg-slate-800 text-therapy-dark-purple font-medium shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden md:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
