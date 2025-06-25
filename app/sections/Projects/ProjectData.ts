// sections/ProjectsSection/projectData.ts

export type FilterCategory = 'all' | 'web' | 'mobile' | 'design' | 'automation';

export interface ProjectData {
  accentColor?: string;
  categories: FilterCategory[];
  company: string;
  description: string;
  disclaimerCompanies?: string;
  external?: string | null;
  featured: boolean;
  // Vimeo video ID
  github?: string | null;
  height?: number;
  id: string;
  image?: string;
  technologies: string[];
  title: string;
  videoSrc?: string;
  // Local video source URL
  vimeoId?: string;
  width?: number;
  year: string;
}

export const projectData: ProjectData[] = [
  {
    accentColor: '#FFFFFF', // Lucid white
    categories: ['web', 'design'],
    company: 'Code and Theory',
    description:
      'Built the Air and Gravity product pages for Lucid Motors, focusing on smooth animations and responsive design to showcase luxury electric vehicles.',
    disclaimerCompanies: 'Code and Theory and Lucid Motors',
    external: 'https://www.codeandtheory.com/things-we-make/lucid-motors',
    featured: true,
    github: null,
    id: 'lucid-motors',
    image: '/images/projects/lucid.jpg',
    technologies: ['React', 'TypeScript', 'GSAP', 'Responsive Design', 'Next.js'],
    title: 'Lucid Motors Website',
    vimeoId: '1085744412', // Example path, would be replaced with actual video
    year: '2023',
  },
  {
    accentColor: '#FF5E60', // Sutter red
    categories: ['web', 'design'],
    company: 'Code and Theory',
    description:
      'Developed Sutter Scout, an application designed to promote mental well-being for young adults and teenagers with a focus on accessibility and engagement.',
    disclaimerCompanies: 'Code and Theory and Sutter',
    external: 'https://www.codeandtheory.com/things-we-make/sutter-health',
    featured: true,
    github: null,
    id: 'sutter-scout',
    image: '/images/projects/sutter.jpg',
    technologies: ['React', 'TypeScript', 'Accessibility', 'Animation', 'WCAG Compliance', 'Redux'],
    title: 'Sutter Scout Mental Health App',
    vimeoId: '940988114', // Sutter Health Visual System video,
    year: '2022-2023',
  },
  {
    accentColor: '#000000', // Mayo blue
    categories: ['web', 'design'],
    company: 'Mayo Clinic / Code and Theory',
    description:
      'Created a comprehensive reusable component library for Mayo Clinic that reduced development time across projects by 30% while ensuring consistent design and accessibility.',
    external: null,
    featured: false,
    github: null,
    height: 200,
    id: 'mayo-components',
    image: '/cnt_logo.jpeg',
    technologies: ['React', 'TypeScript', 'Storybook', 'SCSS Modules', 'Accessibility', 'Jest'],
    title: 'Reusable Component Library',
    width: 200,
    year: '2022',
  },
  {
    accentColor: '#33ccff', // Elevate blue
    categories: ['web'],
    company: 'Code and Theory',
    description:
      'Developed the frontend for Elevate Credit, providing online credit solutions to non-prime consumers with a focus on user experience and accessibility.',
    external: 'https://www.elevate.com/',
    featured: false,
    github: null,
    height: 200,
    id: 'elevate',
    image: '/cnt_logo.jpeg',
    technologies: ['React', 'JavaScript', 'SCSS', 'Responsive Design', 'Webpack'],
    title: 'Elevate Credit Platform',
    width: 200,
    year: '2021-2022',
  },
  {
    accentColor: '#00AEEF', // FactSet blue
    categories: ['web', 'automation'],
    company: 'FactSet',
    description:
      'Developed and optimized a data import system that reduced integration time by 35%, streamlining workflows for financial data integration.',
    external: 'https://www.factset.com/services/data-delivery',
    featured: false,
    github: null,
    height: 300,
    id: 'data-importer',
    image: '/Factset_logo.png',
    technologies: ['JavaScript', 'NodeJS', 'Oracle SQL', 'REST APIs', 'Docker'],
    title: 'Data Importer Tool',
    width: 300,
    year: '2020-2021',
  },
  {
    accentColor: '#00AEEF', // FactSet blue
    categories: ['web'],
    company: 'FactSet',
    description:
      'Contributed to the Prime Terminal trading platform by optimizing client-facing endpoints and reducing query latency by 40%, enhancing client satisfaction.',
    external: 'https://www.primeterminal-ms.com/www/features.html',
    featured: false,
    github: null,
    height: 300,
    id: 'prime-terminal',
    image: '/Factset_logo.png',
    technologies: ['JavaScript', 'React', 'NodeJS', 'SQL', 'WebSockets', 'D3.js'],
    title: 'Prime Terminal Financial Platform',
    width: 300,
    year: '2019-2020',
  },
  {
    accentColor: '#00AEEF', // FactSet blue
    categories: ['web', 'design'],
    company: 'FactSet',
    description:
      'Created a powerful data visualization tool that enabled financial analysts to visualize complex data sets, perform trend analysis, and generate custom reports.',
    external: null,
    featured: false,
    github: null,
    height: 300,
    id: 'funds-tool',
    image: '/Factset_logo.png',
    technologies: ['JavaScript', 'D3.js', 'Node.js', 'Express', 'SQL', 'RESTful APIs'],
    title: 'Financial Data Visualization Tool',
    width: 300,
    year: '2018-2019',
  },
  {
    accentColor: '#007CC3', // Infosys blue
    categories: ['web', 'mobile', 'automation'],
    company: 'Infosys',
    description:
      'Developed a mobile device management system that improved employee productivity by 25% and streamlined IT asset tracking and provisioning.',
    external: null,
    featured: false,
    github: null,
    height: 512,
    id: 'mdm-automation',
    image: '/Infosys_logo.png',
    technologies: ['Java', 'Angular', 'Spring Boot', 'RESTful APIs', 'Mobile Development'],
    title: 'Mobile Device Management System',
    width: 1280,
    year: '2017-2018',
  },
  {
    accentColor: '#007CC3', // Infosys blue
    categories: ['web', 'automation'],
    company: 'Infosys',
    description:
      'Automated report generation for 80+ production applications, reducing manual effort from 1 hour to 5 minutes and improving operational efficiency by 90%.',
    external: null,
    featured: false,
    github: null,
    height: 512,
    id: 'report-tool',
    image: '/Infosys_logo.png',
    technologies: ['Java', 'Spring Boot', 'Selenium', 'SQL', 'React', 'Chart.js'],
    title: 'Automated Reporting System',
    width: 1280,
    year: '2016-2017',
  },
  {
    accentColor: '#007CC3', // Infosys blue with PwC influence
    categories: ['web'],
    company: 'Infosys (for PwC)',
    description:
      'Built a comprehensive assessment platform for PwC partners, enabling streamlined evaluation processes and performance tracking across multiple dimensions.',
    external: null,
    featured: false,
    github: null,
    height: 512,
    id: 'pwc-assessment',
    image: '/Infosys_logo.png',
    technologies: ['JavaScript', 'Angular', 'Java', 'Spring', 'SQL', 'RESTful APIs'],
    title: 'Partner Assessment Tool',
    width: 1280,
    year: '2016',
  },
];
