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

const History: React.FC<HistoryProps> = ({ isAuthenticated, userId }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

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
        
        <HistoryList userId={userId} />
      </div>
    </div>
  );
};

export default History;