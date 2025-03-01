import { AnalysisResult, Article, BiasResult, FactCheckResult, DetailedFactualScores } from '../types';
import { supabase } from '../lib/supabase';
import axios from 'axios';
import { analyzeText, TextAnalysis } from './nlpUtils';

const SAPLING_API_KEY = import.meta.env.VITE_SAPLING_API_KEY;
const CLAIMBUSTER_API_KEY = import.meta.env.VITE_CLAIMBUSTER_API_KEY;

// Define reliable source patterns
const RELIABLE_SOURCES = {
  government: [
    /\.gov\.(sg|uk|us|au|nz|ca)$/,
    /\.edu\.(sg|au|uk)$/,
    /\.ac\.(uk|jp|nz)$/,
    /\.mil$/
  ],
  international: [
    /who\.int$/,
    /un\.org$/,
    /unesco\.org$/,
    /worldbank\.org$/,
    /imf\.org$/
  ],
  education: [
    /nus\.edu\.sg$/,
    /ntu\.edu\.sg$/,
    /smu\.edu\.sg$/,
    /sutd\.edu\.sg$/,
    /mit\.edu$/,
    /harvard\.edu$/,
    /stanford\.edu$/,
    /oxford\.ac\.uk$/,
    /cambridge\.ac\.uk$/
  ],
  news: [
    /reuters\.com$/,
    /bbc\.(com|co\.uk)$/,
    /cnn\.com$/,
    /straitstimes\.com$/,
    /channelnewsasia\.com$/,
    /bloomberg\.com$/,
    /nytimes\.com$/,
    /washingtonpost\.com$/,
    /theguardian\.com$/,
    /ap\.org$/,
    /economist\.com$/
  ],
  scientific: [
    /nature\.com$/,
    /science\.org$/,
    /sciencedirect\.com$/,
    /springer\.com$/,
    /lancet\.com$/,
    /nejm\.org$/
  ]
};

interface SourceAnalysis {
  isReliable: boolean;
  category?: string;
  confidence: number;
  explanation: string;
}

function analyzeSourceReliability(source?: string): SourceAnalysis {
  if (!source) {
    return {
      isReliable: false,
      confidence: 0.5,
      explanation: 'No source URL provided for verification.'
    };
  }

  try {
    // Extract domain from URL
    const domain = new URL(source).hostname.toLowerCase();
    
    // Check against each category of reliable sources
    for (const [category, patterns] of Object.entries(RELIABLE_SOURCES)) {
      for (const pattern of patterns) {
        if (pattern.test(domain)) {
          return {
            isReliable: true,
            category,
            confidence: getSourceConfidence(category),
            explanation: generateSourceExplanation(domain, category, true)
          };
        }
      }
    }

    // Check for common news site patterns
    if (domain.includes('news') || domain.includes('times') || domain.includes('daily')) {
      return {
        isReliable: false,
        confidence: 0.6,
        explanation: `The source "${domain}" appears to be a news site but is not in our list of verified reliable sources.`
      };
    }

    return {
      isReliable: false,
      confidence: 0.7,
      explanation: `The source "${domain}" is not recognized as a verified reliable source.`
    };
  } catch (error) {
    // Invalid URL format
    return {
      isReliable: false,
      confidence: 0.5,
      explanation: 'Invalid source URL format.'
    };
  }
}

function getSourceConfidence(category: string): number {
  // Assign confidence scores based on source category
  switch (category) {
    case 'government':
      return 0.95;
    case 'international':
      return 0.95;
    case 'education':
      return 0.9;
    case 'scientific':
      return 0.95;
    case 'news':
      return 0.85;
    default:
      return 0.7;
  }
}

function generateSourceExplanation(domain: string, category: string, isReliable: boolean): string {
  if (isReliable) {
    switch (category) {
      case 'government':
        return `Source "${domain}" is a verified government domain with high credibility.`;
      case 'international':
        return `Source "${domain}" is a recognized international organization with high credibility.`;
      case 'education':
        return `Source "${domain}" is a verified educational institution with strong academic credibility.`;
      case 'scientific':
        return `Source "${domain}" is a reputable scientific publication or research institution.`;
      case 'news':
        return `Source "${domain}" is a well-established news organization with credible reporting standards.`;
      default:
        return `Source "${domain}" is verified as reliable.`;
    }
  }
  return `Source "${domain}" requires additional verification.`;
}

