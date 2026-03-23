
import { useEffect, useState } from 'react';

export const useAnimatedNumber = (
  value: number,
  duration: number = 1000,
  delay: number = 0
): number => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const startTime = Date.now() + delay;
    const startValue = displayValue;
    const endValue = value;
    const changeInValue = endValue - startValue;
    
    if (changeInValue === 0) return;

    const animateValue = () => {
      const now = Date.now();
      if (now < startTime) {
        requestAnimationFrame(animateValue);
        return;
      }
      
      const elapsedTime = now - startTime;
      if (elapsedTime >= duration) {
        setDisplayValue(endValue);
        return;
      }
      
      const progress = elapsedTime / duration;
      const easedProgress = easeOutCubic(progress);
      const currentValue = startValue + changeInValue * easedProgress;
      
      setDisplayValue(Math.round(currentValue));
      requestAnimationFrame(animateValue);
    };
    
    requestAnimationFrame(animateValue);
  }, [value, duration, delay]);

  return displayValue;
};

// Easing function for smoother animation
const easeOutCubic = (x: number): number => {
  return 1 - Math.pow(1 - x, 3);
};

export const useTypingEffect = (
  text: string,
  speed: number = 50
): string => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText('');
    
    if (!text) return;

    let index = 0;
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text.charAt(index));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);

    return () => clearInterval(timer);
  }, [text, speed]);

  return displayedText;
};
