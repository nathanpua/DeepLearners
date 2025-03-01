import React from 'react';
import { AnalysisResult, BiasResult, FactCheckResult } from '../types';
import BiasIndicator from './BiasIndicator';
import { AlertTriangle, CheckCircle, Info, Bot } from 'lucide-react';
import ShareButtons from './ShareButtons';

interface AnalysisResultsProps {
  results: AnalysisResult | null;
  onReset: () => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, onReset }) => {
  if (!results) return null;

  const getBiasIcon = (score: number) => {
    if (score < 0.3) return <CheckCircle className="text-green-500" size={16} />;
    if (score < 0.7) return <Info className="text-yellow-500" size={16} />;
    return <AlertTriangle className="text-red-500" size={16} />;
  };

  const getFactIcon = (isFactual: boolean, confidence: number) => {
    if (isFactual && confidence > 0.7) return <CheckCircle className="text-green-500" size={16} />;
    if (isFactual) return <Info className="text-yellow-500" size={16} />;
    return <AlertTriangle className="text-red-500" size={16} />;
  };

  const getScoreColor = (score: number) => {
    if (score > 0.7) return 'text-green-600';
    if (score > 0.3) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatScore = (score: number) => {
    return `${(score * 100).toFixed(1)}%`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Analysis Results</h2>
      
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-2 text-gray-700">Summary</h3>
        <p className="text-gray-600 mb-4 whitespace-pre-line">{results.summary}</p>
        
        <ShareButtons
          title="AI Content Analysis Results"
          url={window.location.href}
          biasScore={results.overallBiasScore}
          factualScore={results.overallFactualScore}
        />
      </div>

      {/* Detailed Factual Scores */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Detailed Factual Analysis</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700">Source Reliability:</span>
              <p className="text-sm text-gray-500">How trustworthy is the source?</p>
            </div>
            <span className={`font-bold ${getScoreColor(results.detailedFactualScores.sourceReliabilityScore)}`}>
              {formatScore(results.detailedFactualScores.sourceReliabilityScore)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700">Citations:</span>
              <p className="text-sm text-gray-500">Are claims backed by references?</p>
            </div>
            <span className={`font-bold ${getScoreColor(results.detailedFactualScores.citationScore)}`}>
              {formatScore(results.detailedFactualScores.citationScore)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700">Balanced Reporting:</span>
              <p className="text-sm text-gray-500">Does it present multiple viewpoints?</p>
            </div>
            <span className={`font-bold ${getScoreColor(results.detailedFactualScores.balanceScore)}`}>
              {formatScore(results.detailedFactualScores.balanceScore)}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium text-gray-700">Claim Verification:</span>
              <p className="text-sm text-gray-500">How verifiable are the claims?</p>
            </div>
            <span className={`font-bold ${getScoreColor(results.detailedFactualScores.claimScore)}`}>
              {formatScore(results.detailedFactualScores.claimScore)}
            </span>
          </div>
        </div>
      </div>

      {/* AI Detection Results */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-start">
          <div className="mr-2 mt-0.5">
            <Bot className={results.aiDetection.isAIGenerated ? "text-red-500" : "text-green-500"} size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2 text-gray-700">AI Content Detection</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-700">
                {results.aiDetection.isAIGenerated ? 'AI-Generated Content Detected' : 'Likely Human-Written Content'}
              </span>
              <span className="text-sm font-medium text-gray-600">
                {Math.round(results.aiDetection.confidence * 100)}% confidence
              </span>
            </div>
            {results.aiDetection.isAIGenerated && (
              <p className="text-sm text-red-600 mt-1">
                Warning: This content appears to be generated by AI.
              </p>
            )}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <BiasIndicator score={results.overallBiasScore} type="bias" />
        </div>
        <div>
          <BiasIndicator score={results.overallFactualScore} type="factual" />
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Detected Biases</h3>
        <div className="space-y-3">
          {results.biases.map((bias: BiasResult, index: number) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  {getBiasIcon(bias.score)}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800 capitalize">
                      {bias.category} Bias
                    </h4>
                    <span className="text-sm font-medium text-gray-600">
                      {Math.round(bias.score * 100)}%
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{bias.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3 text-gray-700">Fact Check Results</h3>
        <div className="space-y-3">
          {results.factCheck.map((fact: FactCheckResult, index: number) => (
            <div key={index} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex items-start">
                <div className="mr-2 mt-0.5">
                  {getFactIcon(fact.isFactual, fact.confidence)}
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-gray-800">
                      {fact.isFactual ? 'Factual' : 'Questionable'} Statement
                    </h4>
                    <span className="text-sm font-medium text-gray-600">
                      {Math.round(fact.confidence * 100)}% confidence
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{fact.explanation}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Analyze Another Article
        </button>
      </div>
    </div>
  );
};

export default AnalysisResults;