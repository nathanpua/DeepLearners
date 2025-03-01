import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ArticleInput from './components/ArticleInput';
import AnalysisResults from './components/AnalysisResults';
import Auth from './components/Auth';
import ResourcesPage from './pages/ResourcesPage';
import FAQPage from './pages/FAQPage';
import AboutPage from './pages/AboutPage';
import { Article, AnalysisResult } from './types';
import { analyzeArticle } from './utils/analysisUtils';
import { supabase } from './lib/supabase';

function App() {
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<string>('home');

  useEffect(() => {
    // Check for existing session on load
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        setIsAuthenticated(true);
        setUserId(session.user.id);
      }
      
      setLoading(false);
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsAuthenticated(!!session);
        setUserId(session?.user.id || null);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleAnalyze = async (article: Article) => {
    if (!isAuthenticated || !userId) {
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // First save the article to Supabase
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

      // For demo purposes, we'll still use the mock analysis
      // In a real app, you might call an external API here
      const analysisResults = analyzeArticle(article);
      
      // Save the analysis results
      const { error: analysisError } = await supabase
        .from('analysis_results')
        .insert({
          article_id: articleData.id,
          overall_bias_score: analysisResults.overallBiasScore,
          overall_factual_score: analysisResults.overallFactualScore,
          summary: analysisResults.summary,
          user_id: userId
        })
        .select()
        .single();

      if (analysisError) throw analysisError;
      
      setResults(analysisResults);
    } catch (error) {
      console.error('Error analyzing article:', error);
      // In a real app, you would show an error message to the user
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    setUserId(null);
    setResults(null);
  };

  const navigateTo = (page: string) => {
    setCurrentPage(page);
    // Reset analysis results when navigating away from home
    if (page !== 'home') {
      setResults(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Header />
        <div className="flex-grow flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
        <Footer />
      </div>
    );
  }

  const renderContent = () => {
    if (currentPage === 'resources') {
      return <ResourcesPage />;
    } else if (currentPage === 'faq') {
      return <FAQPage />;
    } else if (currentPage === 'about') {
      return <AboutPage />;
    } else {
      // Home page content
      if (!isAuthenticated) {
        return <Auth onAuthChange={(status) => setIsAuthenticated(status)} />;
      } else if (isAnalyzing) {
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-lg text-gray-700">Analyzing article for bias and misinformation...</p>
          </div>
        );
      } else if (results) {
        return <AnalysisResults results={results} onReset={handleReset} />;
      } else {
        return (
          <>
            <div className="max-w-3xl mx-auto mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">How It Works</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mb-3">1</div>
                  <h3 className="font-semibold mb-2">Paste Your Article</h3>
                  <p className="text-gray-600 text-sm">Enter the title and content of any news article you want to analyze.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mb-3">2</div>
                  <h3 className="font-semibold mb-2">AI Analysis</h3>
                  <p className="text-gray-600 text-sm">Our algorithm scans for various types of bias and fact-checks key claims.</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow">
                  <div className="bg-blue-100 text-blue-800 w-8 h-8 rounded-full flex items-center justify-center mb-3">3</div>
                  <h3 className="font-semibold mb-2">Get Results</h3>
                  <p className="text-gray-600 text-sm">Review detailed analysis of potential biases and factual accuracy.</p>
                </div>
              </div>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <ArticleInput onAnalyze={handleAnalyze} />
            </div>
          </>
        );
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Header 
        isAuthenticated={isAuthenticated} 
        onSignOut={handleSignOut} 
        currentPage={currentPage}
        onNavigate={navigateTo}
      />
      
      <main className="container mx-auto px-4 flex-grow">
        {renderContent()}
      </main>
      
      <Footer onNavigate={navigateTo} />
    </div>
  );
}

export default App;