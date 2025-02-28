export interface BiasResult {
  score: number;
  category: BiasCategory;
  explanation: string;
}

export interface FactCheckResult {
  isFactual: boolean;
  confidence: number;
  explanation: string;
}

export interface AnalysisResult {
  biases: BiasResult[];
  factCheck: FactCheckResult[];
  overallBiasScore: number;
  overallFactualScore: number;
  summary: string;
}

export type BiasCategory = 
  | 'political' 
  | 'racial' 
  | 'gender' 
  | 'religious' 
  | 'socioeconomic' 
  | 'ageism' 
  | 'geographical';

export interface Article {
  title: string;
  content: string;
  source?: string;
  author?: string;
  date?: string;
}