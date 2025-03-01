// Emotionally charged words that might indicate bias
const EMOTIONAL_WORDS = {
    positive: [
      'amazing', 'incredible', 'excellent', 'outstanding', 'remarkable',
      'fantastic', 'wonderful', 'brilliant', 'spectacular', 'extraordinary',
      'triumph', 'perfect', 'best', 'great', 'revolutionary',
      'innovative', 'exceptional', 'superb', 'magnificent', 'marvelous'
    ],
    negative: [
      'terrible', 'horrible', 'awful', 'disastrous', 'catastrophic',
      'failed', 'worst', 'incompetent', 'unacceptable', 'disappointing',
      'shocking', 'poor', 'bad', 'wrong', 'devastating',
      'pathetic', 'disgraceful', 'appalling', 'dreadful', 'inadequate'
    ],
    loaded: [
      'obviously', 'clearly', 'undoubtedly', 'certainly', 'absolutely',
      'definitely', 'everyone knows', 'without question', 'naturally',
      'of course', 'surely', 'always', 'never', 'must', 'ought',
      'indisputably', 'unquestionably', 'beyond doubt', 'plainly', 'evidently'
    ],
    sensational: [
      'shocking', 'explosive', 'stunning', 'dramatic', 'scandalous',
      'outrageous', 'bombshell', 'crisis', 'chaos', 'emergency',
      'unprecedented', 'groundbreaking', 'game-changing', 'revolutionary', 'historic'
    ]
  };
  
  // Words that suggest opinion rather than fact
  const OPINION_INDICATORS = [
    'believe', 'think', 'feel', 'suggest', 'seem',
    'appear', 'likely', 'probably', 'maybe', 'perhaps',
    'possibly', 'might', 'could', 'may', 'speculate',
    'assume', 'suspect', 'guess', 'estimate', 'presume',
    'opinion', 'perspective', 'viewpoint', 'stance', 'position'
  ];
  
  // Phrases that indicate balanced reporting
  const BALANCED_PHRASES = [
    'on the other hand', 'however', 'conversely', 'in contrast',
    'alternatively', 'despite this', 'nevertheless', 'nonetheless',
    'while', 'although', 'even though', 'contrary to', 'meanwhile',
    'critics argue', 'supporters say', 'some argue', 'others maintain',
    'proponents suggest', 'opponents claim', 'debates continue', 'evidence varies'
  ];
  
  // Words that suggest factual reporting
  const FACTUAL_INDICATORS = [
    'according to', 'research shows', 'data indicates', 'study finds',
    'evidence suggests', 'statistics show', 'records indicate',
    'survey reveals', 'analysis shows', 'results demonstrate',
    'researchers found', 'experts say', 'data shows', 'report states',
    'documented in', 'measured by', 'verified through', 'confirmed by'
  ];
  
  // Ideological bias indicators
  const IDEOLOGICAL_INDICATORS = {
    conservative: [
      'radical left', 'socialist agenda', 'liberal elite', 'mainstream media',
      'big government', 'job creators', 'tax burden', 'welfare state',
      'political correctness', 'cancel culture', 'woke', 'traditional values'
    ],
    liberal: [
      'right-wing', 'corporate greed', 'conservative agenda', 'alt-right',
      'big business', 'income inequality', 'systemic', 'privilege',
      'progressive', 'reform', 'equity', 'social justice'
    ]
  };
  
  // Demographic bias indicators
  const DEMOGRAPHIC_BIAS = {
    gender: [
      'typical woman', 'typical man', 'like a girl', 'like a man',
      'feminine', 'masculine', 'maternal', 'paternal', 'gender roles'
    ],
    age: [
      'millennials are', 'boomers are', 'young people today',
      'older generation', 'kids these days', 'back in my day'
    ],
    socioeconomic: [
      'elite', 'working class', 'poor people', 'rich people',
      'welfare recipients', 'job creators', 'inner city', 'coastal elite'
    ],
    cultural: [
      'those people', 'these people', 'their kind', 'urban', 'rural',
      'traditional', 'foreign', 'exotic', 'normal', 'regular'
    ]
  };
  
  // Common citation patterns
  const CITATION_PATTERNS = [
    /according to [^.]+/gi,
    /cited by [^.]+/gi,
    /quoted in [^.]+/gi,
    /reported by [^.]+/gi,
    /stated by [^.]+/gi,
    /"[^"]+" said [^.]+/gi,
    /"[^"]+" says [^.]+/gi,
    /study by [^.]+/gi,
    /research from [^.]+/gi,
    /data from [^.]+/gi
  ];
  
  export interface TextAnalysis {
    emotionalLanguage: {
      positive: string[];
      negative: string[];
      loaded: string[];
      sensational: string[];
      score: number;
    };
    opinionLanguage: {
      phrases: string[];
      score: number;
    };
    balancedReporting: {
      phrases: string[];
      score: number;
    };
    factualSupport: {
      citations: string[];
      factualPhrases: string[];
      score: number;
    };
    ideologicalBias: {
      conservative: string[];
      liberal: string[];
      score: number;
      dominantBias: string | null;
    };
    demographicBias: {
      gender: string[];
      age: string[];
      socioeconomic: string[];
      cultural: string[];
      score: number;
    };
    sensationalism: {
      phrases: string[];
      score: number;
    };
  }
  
  export const analyzeText = (text: string): TextAnalysis => {
    const words = text.toLowerCase().split(/\s+/);
    const sentences = text.split(/[.!?]+/).map(s => s.trim()).filter(s => s.length > 0);
    
    // Analyze emotional language
    const emotionalLanguage = {
      positive: findMatches(text, EMOTIONAL_WORDS.positive),
      negative: findMatches(text, EMOTIONAL_WORDS.negative),
      loaded: findMatches(text, EMOTIONAL_WORDS.loaded),
      sensational: findMatches(text, EMOTIONAL_WORDS.sensational),
      score: 0
    };
    
    // Calculate emotional language score (0-1)
    const totalEmotionalWords = emotionalLanguage.positive.length + 
      emotionalLanguage.negative.length + 
      emotionalLanguage.loaded.length +
      emotionalLanguage.sensational.length;
    emotionalLanguage.score = Math.min(totalEmotionalWords / (words.length * 0.1), 1);
  
    // Analyze opinion language
    const opinionPhrases = findMatches(text, OPINION_INDICATORS);
    const opinionScore = Math.min(opinionPhrases.length / (sentences.length * 0.3), 1);
  
    // Analyze balanced reporting
    const balancedPhrases = findMatches(text, BALANCED_PHRASES);
    const balancedScore = Math.min(balancedPhrases.length / (sentences.length * 0.2), 1);
  
    // Analyze factual support
    const citations = findCitations(text);
    const factualPhrases = findMatches(text, FACTUAL_INDICATORS);
    const factualScore = calculateFactualScore(citations.length, factualPhrases.length, sentences.length);
  
    // Analyze ideological bias
    const ideologicalBias = analyzeIdeologicalBias(text);
  
    // Analyze demographic bias
    const demographicBias = analyzeDemographicBias(text);
  
    // Analyze sensationalism
    const sensationalPhrases = findMatches(text, EMOTIONAL_WORDS.sensational);
    const sensationalismScore = Math.min(sensationalPhrases.length / (sentences.length * 0.15), 1);
  
    return {
      emotionalLanguage,
      opinionLanguage: {
        phrases: opinionPhrases,
        score: opinionScore
      },
      balancedReporting: {
        phrases: balancedPhrases,
        score: balancedScore
      },
      factualSupport: {
        citations,
        factualPhrases,
        score: factualScore
      },
      ideologicalBias,
      demographicBias,
      sensationalism: {
        phrases: sensationalPhrases,
        score: sensationalismScore
      }
    };
  };
  
  const analyzeIdeologicalBias = (text: string): {
    conservative: string[];
    liberal: string[];
    score: number;
    dominantBias: string | null;
  } => {
    const conservative = findMatches(text, IDEOLOGICAL_INDICATORS.conservative);
    const liberal = findMatches(text, IDEOLOGICAL_INDICATORS.liberal);
    
    const score = Math.min((conservative.length + liberal.length) * 0.2, 1);
    let dominantBias: string | null = null;
    
    if (conservative.length > liberal.length * 1.5) {
      dominantBias = 'conservative';
    } else if (liberal.length > conservative.length * 1.5) {
      dominantBias = 'liberal';
    }
  
    return { conservative, liberal, score, dominantBias };
  };
  
  const analyzeDemographicBias = (text: string): {
    gender: string[];
    age: string[];
    socioeconomic: string[];
    cultural: string[];
    score: number;
  } => {
    const gender = findMatches(text, DEMOGRAPHIC_BIAS.gender);
    const age = findMatches(text, DEMOGRAPHIC_BIAS.age);
    const socioeconomic = findMatches(text, DEMOGRAPHIC_BIAS.socioeconomic);
    const cultural = findMatches(text, DEMOGRAPHIC_BIAS.cultural);
    
    const totalBiases = gender.length + age.length + socioeconomic.length + cultural.length;
    const score = Math.min(totalBiases * 0.25, 1);
  
    return { gender, age, socioeconomic, cultural, score };
  };
  
  // Helper function to find matches in text
  const findMatches = (text: string, patterns: string[]): string[] => {
    const matches: string[] = [];
    const lowerText = text.toLowerCase();
    
    patterns.forEach(pattern => {
      const regex = new RegExp(`\\b${pattern}\\b`, 'gi');
      let match;
      while ((match = regex.exec(text)) !== null) {
        matches.push(match[0]);
      }
    });
    
    return matches;
  };
  
  // Helper function to find citations
  const findCitations = (text: string): string[] => {
    const citations: string[] = [];
    
    CITATION_PATTERNS.forEach(pattern => {
      let match;
      while ((match = pattern.exec(text)) !== null) {
        citations.push(match[0]);
      }
    });
    
    return citations;
  };
  
  // Helper function to calculate factual score
  const calculateFactualScore = (
    citationCount: number,
    factualPhraseCount: number,
    sentenceCount: number
  ): number => {
    // Calculate the ratio of sentences that contain factual indicators
    const factualRatio = factualPhraseCount / sentenceCount;
    
    // Consider citations as a bonus
    const citationBonus = Math.min(citationCount / 3, 1) * 0.2; // Up to 20% bonus for citations
    
    // Base score on factual ratio, but ensure it doesn't exceed 1
    const baseScore = Math.min(factualRatio * 1.5, 1);
    
    // Combine base score with citation bonus, capped at 1
    return Math.min(baseScore + citationBonus, 1);
  }; 