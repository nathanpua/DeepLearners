import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { fetchAnalysisHistory } from '../utils/analysisUtils';
import HistoryList from '../components/HistoryList';
import { Clock } from 'lucide-react';

interface HistoryProps {
  isAuthenticated: boolean;
  userId: string | null;
}

interface HistoryItem {
  id: string;
  article: {
    title: string;
    content: string;
    source?: string;
    date?: string;
  };
  analysis_results: {
    overall_bias_score: number;
    overall_factual_score: number;
    summary: string;
  };
  created_at: string;
}

const History: React.FC<HistoryProps> = ({ isAuthenticated, userId }) => {
  const navigate = useNavigate();
  const [selectedArticle, setSelectedArticle] = useState<HistoryItem | null>(null);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleArticleClick = (article: HistoryItem) => {
    setSelectedArticle(article);
  };

  const handleClose = () => {
    setSelectedArticle(null);
  };

  if (!isAuthenticated || !userId) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 flex items-center">
          <Clock className="mr-2" size={28} />
          Your Analysis History
        </h1>
        
        <HistoryList userId={userId} onArticleClick={handleArticleClick} />

        {/* Article View Modal */}
        {selectedArticle && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-800">{selectedArticle.article.title}</h2>
                <button 
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  {selectedArticle.article.source && `Source: ${selectedArticle.article.source}`}
                  {selectedArticle.article.date && ` • ${new Date(selectedArticle.article.date).toLocaleDateString()}`}
                </p>
              </div>

              <div className="prose max-w-none mb-6">
                <p>{selectedArticle.article.content}</p>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">Analysis Results</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-gray-700 mb-2">
                    <strong>Bias Score:</strong> {Math.round(selectedArticle.analysis_results.overall_bias_score * 100)}%
                  </p>
                  <p className="text-gray-700 mb-4">
                    <strong>Factual Score:</strong> {Math.round(selectedArticle.analysis_results.overall_factual_score * 100)}%
                  </p>
                  <p className="text-gray-700">
                    <strong>Summary:</strong> {selectedArticle.analysis_results.summary}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;