// sections/ExperienceSection/services/ExperienceService.ts
import experienceData from '@/app/data/experience.json';

import { ExperienceWithType, ExperienceType, ExperienceData } from '../models/Experience';

// Helper to parse dates robustly (supports 'MMM YYYY' and ISO)
function parseDate(dateStr: string | null): number {
  if (!dateStr) return Number.NEGATIVE_INFINITY;
  // Try ISO first
  const iso = Date.parse(dateStr);
  if (!isNaN(iso)) return iso;
  // Fallback for 'MMM YYYY'
  const parts = dateStr.match(/^(\w{3,})\s(\d{4})$/);
  if (parts) {
    const month = new Date(Date.parse(parts[1] + ' 1, 2000')).getMonth();
    const year = parseInt(parts[2], 10);
    return new Date(year, month, 1).getTime();
  }
  return Number.NEGATIVE_INFINITY;
}

class ExperienceService {
  private data: ExperienceData;

  constructor() {
    // Initialize with data
    this.data = experienceData as ExperienceData;
  }

  /**
   * Get all experiences combined and sorted by date (most recent first),
   * education before work if dates are equal
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

    // Combine and sort by date, then by type (education before work)
    return [...workExperiences, ...educationExperiences].sort((a, b) => {
      const dateA = parseDate(a.startDate);
      const dateB = parseDate(b.startDate);
      if (dateA !== dateB) return dateB - dateA; // Most recent first
      // If dates are equal, education before work
      if (a.type === b.type) return 0;
      return a.type === 'education' ? -1 : 1;
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
        const dateA = parseDate(a.startDate);
        const dateB = parseDate(b.startDate);
        return dateB - dateA;
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
