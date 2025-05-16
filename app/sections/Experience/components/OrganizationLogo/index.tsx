// sections/ExperienceSection/components/OrganizationLogo/index.tsx

import React from 'react';
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
  // console.log('ratio is ', ratio, num, den, experience.img.ratio);

  return (
    <div className={`${styles.logoContainer} ${styles[experience.type]}`}>
      {/* If we have a logo, display it, otherwise show initials */}
      <div className={styles.logoContent}>
        {/* <span className={styles.logoInitials}>{initials}</span> */}
        <Image
          alt={experience.img.alt}
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
