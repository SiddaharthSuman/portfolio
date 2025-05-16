/**
 * Types for the Tech Expertise section
 * Following Interface Segregation Principle with focused interfaces
 */

export interface Skill {
  color: string;
  description?: string;
  icon?: string;
  name: string;
}

export interface PrimarySkill extends Skill {
  experience: string;
}

export interface ExpertiseCategory {
  color: string;
  id: string;
  name: string;
  primarySkill: PrimarySkill;
  secondarySkills: Skill[];
}