// Function to detect AI-generated content using Sapling API
async function detectAIContent(text: string): Promise<{
  isAIGenerated: boolean;
  confidence: number;
  details?: any;
}> {
  try {
    console.log('Sending request to Sapling API...');
    const response = await axios.request({
      method: 'POST',
      url: 'https://api.sapling.ai/api/v1/aidetect',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        key: SAPLING_API_KEY,
        text: text
      },
    });

    console.log('Sapling API Response:', response.data);

    // The API returns a single score between 0 and 1
    if (response.data && typeof response.data.score === 'number') {
      const score = response.data.score;
      console.log('AI Detection Score:', score);
      
      return {
        isAIGenerated: score > 0.8, // Consider AI-generated if score > 0.8 (80%)
        confidence: score,
        details: {
          score: score,
          sentence_scores: response.data.sentence_scores,
          token_probs: response.data.token_probs
        }
      };
    } else {
      console.error('Unexpected API response structure:', response.data);
      return {
        isAIGenerated: false,
        confidence: 0,
        details: { error: 'Invalid API response structure' }
      };
    }
  } catch (error) {
    console.error('Error detecting AI content:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        data: error.response?.data
      });
    }
    return {
      isAIGenerated: false,
      confidence: 0,
      details: { error: 'AI detection failed' }
    };
  }
}

// Function to detect check-worthy claims using ClaimBuster API
async function detectClaimsWithClaimBuster(text: string): Promise<Array<{
  text: string;
  score: number;
}>> {
  try {
    console.log('Sending request to ClaimBuster API...');
    const response = await axios.request({
      method: 'GET',
      url: 'https://idir.uta.edu/claimbuster/api/v2/score/text/',
      headers: {
        'x-api-key': CLAIMBUSTER_API_KEY,
      },
      params: {
        text: text
      }
    });

    console.log('ClaimBuster API Response:', response.data);

    if (response.data && Array.isArray(response.data)) {
      return response.data.map((claim: any) => ({
        text: claim.text,
        score: claim.score
      }));
    }

    return [];
  } catch (error) {
    console.error('Error detecting claims:', error);
    if (axios.isAxiosError(error)) {
      console.error('API Error Details:', {
        status: error.response?.status,
        data: error.response?.data
      });
    }
    return [];
  }
}

// Main analysis function that combines AI detection and bias analysis
export const analyzeArticle = async (article: Article): Promise<AnalysisResult> => {
  // Detect AI-generated content
  const aiDetectionResult = await detectAIContent(article.content);

  // Analyze title and content separately for bias
  const titleAnalysis = analyzeText(article.title);
  const contentAnalysis = analyzeText(article.content);

  // Analyze source reliability
  const sourceAnalysis = analyzeSourceReliability(article.source);

  // Analyze bias based on emotional language and opinion indicators
  const biases: BiasResult[] = analyzeBias(titleAnalysis, contentAnalysis);

  // Analyze factual accuracy based on citations and factual indicators
  const factCheck: FactCheckResult[] = await analyzeFactualAccuracy(titleAnalysis, contentAnalysis, article);

  // Calculate overall scores
  const overallBiasScore = calculateOverallBiasScore(titleAnalysis, contentAnalysis);
  const { score: overallFactualScore, detailedScores } = calculateOverallFactualScore(titleAnalysis, contentAnalysis, factCheck, sourceAnalysis);

  const result: AnalysisResult = {
    biases,
    factCheck,
    overallBiasScore,
    overallFactualScore,
    detailedFactualScores: detailedScores,
    aiDetection: {
      isAIGenerated: aiDetectionResult.isAIGenerated,
      confidence: aiDetectionResult.confidence
    },
    sourceReliability: {
      isReliable: sourceAnalysis.isReliable,
      confidence: sourceAnalysis.confidence,
      category: sourceAnalysis.category,
      explanation: sourceAnalysis.explanation
    },
    summary: generateSummary(
      overallBiasScore, 
      overallFactualScore, 
      aiDetectionResult.isAIGenerated, 
      biases, 
      factCheck,
      sourceAnalysis
    )
  };

  return result;
};

