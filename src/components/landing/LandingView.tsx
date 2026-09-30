import React from 'react';
import { LandingHero } from './LandingHero';
import { FeatureShowcase } from './FeatureShowcase';
import { LandingFooter } from './LandingFooter';

interface LandingViewProps {
  onStartReading: () => void;
  onExploreReader: () => void;
}

export const LandingView: React.FC<LandingViewProps> = ({
  onStartReading,
  onExploreReader,
}) => {
  return (
    <div className="w-full flex flex-col min-h-screen bg-[#F5F1E8]">
      <LandingHero
        onStartReading={onStartReading}
        onExploreReader={onExploreReader}
      />
      <FeatureShowcase />
      <LandingFooter />
    </div>
  );
};
