// sections/ExperienceSection/components/OrganizationLogo/index.tsx

import React, { useRef, useState } from 'react';
import Image from 'next/image';

import { ExperienceWithType } from '../../models/Experience';

import styles from './OrganizationLogo.module.scss';

interface OrganizationLogoProps {
  experience: ExperienceWithType;
  parallaxOffset?: number;
}

/**
 * Component to display an organization's logo
 * Falls back to organization initials if no logo is available
 */
const OrganizationLogo: React.FC<OrganizationLogoProps> = ({ experience }) => {
  const ratio =
    experience.img.ratio === 'original' ? experience.img.width! / experience.img.height! : 1;
  const [isHovering, setIsHovering] = useState(false);
  const timerRef = useRef<NodeJS.Timeout>(null);

  const startHoverAnim = () => {
    if (timerRef.current) {
      console.log('timer still running, ignore');
      return;
    }
    setIsHovering(true);
    timerRef.current = setTimeout(() => {
      console.log('start anim, stop timer');
      timerRef.current = null;
    }, 300);
  };

  const stopHoverAnim = () => {
    if (timerRef.current) {
      console.log('unable to stop as timer is running');
      return;
    }
    setIsHovering(false);
    timerRef.current = setTimeout(() => {
      console.log('stop anim, stop timer');
      timerRef.current = null;
    }, 300);
    console.log('stop anim');
  };

  return (
    <div className={`${styles.logoContainer} ${styles[experience.type]}`}>
      <div
        className={`${styles.logoContent} ${isHovering ? styles.animate : ''} `}
        onMouseEnter={startHoverAnim}
        onMouseLeave={stopHoverAnim}
      >
        <Image
          alt={experience.img.alt}
          className={styles.iconFront}
          height={100 / ratio}
          src={`/${experience.img.src}`}
          style={{ aspectRatio: ratio }}
          width={100}
        ></Image>
        <Image
          alt={experience.img.alt}
          className={styles.iconBack}
          height={100 / ratio}
          src={`/${experience.img.src}`}
          style={{ aspectRatio: ratio }}
          width={100}
        ></Image>
      </div>
    </div>
  );
};

export default OrganizationLogo;