const analyzeBias = (titleAnalysis: TextAnalysis, contentAnalysis: TextAnalysis): BiasResult[] => {
  const biases: BiasResult[] = [];

  // Political and ideological bias detection
  const politicalBias = detectPoliticalBias(titleAnalysis, contentAnalysis);
  if (politicalBias.score > 0.3) {
    biases.push(politicalBias);
  }

  // Emotional bias detection
  const emotionalBias = {
    category: 'emotional',
    score: (
      titleAnalysis.emotionalLanguage.score * 1.5 + 
      contentAnalysis.emotionalLanguage.score + 
      contentAnalysis.sensationalism.score
    ) / 3,
    explanation: generateEmotionalBiasExplanation(titleAnalysis, contentAnalysis)
  };
  if (emotionalBias.score > 0.3) {
    biases.push(emotionalBias);
  }

  // Balance bias detection (lack of multiple viewpoints)
  const balanceBias = {
    category: 'balance',
    score: 1 - ((titleAnalysis.balancedReporting.score + contentAnalysis.balancedReporting.score * 2) / 3),
    explanation: generateBalanceBiasExplanation(titleAnalysis, contentAnalysis)
  };
  if (balanceBias.score > 0.4) {
    biases.push(balanceBias);
  }

  // Demographic bias detection
  if (contentAnalysis.demographicBias.score > 0.3) {
    biases.push({
      category: 'demographic',
      score: contentAnalysis.demographicBias.score,
      explanation: generateDemographicBiasExplanation(contentAnalysis)
    });
  }

  // Sensationalism bias detection
  if (contentAnalysis.sensationalism.score > 0.4) {
    biases.push({
      category: 'sensationalism',
      score: contentAnalysis.sensationalism.score,
      explanation: generateSensationalismExplanation(titleAnalysis, contentAnalysis)
    });
  }

  return biases;
};

const detectPoliticalBias = (titleAnalysis: TextAnalysis, contentAnalysis: TextAnalysis): BiasResult => {
  const emotionalScore = (titleAnalysis.emotionalLanguage.score + contentAnalysis.emotionalLanguage.score) / 2;
  const opinionScore = (titleAnalysis.opinionLanguage.score + contentAnalysis.opinionLanguage.score) / 2;
  const balanceScore = 1 - ((titleAnalysis.balancedReporting.score + contentAnalysis.balancedReporting.score) / 2);
  const ideologicalScore = contentAnalysis.ideologicalBias.score;
  
  return {
    category: 'political',
    score: (emotionalScore + opinionScore + balanceScore + ideologicalScore) / 4,
    explanation: generatePoliticalBiasExplanation(titleAnalysis, contentAnalysis)
  };
};

const analyzeFactualAccuracy = async (titleAnalysis: TextAnalysis, contentAnalysis: TextAnalysis, article: Article): Promise<FactCheckResult[]> => {
  const factChecks: FactCheckResult[] = [];

  // Check for presence of citations and factual support
  const citationScore = contentAnalysis.factualSupport.citations.length / 5; // Normalize by expecting ~5 citations
  const factualPhrasesScore = contentAnalysis.factualSupport.factualPhrases.length / 10; // Normalize by expecting ~10 factual phrases

  factChecks.push({
    isFactual: citationScore > 0.5,
    confidence: Math.min(citationScore, 1),
    explanation: `Article ${citationScore > 0.5 ? 'includes' : 'lacks'} sufficient citations and source attributions.`
  });

  // Check for balanced reporting
  const balanceScore = contentAnalysis.balancedReporting.score;
  factChecks.push({
    isFactual: balanceScore > 0.6,
    confidence: balanceScore,
    explanation: balanceScore > 0.6 
      ? 'Presents multiple viewpoints and balanced perspectives.'
      : 'Shows potential bias in presentation of facts and perspectives.'
  });

  // Use ClaimBuster to identify and analyze check-worthy claims
  const claims = await detectClaimsWithClaimBuster(article.content);
  const significantClaims = claims.filter(claim => claim.score > 0.7); // Only consider highly check-worthy claims

  if (significantClaims.length > 0) {
    // Add fact-check results for significant claims
    significantClaims.slice(0, 3).forEach(claim => { // Limit to top 3 most check-worthy claims
      factChecks.push({
        isFactual: claim.score < 0.9, // Consider very high scores (>0.9) as potentially questionable claims
        confidence: claim.score,
        explanation: `Check-worthy claim identified: "${claim.text.slice(0, 100)}..." - This claim requires verification.`
      });
    });
  }

  return factChecks;
};

