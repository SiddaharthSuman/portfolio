// sections/ExperienceSection/models/Experience.ts

export type ExperienceType = 'work' | 'education';

export interface Experience {
  description: string;
  details: string[];
  endDate: string | null;
  id: string;
  img: {
    alt: string;
    height?: number;
    ratio: 'original' | 'square';
    src: string;
    width?: number;
  };
  location: string;
  organization: string;
  startDate: string;
  technologies: string[];
  title: string;
  url: string | null;
}

export interface ExperienceWithType extends Experience {
  type: ExperienceType;
}

export interface ExperienceData {
  education: Experience[];
  work: Experience[];
}

export interface FilterState {
  value: 'all' | ExperienceType;
}
