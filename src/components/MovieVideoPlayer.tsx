import React from 'react';

interface MovieVideoPlayerProps {
  children: React.ReactNode;
  selectedSource: string;
  playerData: {
    isLecteur6?: boolean; 
    isVIP?: boolean;
    isAdFree?: boolean;
    isSuperVideoOrDropload?: boolean;
  };
  onSelectSource: (source: string) => void;
}

const MovieVideoPlayer: React.FC<MovieVideoPlayerProps> = ({ 
  children, 
  // eslint-disable-next-line unused-imports/no-unused-vars
  onSelectSource
}) => {
  return (
    <>
      {children}
    </>
  );
};

export default MovieVideoPlayer; 