const calculateOverallBiasScore = (titleAnalysis: TextAnalysis, contentAnalysis: TextAnalysis): number => {
  // Weight different factors
  const weights = {
    titleEmotional: 0.15,
    contentEmotional: 0.2,
    titleOpinion: 0.1,
    contentOpinion: 0.15,
    balancedReporting: 0.15,
    ideological: 0.1,
    demographic: 0.1,
    sensationalism: 0.05
  };

  return (
    titleAnalysis.emotionalLanguage.score * weights.titleEmotional +
    contentAnalysis.emotionalLanguage.score * weights.contentEmotional +
    titleAnalysis.opinionLanguage.score * weights.titleOpinion +
    contentAnalysis.opinionLanguage.score * weights.contentOpinion +
    (1 - contentAnalysis.balancedReporting.score) * weights.balancedReporting +
    contentAnalysis.ideologicalBias.score * weights.ideological +
    contentAnalysis.demographicBias.score * weights.demographic +
    contentAnalysis.sensationalism.score * weights.sensationalism
  );
};

const calculateOverallFactualScore = (
  titleAnalysis: TextAnalysis, 
  contentAnalysis: TextAnalysis,
  factCheckResults: FactCheckResult[],
  sourceAnalysis: SourceAnalysis
): { score: number; detailedScores: DetailedFactualScores } => {
  // Weight different factors
  const weights = {
    sourceReliability: 0.4,    // Source reliability weight
    citations: 0.1,            // Citations weight reduced
    factualPhrases: 0.25,      // Factual phrases weight
    balancedReporting: 0.15,   // Balanced reporting weight
    claimVerification: 0.1     // Claim verification weight
  };

  // Get claim verification scores
  const claimResults = factCheckResults.filter(result => 
    result.explanation.includes('Check-worthy claim')
  );
  const claimScore = claimResults.length > 0
    ? claimResults.reduce((sum, claim) => sum + claim.confidence, 0) / claimResults.length
    : 0.5;

  // Calculate individual scores
  const sourceReliabilityScore = sourceAnalysis.confidence;
  const citationScore = contentAnalysis.factualSupport.score;
  
  // Calculate factual phrases score based on the ratio of factual content
  const factualPhrases = contentAnalysis.factualSupport.factualPhrases.length;
  const totalPhrases = Math.max(factualPhrases, 1); // Ensure we don't divide by zero
  const factualPhrasesScore = Math.min(factualPhrases / (totalPhrases * 0.7), 1); // Expect about 70% of phrases to be factual
  
  const balanceScore = contentAnalysis.balancedReporting.score;

  // Calculate the weighted overall score
  const overallScore = (
    sourceReliabilityScore * weights.sourceReliability +
    citationScore * weights.citations +
    factualPhrasesScore * weights.factualPhrases +
    balanceScore * weights.balancedReporting +
    claimScore * weights.claimVerification
  );

  return {
    score: overallScore,
    detailedScores: {
      sourceReliabilityScore,
      citationScore,
      factualPhrasesScore,
      balanceScore,
      claimScore
    }
  };
};

