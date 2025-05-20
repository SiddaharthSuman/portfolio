// sections/ProjectsSection/projectData.ts

export type FilterCategory = 'all' | 'web' | 'mobile' | 'design' | 'automation';

export interface ProjectData {
  accentColor?: string;
  categories: FilterCategory[];
  company: string;
  description: string;
  external?: string | null;
  featured: boolean;
  // Vimeo video ID
  github?: string | null;
  id: string;
  image?: string;
  technologies: string[];
  title: string;
  videoSrc?: string;
  // Local video source URL
  vimeoId?: string;
  year: string;
}

export const projectData: ProjectData[] = [
  {
    id: 'lucid-motors',
    title: 'Lucid Motors Website',
    company: 'Code and Theory',
    description:
      'Built the Air and Gravity product pages for Lucid Motors, focusing on smooth animations and responsive design to showcase luxury electric vehicles.',
    technologies: ['React', 'TypeScript', 'GSAP', 'Responsive Design', 'Next.js'],
    github: null,
    external: 'https://lucidmotors.com/air',
    featured: true,
    year: '2023',
    categories: ['web', 'design'],
    accentColor: '#5D76E0', // Lucid blue
    image: '/images/projects/lucid.jpg',
    vimeoId: '1085744412', // Example path, would be replaced with actual video
  },
  {
    id: 'sutter-scout',
    title: 'Sutter Scout Mental Health App',
    company: 'Code and Theory',
    description:
      'Developed Sutter Scout, an application designed to promote mental well-being for young adults and teenagers with a focus on accessibility and engagement.',
    technologies: ['React', 'TypeScript', 'Accessibility', 'Animation', 'WCAG Compliance', 'Redux'],
    github: null,
    external: 'https://scout.sutterhealth.org/',
    featured: true,
    year: '2022-2023',
    categories: ['web', 'design'],
    accentColor: '#6283EF', // Sutter blue
    image: '/images/projects/sutter.jpg',
    vimeoId: '940988114', // Sutter Health Visual System video,
  },
  {
    id: 'mayo-components',
    title: 'Reusable Component Library',
    company: 'Mayo Clinic / Code and Theory',
    description:
      'Created a comprehensive reusable component library for Mayo Clinic that reduced development time across projects by 30% while ensuring consistent design and accessibility.',
    technologies: ['React', 'TypeScript', 'Storybook', 'SCSS Modules', 'Accessibility', 'Jest'],
    github: null,
    external: null,
    featured: false,
    year: '2022',
    categories: ['web', 'design'],
    accentColor: '#0057B8', // Mayo blue
    image: '/images/projects/component-library.jpg',
  },
  {
    id: 'elevate',
    title: 'Elevate Credit Platform',
    company: 'Code and Theory',
    description:
      'Developed the frontend for Elevate Credit, providing online credit solutions to non-prime consumers with a focus on user experience and accessibility.',
    technologies: ['React', 'JavaScript', 'SCSS', 'Responsive Design', 'Webpack'],
    github: null,
    external: 'https://www.elevate.com/',
    featured: false,
    year: '2021-2022',
    categories: ['web'],
    accentColor: '#E22626', // Elevate red
    image: '/images/projects/elevate.jpg',
  },
  {
    id: 'data-importer',
    title: 'Data Importer Tool',
    company: 'FactSet',
    description:
      'Developed and optimized a data import system that reduced integration time by 35%, streamlining workflows for financial data integration.',
    technologies: ['JavaScript', 'NodeJS', 'Oracle SQL', 'REST APIs', 'Docker'],
    github: null,
    external: 'https://www.factset.com/services/data-delivery',
    featured: false,
    year: '2020-2021',
    categories: ['web', 'automation'],
    accentColor: '#007DBC', // FactSet blue
    image: '/images/projects/data-importer.jpg',
  },
  {
    id: 'prime-terminal',
    title: 'Prime Terminal Financial Platform',
    company: 'FactSet',
    description:
      'Contributed to the Prime Terminal trading platform by optimizing client-facing endpoints and reducing query latency by 40%, enhancing client satisfaction.',
    technologies: ['JavaScript', 'React', 'NodeJS', 'SQL', 'WebSockets', 'D3.js'],
    github: null,
    external: 'https://www.primeterminal-ms.com/www/features.html',
    featured: false,
    year: '2019-2020',
    categories: ['web'],
    accentColor: '#007DBC', // FactSet blue
    image: '/images/projects/prime-terminal.jpg',
  },
  {
    id: 'funds-tool',
    title: 'Financial Data Visualization Tool',
    company: 'FactSet',
    description:
      'Created a powerful data visualization tool that enabled financial analysts to visualize complex data sets, perform trend analysis, and generate custom reports.',
    technologies: ['JavaScript', 'D3.js', 'Node.js', 'Express', 'SQL', 'RESTful APIs'],
    github: null,
    external: null,
    featured: false,
    year: '2018-2019',
    categories: ['web', 'design'],
    accentColor: '#007DBC', // FactSet blue
    image: '/images/projects/financial-viz.jpg',
  },
  {
    id: 'mdm-automation',
    title: 'Mobile Device Management System',
    company: 'Infosys',
    description:
      'Developed a mobile device management system that improved employee productivity by 25% and streamlined IT asset tracking and provisioning.',
    technologies: ['Java', 'Angular', 'Spring Boot', 'RESTful APIs', 'Mobile Development'],
    github: null,
    external: null,
    featured: false,
    year: '2017-2018',
    categories: ['web', 'mobile', 'automation'],
    accentColor: '#0C7CD5', // Infosys blue
    image: '/images/projects/mdm-system.jpg',
  },
  {
    id: 'report-tool',
    title: 'Automated Reporting System',
    company: 'Infosys',
    description:
      'Automated report generation for 80+ production applications, reducing manual effort from 1 hour to 5 minutes and improving operational efficiency by 90%.',
    technologies: ['Java', 'Spring Boot', 'Selenium', 'SQL', 'React', 'Chart.js'],
    github: null,
    external: null,
    featured: false,
    year: '2016-2017',
    categories: ['web', 'automation'],
    accentColor: '#0C7CD5', // Infosys blue
    image: '/images/projects/reporting-system.jpg',
  },
  {
    id: 'pwc-assessment',
    title: 'Partner Assessment Tool',
    company: 'Infosys (for PwC)',
    description:
      'Built a comprehensive assessment platform for PwC partners, enabling streamlined evaluation processes and performance tracking across multiple dimensions.',
    technologies: ['JavaScript', 'Angular', 'Java', 'Spring', 'SQL', 'RESTful APIs'],
    github: null,
    external: null,
    featured: false,
    year: '2016',
    categories: ['web'],
    accentColor: '#0C7CD5', // Infosys blue with PwC influence
    image: '/images/projects/assessment-tool.jpg',
  },
];
