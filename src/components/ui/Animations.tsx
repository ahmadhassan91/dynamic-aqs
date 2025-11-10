'use client';

import React, { useState, useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/accessibility/utils';

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function FadeIn({ children, delay = 0, duration = 300, className = '' }: FadeInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`transition-opacity ${className}`}
      style={{
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
}

interface SlideInProps {
  children: React.ReactNode;
  direction?: 'left' | 'right' | 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
}

export function SlideIn({ 
  children, 
  direction = 'up', 
  delay = 0, 
  duration = 300, 
  className = '' 
}: SlideInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const getTransform = () => {
    if (isVisible) return 'translate3d(0, 0, 0)';
    
    switch (direction) {
      case 'left': return 'translate3d(-100%, 0, 0)';
      case 'right': return 'translate3d(100%, 0, 0)';
      case 'up': return 'translate3d(0, 100%, 0)';
      case 'down': return 'translate3d(0, -100%, 0)';
      default: return 'translate3d(0, 100%, 0)';
    }
  };

  return (
    <div
      className={`transition-transform ${className}`}
      style={{
        transform: getTransform(),
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
}

interface ScaleInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
}

export function ScaleIn({ children, delay = 0, duration = 200, className = '' }: ScaleInProps) {
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`transition-transform ${className}`}
      style={{
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
        opacity: isVisible ? 1 : 0,
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
}

interface StaggeredAnimationProps {
  children: React.ReactNode[];
  delay?: number;
  staggerDelay?: number;
  className?: string;
}

export function StaggeredAnimation({ 
  children, 
  delay = 0, 
  staggerDelay = 100, 
  className = '' 
}: StaggeredAnimationProps) {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn key={index} delay={delay + (index * staggerDelay)}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
}

interface PulseProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'subtle' | 'normal' | 'strong';
}

export function Pulse({ children, className = '', intensity = 'normal' }: PulseProps) {
  const reducedMotion = prefersReducedMotion();

  if (reducedMotion) {
    return <div className={className}>{children}</div>;
  }

  const intensityClasses = {
    subtle: 'animate-pulse opacity-75',
    normal: 'animate-pulse',
    strong: 'animate-pulse opacity-50',
  };

  return (
    <div className={`${intensityClasses[intensity]} ${className}`}>
      {children}
    </div>
  );
}

interface BounceProps {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}

export function Bounce({ children, trigger = false, className = '' }: BounceProps) {
  const [shouldBounce, setShouldBounce] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (trigger && !reducedMotion) {
      setShouldBounce(true);
      const timer = setTimeout(() => setShouldBounce(false), 600);
      return () => clearTimeout(timer);
    }
  }, [trigger, reducedMotion]);

  return (
    <div className={`${shouldBounce ? 'animate-bounce' : ''} ${className}`}>
      {children}
    </div>
  );
}

interface ShakeProps {
  children: React.ReactNode;
  trigger?: boolean;
  className?: string;
}

export function Shake({ children, trigger = false, className = '' }: ShakeProps) {
  const [shouldShake, setShouldShake] = useState(false);
  const reducedMotion = prefersReducedMotion();

  useEffect(() => {
    if (trigger && !reducedMotion) {
      setShouldShake(true);
      const timer = setTimeout(() => setShouldShake(false), 500);
      return () => clearTimeout(timer);
    }
  }, [trigger, reducedMotion]);

  return (
    <div 
      className={`${shouldShake ? 'animate-shake' : ''} ${className}`}
      style={{
        animation: shouldShake ? 'shake 0.5s ease-in-out' : undefined,
      }}
    >
      {children}
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
      `}</style>
    </div>
  );
}

interface FloatingActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  className?: string;
}

export function FloatingActionButton({ 
  onClick, 
  icon, 
  label, 
  position = 'bottom-right',
  className = '' 
}: FloatingActionButtonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const reducedMotion = prefersReducedMotion();

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6',
  };

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed ${positionClasses[position]} z-50
        w-14 h-14 bg-blue-600 text-white rounded-full
        shadow-lg hover:shadow-xl
        flex items-center justify-center
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        transition-all duration-200
        ${!reducedMotion ? 'hover:scale-110' : ''}
        ${className}
      `}
      aria-label={label}
      title={label}
      style={{
        transform: !reducedMotion && isHovered ? 'scale(1.1)' : 'scale(1)',
      }}
    >
      {icon}
    </button>
  );
}

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  animated?: boolean;
}

export function ProgressBar({ 
  progress, 
  className = '', 
  showPercentage = false, 
  animated = true 
}: ProgressBarProps) {
  const reducedMotion = prefersReducedMotion();
  const shouldAnimate = animated && !reducedMotion;

  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div
        className={`bg-blue-600 h-2 rounded-full ${shouldAnimate ? 'transition-all duration-300' : ''}`}
        style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
      />
      {showPercentage && (
        <span className="text-xs text-gray-600 mt-1 block">
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
}