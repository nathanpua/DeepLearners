export interface Article {
    title: string;
    content: string;
    source?: string;
    author?: string;
    date?: string;
}

export interface BiasResult {
    category: string;
    score: number;
    explanation: string;
}

export interface FactCheckResult {
    isFactual: boolean;
    confidence: number;
    explanation: string;
}

export interface AIDetectionResult {
    isAIGenerated: boolean;
    confidence: number;
}

export interface SourceReliabilityResult {
    isReliable: boolean;
    confidence: number;
    category?: string;
    explanation: string;
}

export interface DetailedFactualScores {
    sourceReliabilityScore: number;
    citationScore: number;
    factualPhrasesScore: number;
    balanceScore: number;
    claimScore: number;
}

export interface AnalysisResult {
    summary: string;
    overallBiasScore: number;
    overallFactualScore: number;
    detailedFactualScores: DetailedFactualScores;
    biases: BiasResult[];
    factCheck: FactCheckResult[];
    aiDetection: AIDetectionResult;
    sourceReliability: SourceReliabilityResult;
}

export interface Database {
    public: {
        Tables: {
            articles: {
                Row: {
                    id: string;
                    created_at: string;
                    title: string;
                    content: string;
                    source: string | null;
                    author: string | null;
                    date: string | null;
                    user_id: string;
                };
                Insert: {
                    id?: string;
                    created_at?: string;
                    title: string;
                    content: string;
                    source?: string | null;
                    author?: string | null;
                    date?: string | null;
                    user_id: string;
                };
                Update: {
                    id?: string;
                    created_at?: string;
                    title?: string;
                    content?: string;
                    source?: string | null;
                    author?: string | null;
                    date?: string | null;
                    user_id?: string;
                };
            };
        };
    };
} 