// sections/ExperienceSection/services/ExperienceService.ts
import experienceData from '@/app/data/experience.json';

import { ExperienceWithType, ExperienceType, ExperienceData } from '../models/Experience';

class ExperienceService {
  private data: ExperienceData;

  constructor() {
    // Initialize with data
    this.data = experienceData as ExperienceData;
  }

  /**
   * Get all experiences combined and sorted by date (most recent first)
   */
  getAllExperiences(): ExperienceWithType[] {
    // Combine work and education, adding the type property to each
    const workExperiences = this.data.work.map((exp) => ({
      ...exp,
      type: 'work' as ExperienceType,
    }));

    const educationExperiences = this.data.education.map((exp) => ({
      ...exp,
      type: 'education' as ExperienceType,
    }));

    // Combine and sort by date
    return [...workExperiences, ...educationExperiences].sort((a, b) => {
      // Convert dates to comparable format (assuming format is 'MMM YYYY')
      const dateA = new Date(a.startDate);
      const dateB = new Date(b.startDate);
      return dateB.getTime() - dateA.getTime(); // Most recent first
    });
  }

  /**
   * Get experiences of a specific type
   */
  getExperiencesByType(type: ExperienceType): ExperienceWithType[] {
    const experiences = type === 'work' ? this.data.work : this.data.education;
    return experiences
      .map((exp) => ({
        ...exp,
        type,
      }))
      .sort((a, b) => {
        // Sort by date (most recent first)
        const dateA = new Date(a.startDate);
        const dateB = new Date(b.startDate);
        return dateB.getTime() - dateA.getTime();
      });
  }

  /**
   * Get filtered experiences based on filter value
   */
  getFilteredExperiences(filter: 'all' | ExperienceType): ExperienceWithType[] {
    if (filter === 'all') {
      return this.getAllExperiences();
    }

    return this.getExperiencesByType(filter);
  }
}

// Export as singleton instance
export const experienceService = new ExperienceService();
