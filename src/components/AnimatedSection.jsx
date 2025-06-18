import { useEffect, useRef, useState } from 'react';

const AnimatedSection = ({ 
  children, 
  animation = 'fadeInUp', 
  delay = 0, 
  duration = 0.6,
  threshold = 0.1,
  className = '',
  ...props 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, hasAnimated]);

  const getAnimationStyle = () => {
    const baseStyle = {
      transition: `all ${duration}s cubic-bezier(0.4, 0, 0.2, 1)`,
      transitionDelay: `${delay}s`,
      opacity: isVisible ? 1 : 0,
    };

    switch (animation) {
      case 'fadeInUp':
        return {
          ...baseStyle,
          transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        };
      case 'fadeInLeft':
        return {
          ...baseStyle,
          transform: isVisible ? 'translateX(0)' : 'translateX(-30px)',
        };
      case 'fadeInRight':
        return {
          ...baseStyle,
          transform: isVisible ? 'translateX(0)' : 'translateX(30px)',
        };
      case 'scaleIn':
        return {
          ...baseStyle,
          transform: isVisible ? 'scale(1)' : 'scale(0.9)',
        };
      case 'slideInUp':
        return {
          ...baseStyle,
          transform: isVisible ? 'translateY(0)' : 'translateY(50px)',
        };
      case 'bounceIn':
        return {
          ...baseStyle,
          transform: isVisible ? 'scale(1)' : 'scale(0.3)',
          transition: `all ${duration}s cubic-bezier(0.68, -0.55, 0.265, 1.55)`,
          transitionDelay: `${delay}s`,
        };
      default:
        return baseStyle;
    }
  };

  return (
    <div
      ref={ref}
      className={`animated-section ${className}`}
      style={getAnimationStyle()}
      data-animation={animation}
      {...props}
    >
      {children}
    </div>
  );
};

export default AnimatedSection; 