const generateSummary = (
  biasScore: number,
  factualScore: number,
  isAIGenerated: boolean,
  biases: BiasResult[],
  factChecks: FactCheckResult[],
  sourceAnalysis: SourceAnalysis
): string => {
  let summary = '';
  
  // AI detection warning
  if (isAIGenerated) {
    summary += 'WARNING: This content appears to be AI-generated. ';
  }

  // Source reliability assessment
  if (sourceAnalysis.isReliable) {
    summary += `The source is ${sourceAnalysis.category ? `a verified ${sourceAnalysis.category} source` : 'verified'} with high credibility. `;
  } else if (sourceAnalysis.confidence < 0.6) {
    summary += 'The source requires verification and may not be reliable. ';
  } else {
    summary += 'The source is not recognized as a verified reliable source. ';
  }
  
  // Bias assessment
  if (biasScore > 0.7) {
    summary += 'This article shows significant bias, particularly in ';
    summary += biases.map(b => b.category).join(' and ') + '. ';
  } else if (biasScore > 0.4) {
    summary += 'This article shows moderate bias. ';
    if (biases.length > 0) {
      summary += `Main concerns are in ${biases[0].category} presentation. `;
    }
  } else {
    summary += 'This article shows minimal bias. ';
  }

  // Factual assessment with more user-friendly explanation
  summary += '\n\nFactual Accuracy Analysis: ';
  if (factualScore < 0.3) {
    summary += 'Our analysis shows that this article needs more factual support. We recommend looking for additional sources to verify the information. The article would benefit from more citations, balanced viewpoints, and verified claims. ';
  } else if (factualScore < 0.7) {
    summary += 'The article presents some factual information but could be stronger. While some claims are supported, others need more verification. Consider checking additional sources to confirm the key points. ';
  } else {
    summary += 'This article demonstrates strong factual accuracy. It includes proper citations, balanced reporting, and claims that can be verified through reliable sources. The information appears to be well-researched and trustworthy. ';
  }

  return summary;
};

const generateEmotionalBiasExplanation = (title: TextAnalysis, content: TextAnalysis): string => {
  const emotionalWords = [
    ...content.emotionalLanguage.positive,
    ...content.emotionalLanguage.negative,
    ...content.emotionalLanguage.loaded
  ].slice(0, 3);

  let explanation = `Uses emotionally charged language (e.g., "${emotionalWords.join('", "')}")`;
  
  if (content.sensationalism.score > 0.3) {
    explanation += ` and sensational terms (e.g., "${content.sensationalism.phrases.slice(0, 2).join('", "')}").`;
  } else {
    explanation += ' that may influence reader perception.';
  }

  return explanation;
};

const generateBalanceBiasExplanation = (title: TextAnalysis, content: TextAnalysis): string => {
  return content.balancedReporting.phrases.length === 0
    ? 'Presents a one-sided view without adequate representation of alternative perspectives.'
    : `Shows some balance with ${content.balancedReporting.phrases.length} contrasting viewpoints, but could be more comprehensive.`;
};

const generatePoliticalBiasExplanation = (title: TextAnalysis, content: TextAnalysis): string => {
  const hasEmotional = content.emotionalLanguage.score > 0.5;
  const hasOpinion = content.opinionLanguage.score > 0.5;
  const hasBalance = content.balancedReporting.score > 0.5;
  const ideologicalBias = content.ideologicalBias;

  let explanation = '';

  if (ideologicalBias.dominantBias) {
    const biasTerms = ideologicalBias.dominantBias === 'conservative' 
      ? ideologicalBias.conservative 
      : ideologicalBias.liberal;
    
    explanation = `Shows ${ideologicalBias.dominantBias} bias through terms like "${biasTerms.slice(0, 2).join('", "')}". `;
  }

  if (hasEmotional && !hasBalance) {
    explanation += 'Uses emotionally charged political language without balanced presentation of different viewpoints. ';
  } else if (hasOpinion && !hasBalance) {
    explanation += 'Presents political opinions as facts without adequate supporting evidence or alternative views. ';
  }

  return explanation || 'Shows potential political bias in language choice and presentation style.';
};

