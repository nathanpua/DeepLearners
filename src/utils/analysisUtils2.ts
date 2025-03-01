import { AnalysisResult, Article, BiasResult, FactCheckResult } from '../types';
import { analyzeText, TextAnalysis } from './nlpUtils';
// import { supabase } from '../lib/supabase';

// This is a mock implementation for demonstration purposes
// In a real application, this would connect to an API or use ML models
export const analyzeArticle = (article: Article): AnalysisResult => {
  // Analyze title and content separately
  const titleAnalysis = analyzeText(article.title);
  const contentAnalysis = analyzeText(article.content);

  // Analyze bias based on emotional language and opinion indicators
  const biases: BiasResult[] = analyzeBias(titleAnalysis, contentAnalysis);

  // Analyze factual accuracy based on citations and factual indicators
  const factCheck: FactCheckResult[] = analyzeFactualAccuracy(titleAnalysis, contentAnalysis);

  // Calculate overall scores
  const overallBiasScore = calculateOverallBiasScore(titleAnalysis, contentAnalysis);
  const overallFactualScore = calculateOverallFactualScore(titleAnalysis, contentAnalysis);

  return {
    biases,
    factCheck,
    overallBiasScore,
    overallFactualScore,
    summary: generateSummary(overallBiasScore, overallFactualScore, biases, factCheck)
  };
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

const analyzeFactualAccuracy = (titleAnalysis: TextAnalysis, contentAnalysis: TextAnalysis): FactCheckResult[] => {
  const factChecks: FactCheckResult[] = [];

  // Source verification
  const sourceVerification: FactCheckResult = {
    isFactual: contentAnalysis.factualSupport.citations.length > 0,
    confidence: Math.min(contentAnalysis.factualSupport.citations.length * 0.2, 1),
    explanation: generateSourceVerificationExplanation(contentAnalysis)
  };
  factChecks.push(sourceVerification);

  // Statement verification
  const statementVerification: FactCheckResult = {
    isFactual: contentAnalysis.factualSupport.score > 0.5,
    confidence: contentAnalysis.factualSupport.score,
    explanation: generateStatementVerificationExplanation(contentAnalysis)
  };
  factChecks.push(statementVerification);

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

const calculateOverallFactualScore = (titleAnalysis: TextAnalysis, contentAnalysis: TextAnalysis): number => {
  // Weight different factors
  const weights = {
    citations: 0.4,
    factualPhrases: 0.3,
    balancedReporting: 0.3
  };

  return (
    contentAnalysis.factualSupport.score * weights.citations +
    (contentAnalysis.factualSupport.factualPhrases.length / 10) * weights.factualPhrases +
    contentAnalysis.balancedReporting.score * weights.balancedReporting
  );
};

const generateSummary = (
  biasScore: number,
  factualScore: number,
  biases: BiasResult[],
  factChecks: FactCheckResult[]
): string => {
  let summary = '';
  
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

  // Factual assessment
  if (factualScore < 0.3) {
    summary += 'The factual accuracy is very low, with insufficient source citations and verification. ';
  } else if (factualScore < 0.7) {
    summary += 'The factual accuracy is questionable in some areas. More source verification would improve credibility. ';
  } else {
    summary += 'The factual accuracy appears to be well-supported with proper citations and verifiable information. ';
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

const generateSourceVerificationExplanation = (content: TextAnalysis): string => {
  const citationCount = content.factualSupport.citations.length;
  if (citationCount === 0) {
    return 'No verifiable sources or citations found in the article.';
  } else if (citationCount < 3) {
    return `Limited source verification with only ${citationCount} citation(s).`;
  } else {
    return `Well-supported with ${citationCount} verifiable sources and citations.`;
  }
};

const generateStatementVerificationExplanation = (content: TextAnalysis): string => {
  const factualPhraseCount = content.factualSupport.factualPhrases.length;
  if (factualPhraseCount === 0) {
    return 'Makes claims without supporting evidence or factual indicators.';
  } else if (content.factualSupport.score < 0.5) {
    return 'Some statements are supported by evidence, but many claims lack verification.';
  } else {
    return 'Most statements are supported by evidence or verifiable sources.';
  }
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
  const sensationalPhrases = [
    ...title.sensationalism.phrases,
    ...content.sensationalism.phrases
  ].slice(0, 3);

  return `Uses sensational language (e.g., "${sensationalPhrases.join('", "')}") to dramatize the content.`;
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