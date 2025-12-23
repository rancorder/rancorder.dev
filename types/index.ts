// types/index.ts（変更なし）
export type ProjectCategory = 'enterprise' | 'product' | 'infrastructure' | 'technical' | 'all';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: Exclude<ProjectCategory, 'all'>;
  technologies: string[];
  highlights: string[];
  pmDecisions?: string[];
  links?: {
    demo?: string;
    github?: string;
    article?: string;
  };
}

export interface SkillGroup {
  category: string;
  items: string[];
}
