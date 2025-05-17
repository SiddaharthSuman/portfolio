import React, { useEffect, useRef, useState } from 'react';

import styles from './TechExpertise.module.scss';
import { ExpertiseCategory } from './types';
import { PrimarySkills } from './PrimarySkills';
import { SecondarySkills } from './SecondarySkills';

interface ExpertiseCardProps {
  category: ExpertiseCategory;
  isExpanded: boolean;
  onToggle: (categoryId: string | null) => void;
}

/**
 * ExpertiseCard component - renders a single category card
 * Following Single Responsibility Principle by handling only a single card
 */
export const ExpertiseCard: React.FC<ExpertiseCardProps> = ({ category, isExpanded, onToggle }) => {
  const [expandedStyle, setExpandedStyle] = useState<React.CSSProperties>({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const expandedRef = useRef<HTMLDivElement>(null);
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null);

  // SETS INITIAL CARD STYLE
  useEffect(() => {
    if (!cardRef.current) return;

    if (isExpanded && !isAnimating && !isClosing) {
      const rect = cardRef.current.getBoundingClientRect();

      // const cardLeft = rect.left;
      const cardWidth = rect.width;
      const cardHeight = rect.height;

      const initialStyle: React.CSSProperties = {
        position: 'fixed',
        top: `0px`,
        left: `0px`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
      };

      setExpandedStyle(initialStyle);
      setIsAnimating(true);
    } else if (!isExpanded && isAnimating && !isClosing) {
      setIsClosing(true);
    }
  }, [isExpanded, isAnimating, isClosing]);

  // SETS EXPANDED CARD STYLE
  useEffect(() => {
    if (!cardRef.current) return;
    if (isAnimating && !isClosing) {
      const rect = cardRef.current.getBoundingClientRect();

      const cardLeft = rect.left;
      const cardWidth = rect.width;
      const cardHeight = rect.height;

      const initialStyle: React.CSSProperties = {
        position: 'fixed',
        top: `0px`,
        left: `0px`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
      };

      requestAnimationFrame(() => {
        const isRightEdge = cardLeft + (cardWidth * 6) / 4 > window.innerWidth;
        const expandedLeft = isRightEdge ? cardWidth - (cardWidth * 6) / 4 : 0;

        const finalStyle: React.CSSProperties = {
          ...initialStyle,
          top: `0px`,
          left: `${expandedLeft}px`,
          width: `${(cardWidth * 6) / 4}px`,
          height: 'auto',
        };

        setExpandedStyle(finalStyle);
      });
    }
  }, [isAnimating, isClosing]);

  // SETS CLOSING CARD STYLE
  useEffect(() => {
    if (!cardRef.current || !expandedRef.current) {
      return;
    }
    if (isClosing) {
      const rect = cardRef.current.getBoundingClientRect();

      const cardWidth = rect.width;
      const cardHeight = rect.height;

      const originalHeight = expandedRef.current.getBoundingClientRect().height;

      const closingStyle: React.CSSProperties = {
        position: 'fixed',
        top: `0px`,
        left: `0px`,
        width: `${cardWidth}px`,
        height: `${cardHeight}px`,
      };

      const originalStyle: React.CSSProperties = {
        ...closingStyle,
        height: `${originalHeight}px`,
      };

      setExpandedStyle(originalStyle);

      requestAnimationFrame(() => {
        setExpandedStyle(closingStyle);
      });

      const resetStateTimer = setTimeout(() => {
        setIsAnimating(false);
        setIsClosing(false);
      }, 300);

      return () => clearTimeout(resetStateTimer);
    }
  }, [isClosing]);

  // Handle mouse tracking to determine when to close expanded card
  useEffect(() => {
    if (!isExpanded || !isAnimating) return;

    const handleMouseMove = (e: MouseEvent) => {
      // Check if card is already expanded and hovering inside
      if (!expandedRef.current) return;

      const expandedRect = expandedRef.current.getBoundingClientRect();
      const buffer = 30; // Add a small buffer around the card

      // Check if mouse is outside the expanded card boundaries
      const isOutside =
        e.clientX < expandedRect.left - buffer ||
        e.clientX > expandedRect.left + expandedRect.width + buffer ||
        e.clientY < expandedRect.top - buffer ||
        e.clientY > expandedRect.top + expandedRect.height + buffer;

      if (isOutside && isExpanded && !isClosing) {
        setIsClosing(true);

        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
        }

        setTimeout(() => {
          onToggle(null); // Tell parent to unhover this card
        }, 300);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, [isExpanded, isAnimating, isClosing, onToggle]);

  return (
    <div
      ref={cardRef}
      className={styles.cardContainer}
      style={{ zIndex: isExpanded ? 100 : 'unset' }}
      onFocus={() => {
        console.log('focus entered');
        onToggle(category.id);
      }}
      onMouseLeave={() => {
        console.log('mouse left');
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current);
          hoverTimerRef.current = null;
        }
      }}
      onMouseOver={() => {
        if (!isExpanded) {
          console.log('mouse is over');
          if (hoverTimerRef.current) {
            clearTimeout(hoverTimerRef.current);
            hoverTimerRef.current = null;
          }
          hoverTimerRef.current = setTimeout(() => {
            onToggle(category.id);
            hoverTimerRef.current = null;
          }, 300);
        }
      }}
    >
      <div
        className={`${styles.expertiseCard} ${isExpanded ? styles.hidden : ''}`}
        style={{
          borderTopColor: category.color,
        }}
      >
        {/* Category header */}
        <div className={styles.cardHeader}>
          <h3 className={styles.categoryName}>{category.name}</h3>
          <div className={styles.indicator} style={{ backgroundColor: `${category.color}30` }}>
            <svg
              className={`${styles.arrow} ${isExpanded ? styles.rotated : ''}`}
              fill="none"
              stroke={category.color}
              viewBox="0 0 24 24"
            >
              <path
                d="M19 9l-7 7-7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </div>
        </div>

        {/* Primary skill section - always visible */}
        <PrimarySkills
          color={category.color}
          isExpanded={false}
          primarySkill={category.primarySkill}
        />

        {/* Secondary skills - revealed on hover
      <SecondarySkills
        color={category.color}
        isExpanded={isExpanded}
        secondarySkills={category.secondarySkills}
      /> */}

        {/* Hover hint - only visible when not expanded */}
        <div
          className={styles.hoverHint}
          style={{
            color: category.color,
            opacity: isExpanded ? 0 : 0.6,
          }}
        >
          Hover for more
        </div>
      </div>

      {/* division */}
      {/* Category header */}
      {isExpanded && isAnimating && (
        <div
          ref={expandedRef}
          className={`${styles.expertiseCard} ${isExpanded ? styles.expanded : styles.hidden}`}
          style={{ ...expandedStyle, borderTopColor: category.color }}
        >
          <div className={styles.cardHeader}>
            <h3 className={styles.categoryName}>{category.name}</h3>
            <div className={styles.indicator} style={{ backgroundColor: `${category.color}30` }}>
              <svg
                className={`${styles.arrow} ${isExpanded ? styles.rotated : ''}`}
                fill="none"
                stroke={category.color}
                viewBox="0 0 24 24"
              >
                <path
                  d="M19 9l-7 7-7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
          </div>

          {/* Primary skill section - always visible */}
          <PrimarySkills
            color={category.color}
            isExpanded={isExpanded}
            primarySkill={category.primarySkill}
          />

          {/* Secondary skills - revealed on hover */}
          <SecondarySkills
            color={category.color}
            isExpanded={isExpanded && !isClosing}
            secondarySkills={category.secondarySkills}
          />

          {/* Hover hint - only visible when not expanded */}
          <div
            className={styles.hoverHint}
            style={{
              color: category.color,
              opacity: isExpanded ? 0 : 0.6,
            }}
          >
            Hover for more
          </div>
        </div>
      )}
    </div>
  );
};
