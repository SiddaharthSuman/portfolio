'use client';

import { useEffect, useRef, useState } from 'react';

import styles from '@/app/sections/Projects/ProjectsSection.module.scss';

interface VimeoVideoProps {
  company: string;
  isHovering: boolean;
  title: string;
  videoId: string;
}

const VimeoVideo: React.FC<VimeoVideoProps> = ({ company, isHovering, title, videoId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  console.log('isHovering', isHovering);

  // Setup intersection observer to detect when video is in viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.2 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Handle hover state and postMessage to Vimeo iframe
  useEffect(() => {
    const iframe = iframeRef.current;

    if (iframe && iframe.contentWindow) {
      // Only control videos that are in view
      if (isInView) {
        if (isHovering) {
          // When hovering, play the video
          iframe.contentWindow.postMessage(
            JSON.stringify({
              method: 'play',
              value: 'play',
            }),
            '*'
          );
        } else {
          // When not hovering, pause the video
          iframe.contentWindow.postMessage(
            JSON.stringify({
              method: 'pause',
              value: 'pause',
            }),
            '*'
          );
        }
      } else if (iframe.contentWindow) {
        // When not in view, ensure the video is paused
        iframe.contentWindow.postMessage(
          JSON.stringify({
            method: 'pause',
            value: 'pause',
          }),
          '*'
        );
      }
    }
  }, [isHovering, isInView, videoId]);

  useEffect(() => {
    if (!iframeRef.current) return;
    // Initially the height is smaller, use height first to calculate video width
    const rect = iframeRef.current.getBoundingClientRect();
    const videoHeight = rect.height;
    const videoWidth = videoHeight * 1.7778; //TODO: replace with actual aspect ratio
    const scaleFactor = rect.width / videoWidth;

    console.log('calc scale factor', scaleFactor);

    iframeRef.current.style = `scale:${scaleFactor}`;
  }, []);

  return (
    <div ref={containerRef} className={styles.vimeoContainer}>
      <iframe
        ref={iframeRef}
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        className={styles.vimeoIframe}
        frameBorder="0"
        height="auto"
        src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0&muted=1&autopause=0&controls=0&loop=1&background=1&quality=auto&dnt=1`}
        title={`${title} - Video`}
        width="100%"
      />

      {/* Video disclaimer overlay - ensure it's above the ::after overlay */}
      <div className={styles.videoDisclaimer}>
        Video courtesy of {company}. All rights reserved.
      </div>
    </div>
  );
};

export default VimeoVideo;
