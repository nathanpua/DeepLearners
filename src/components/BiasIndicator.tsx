import React from 'react';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface BiasIndicatorProps {
  score: number;
  type: 'bias' | 'factual';
}

const BiasIndicator: React.FC<BiasIndicatorProps> = ({ score, type }) => {
  // Determine color and label based on score and type
  let color = '';
  let label = '';
  let icon = null;

  if (type === 'bias') {
    if (score < 0.3) {
      color = 'bg-green-500';
      label = 'Low Bias';
      icon = <CheckCircle className="text-white" size={20} />;
    } else if (score < 0.7) {
      color = 'bg-yellow-500';
      label = 'Moderate Bias';
      icon = <AlertTriangle className="text-white" size={20} />;
    } else {
      color = 'bg-red-500';
      label = 'High Bias';
      icon = <AlertTriangle className="text-white" size={20} />;
    }
  } else {
    if (score > 0.7) {
      color = 'bg-green-500';
      label = 'Highly Factual';
      icon = <CheckCircle className="text-white" size={20} />;
    } else if (score > 0.3) {
      color = 'bg-yellow-500';
      label = 'Partially Factual';
      icon = <Info className="text-white" size={20} />;
    } else {
      color = 'bg-red-500';
      label = 'Low Factual';
      icon = <AlertTriangle className="text-white" size={20} />;
    }
  }

  // Calculate width for progress bar
  const width = `${score * 100}%`;

  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">
          {type === 'bias' ? 'Bias Level' : 'Factual Accuracy'}
        </span>
        <div className="flex items-center">
          <div className={`px-2 py-1 rounded-md ${color} flex items-center`}>
            {icon}
            <span className="ml-1 text-xs font-medium text-white">{label}</span>
          </div>
          <span className="ml-2 text-sm font-medium text-gray-700">
            {Math.round(score * 100)}%
          </span>
        </div>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={`h-2.5 rounded-full ${color}`} 
          style={{ width }}
        ></div>
      </div>
    </div>
  );
};

export default BiasIndicator;