const generateDemographicBiasExplanation = (content: TextAnalysis): string => {
  const { gender, age, socioeconomic, cultural } = content.demographicBias;
  const biasTypes: string[] = [];
  let examples: string[] = [];

  if (gender.length > 0) {
    biasTypes.push('gender');
    examples = examples.concat(gender.slice(0, 1));
  }
  if (age.length > 0) {
    biasTypes.push('age');
    examples = examples.concat(age.slice(0, 1));
  }
  if (socioeconomic.length > 0) {
    biasTypes.push('socioeconomic');
    examples = examples.concat(socioeconomic.slice(0, 1));
  }
  if (cultural.length > 0) {
    biasTypes.push('cultural');
    examples = examples.concat(cultural.slice(0, 1));
  }

  if (biasTypes.length === 0) return 'Shows subtle demographic bias in language choices.';

  return `Contains ${biasTypes.join(' and ')} bias through phrases like "${examples.join('", "')}"`;
};

const generateSensationalismExplanation = (title: TextAnalysis, content: TextAnalysis): string => {
  const sensationalPhrases = content.sensationalism.phrases.slice(0, 2);
  return `Uses sensational language (e.g., "${sensationalPhrases.join('", "')}") that may exaggerate or dramatize the content.`;
};

export const getExampleArticle = (): Article => {
  return {
    title: "New Study Reveals Surprising Economic Trends",
    content: `In a groundbreaking study released yesterday, economists have discovered that recent policy changes have had a dramatic impact on middle-class families. The controversial findings suggest that the current administration's approach has failed to address key concerns of everyday citizens.

    Dr. Jane Smith, lead researcher on the study, stated that "the data clearly shows a pattern that many political leaders are choosing to ignore." Critics, however, have questioned the methodology of the study, pointing out potential flaws in data collection.
    
    Meanwhile, supporters of the current policies argue that the study fails to account for long-term benefits that will eventually reach all economic classes. "This is just another example of biased research pushing a specific agenda," said government spokesperson John Davis.
    
    The study comes at a critical time as lawmakers debate the next phase of economic legislation, with billions of dollars at stake and millions of lives potentially affected by the outcome.`,
    source: "Example News Network",
    author: "Sample Author",
    date: new Date().toISOString().split('T')[0]
  };
};

// Function to save analysis history to Supabase
export const saveAnalysisHistory = async (
  userId: string,
  article: Article,
  results: AnalysisResult
): Promise<boolean> => {
  try {
    // First save the article
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .insert({
        title: article.title,
        content: article.content,
        source: article.source || null,
        author: article.author || null,
        date: article.date || null,
        user_id: userId
      })
      .select()
      .single();

    if (articleError) throw articleError;

    // Then save the analysis results
    const { data: analysisData, error: analysisError } = await supabase
      .from('analysis_results')
      .insert({
        article_id: articleData.id,
        overall_bias_score: results.overallBiasScore,
        overall_factual_score: results.overallFactualScore,
        summary: results.summary,
        user_id: userId
      })
      .select()
      .single();

    if (analysisError) throw analysisError;

    // Save individual biases
    for (const bias of results.biases) {
      const { error: biasError } = await supabase
        .from('biases')
        .insert({
          analysis_id: analysisData.id,
          category: bias.category,
          score: bias.score,
          explanation: bias.explanation
        });

      if (biasError) throw biasError;
    }

    // Save individual fact checks
    for (const fact of results.factCheck) {
      const { error: factError } = await supabase
        .from('fact_checks')
        .insert({
          analysis_id: analysisData.id,
          is_factual: fact.isFactual,
          confidence: fact.confidence,
          explanation: fact.explanation
        });

      if (factError) throw factError;
    }

    return true;
  } catch (error) {
    console.error('Error saving analysis history:', error);
    return false;
  }
};

// Function to fetch user's analysis history
export const fetchAnalysisHistory = async (userId: string) => {
  try {
    const { data: articles, error } = await supabase
      .from('articles')
      .select(`
        id,
        title,
        created_at,
        analysis_results (
          id,
          overall_bias_score,
          overall_factual_score,
          summary
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return articles;
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    return [];
  }
};