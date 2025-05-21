'use client';

import { useEffect, useRef, useState } from 'react';

import styles from './VimeoVideo.module.scss';

interface VimeoVideoProps {
  company: string;
  isHovering: boolean;
  title: string;
  videoId: string;
}

const VimeoVideo: React.FC<VimeoVideoProps> = ({ isHovering, title, videoId }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  // console.log('isHovering', isHovering);

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
    const handleResize = () => {
      if (!iframeRef.current) return;
      // Initially the height is smaller, use height first to calculate video width
      const rect = iframeRef.current.getBoundingClientRect();
      // const videoHeight = rect.height;
      // const videoWidth = videoHeight * 1.7778; //TODO: replace with actual aspect ratio
      // const scaleFactor = rect.width / videoWidth;

      // Now the height is more than width
      const frameWidth = rect.width;
      const videoHeight = frameWidth / 1.7778; //TODO: replace with actual aspect ratio
      const scaleFactor = rect.height / videoHeight;

      // console.log('calc scale factor', scaleFactor, rect, videoHeight);

      iframeRef.current.style = `scale:${scaleFactor}`;
    };

    window.addEventListener('resize', handleResize);

    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`${styles.vimeoContainer} ${isHovering ? styles.active : ''}`}
    >
      <iframe
        ref={iframeRef}
        allow="fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        className={styles.vimeoIframe}
        frameBorder="0"
        height="auto"
        src={`https://player.vimeo.com/video/${videoId}?h=ef41f54bf8&title=0&byline=0&portrait=0&muted=1&autopause=1&autoplay=0&controls=0&loop=1&background=1&quality=auto&dnt=1&badge=0&player_id=0&app_id=58479`}
        title={`${title} - Video`}
        width="100%"
      />

      {/* Video disclaimer overlay - ensure it's above the ::after overlay */}
      {/* <div className={`${styles.videoDisclaimer} ${isHovering ? styles.hovered : ''}`}>
        Video courtesy of {company}. All rights reserved.
      </div> */}
    </div>
  );
};

export default VimeoVideo;
