import React, { useEffect, useState } from 'react';
import { fetchAnalysisHistory } from '../utils/analysisUtils';
import { Clock, ChevronRight, Calendar, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface HistoryItem {
  id: string;
  title: string;
  content: string;
  source: string | null;
  author: string | null;
  date: string | null;
  created_at: string;
  analysis_results: {
    id: string;
    overall_bias_score: number;
    overall_factual_score: number;
    summary: string;
  }[];
}

interface HistoryListProps {
  userId: string;
  onArticleClick: (article: any) => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ userId, onArticleClick }) => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      const data = await fetchAnalysisHistory(userId);
      setHistory(data || []);
      setLoading(false);
    };

    if (userId) {
      loadHistory();
    }
  }, [userId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleViewAnalysis = (articleId: string, analysisId: string) => {
    // In a future implementation, this would navigate to a detailed view
    // navigate(`/analysis/${analysisId}`);
    console.log(`Viewing analysis ${analysisId} for article ${articleId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center">
        <Clock size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Analysis History</h3>
        <p className="text-gray-500">
          You haven't analyzed any articles yet. Try analyzing an article to see your history here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {history.map((item) => (
        <div 
          key={item.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onArticleClick({
            id: item.id,
            article: {
              title: item.title,
              content: item.content,
              source: item.source,
              date: item.date
            },
            analysis_results: item.analysis_results[0] || {
              overall_bias_score: 0,
              overall_factual_score: 0,
              summary: ''
            },
            created_at: item.created_at
          })}
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">{item.title}</h3>
              <div className="flex items-center text-sm text-gray-500 mt-1 space-x-4">
                <span className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  Analyzed on {formatDate(item.created_at)}
                </span>
                {item.source && (
                  <span className="flex items-center">
                    <FileText size={14} className="mr-1" />
                    {item.source}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight className="text-gray-400" />
          </div>
          
          {item.analysis_results && item.analysis_results[0] && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Bias Score</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${getBiasColor(item.analysis_results[0].overall_bias_score)}`} 
                      style={{ width: `${item.analysis_results[0].overall_bias_score * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Factual Score</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div 
                      className={`h-2 rounded-full ${getFactualColor(item.analysis_results[0].overall_factual_score)}`} 
                      style={{ width: `${item.analysis_results[0].overall_factual_score * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                {item.analysis_results[0].summary}
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Helper functions for color determination
const getBiasColor = (score: number) => {
  if (score < 0.3) return 'bg-green-500';
  if (score < 0.7) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getFactualColor = (score: number) => {
  if (score > 0.7) return 'bg-green-500';
  if (score > 0.3) return 'bg-yellow-500';
  return 'bg-red-500';
};

export default HistoryList;