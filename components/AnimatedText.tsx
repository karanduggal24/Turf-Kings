'use client';

import React from 'react';

interface AnimatedTextProps {
  children: React.ReactNode;
  className?: string;
  animation?: 'fadeIn' | 'slideUp' | 'typewriter' | 'bounce' | 'glow';
  duration?: number;
  delay?: number;
}

const AnimatedText: React.FC<AnimatedTextProps> = ({
  children,
  className = '',
  animation = 'fadeIn',
  duration = 1000,
  delay = 0,
}) => {
  const getAnimationClass = () => {
    switch (animation) {
      case 'fadeIn':
        return 'animate-fade-in';
      case 'slideUp':
        return 'animate-slide-up';
      case 'typewriter':
        return 'animate-typewriter';
      case 'bounce':
        return 'animate-bounce-in';
      case 'glow':
        return 'animate-glow';
      default:
        return 'animate-fade-in';
    }
  };

  const style = {
    animationDuration: `${duration}ms`,
    animationDelay: `${delay}ms`,
  };

  return (
    <span 
      className={`${getAnimationClass()} ${className}`}
      style={style}
    >
      {children}
    </span>
  );
};

export default AnimatedText;