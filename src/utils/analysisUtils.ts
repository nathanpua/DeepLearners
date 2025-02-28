import { AnalysisResult, Article, BiasResult, FactCheckResult } from '../types';
import { supabase } from '../lib/supabase';

// This is a mock implementation for demonstration purposes
// In a real application, this would connect to an API or use ML models
export const analyzeArticle = (article: Article): AnalysisResult => {
  // Mock bias detection
  const biases: BiasResult[] = [
    {
      category: 'political',
      score: Math.random() * 0.8,
      explanation: 'Uses politically charged language that leans toward a specific ideology.'
    },
    {
      category: 'socioeconomic',
      score: Math.random() * 0.6,
      explanation: 'Contains assumptions about economic classes without sufficient context.'
    }
  ];

  // Mock fact checking
  const factCheck: FactCheckResult[] = [
    {
      isFactual: Math.random() > 0.5,
      confidence: 0.7 + Math.random() * 0.3,
      explanation: 'Key statistics cited in the article require verification from primary sources.'
    },
    {
      isFactual: Math.random() > 0.3,
      confidence: 0.6 + Math.random() * 0.4,
      explanation: 'Historical context provided appears to be selectively presented.'
    }
  ];

  // Calculate overall scores
  const overallBiasScore = biases.reduce((sum, bias) => sum + bias.score, 0) / biases.length;
  const overallFactualScore = factCheck.reduce((sum, fact) => sum + (fact.isFactual ? fact.confidence : 0), 0) / factCheck.length;

  return {
    biases,
    factCheck,
    overallBiasScore,
    overallFactualScore,
    summary: generateSummary(overallBiasScore, overallFactualScore)
  };
};

const generateSummary = (biasScore: number, factualScore: number): string => {
  let summary = '';
  
  if (biasScore > 0.7) {
    summary += 'This article shows significant bias. ';
  } else if (biasScore > 0.4) {
    summary += 'This article shows moderate bias. ';
  } else {
    summary += 'This article shows minimal bias. ';
  }

  if (factualScore < 0.3) {
    summary += 'The factual accuracy is very low, suggesting potential misinformation.';
  } else if (factualScore < 0.7) {
    summary += 'The factual accuracy is questionable in some areas.';
  } else {
    summary += 'The factual accuracy appears to be generally reliable.';
  }

  return summary;
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