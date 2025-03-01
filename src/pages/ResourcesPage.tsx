import React from 'react';
import { Book, Link, FileText, ExternalLink, BookOpen, Lightbulb } from 'lucide-react';

const ResourcesPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Media Literacy Resources</h1>
        
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Book size={24} className="text-blue-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-800">Understanding Media Bias</h2>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <p className="text-gray-700 mb-4">
              Media bias refers to the perceived bias of journalists and news producers within the mass media. 
              There are many different types of bias, including:
            </p>
            
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded mr-2 mt-0.5">Political Bias</span>
                <span>Favoring a particular political ideology, party, or candidate</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded mr-2 mt-0.5">Selection Bias</span>
                <span>Choosing which stories to cover based on what will generate the most interest</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded mr-2 mt-0.5">Omission Bias</span>
                <span>Leaving out important details that might change the reader's perception</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded mr-2 mt-0.5">Framing Bias</span>
                <span>Presenting information within a context that influences interpretation</span>
              </li>
              <li className="flex items-start">
                <span className="bg-blue-100 text-blue-800 font-medium px-2.5 py-0.5 rounded mr-2 mt-0.5">Sensationalism</span>
                <span>Exaggerating or emphasizing the unusual or dramatic aspects of a story</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Lightbulb size={24} className="text-blue-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-800">How to Spot Misinformation</h2>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <p className="text-gray-700 mb-4">
              Misinformation can be difficult to identify, but there are several strategies that can help:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Check the Source</h3>
                <p className="text-gray-700 text-sm">
                  Verify the credibility of the publication and author. Look for established news sources with 
                  editorial standards and fact-checking processes.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Cross-Reference Information</h3>
                <p className="text-gray-700 text-sm">
                  Check if multiple reliable sources are reporting the same information. If a claim appears in 
                  only one source, be skeptical.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Examine the Evidence</h3>
                <p className="text-gray-700 text-sm">
                  Look for citations, data sources, and expert quotes. Be wary of articles that make claims 
                  without supporting evidence.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800 mb-2">Consider the Context</h3>
                <p className="text-gray-700 text-sm">
                  Understand when the article was published and what was happening at that time. Some information 
                  may be outdated or presented without important context.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div>
          <div className="flex items-center mb-4">
            <Link size={24} className="text-blue-600 mr-2" />
            <h2 className="text-2xl font-semibold text-gray-800">Recommended Fact-Checking Resources</h2>
          </div>
          
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
            <ul className="space-y-4">
              <li className="flex items-start">
                <ExternalLink size={20} className="text-blue-600 mr-2 mt-0.5" />
                <div>
                  <a href="https://www.factcheck.org" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">FactCheck.org</a>
                  <p className="text-gray-700 text-sm">A nonpartisan, nonprofit project that monitors the factual accuracy of major political claims.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <ExternalLink size={20} className="text-blue-600 mr-2 mt-0.5" />
                <div>
                  <a href="https://www.politifact.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">PolitiFact</a>
                  <p className="text-gray-700 text-sm">A fact-checking website that rates the accuracy of claims by elected officials and others on its Truth-O-Meter.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <ExternalLink size={20} className="text-blue-600 mr-2 mt-0.5" />
                <div>
                  <a href="https://www.snopes.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Snopes</a>
                  <p className="text-gray-700 text-sm">One of the first online fact-checking websites, focusing on urban legends, rumors, and misinformation.</p>
                </div>
              </li>
              
              <li className="flex items-start">
                <ExternalLink size={20} className="text-blue-600 mr-2 mt-0.5" />
                <div>
                  <a href="https://www.reuters.com/fact-check" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-medium">Reuters Fact Check</a>
                  <p className="text-gray-700 text-sm">Fact-checking service from one of the world's largest news agencies, focusing on viral claims and misinformation.</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center mb-4">
          <BookOpen size={24} className="text-blue-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">Educational Materials</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-3">
              <FileText size={20} className="text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Media Literacy Guide</h3>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              Our comprehensive guide to understanding and evaluating news media. Includes exercises and examples.
            </p>
            <a href="#" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Download PDF
            </a>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center mb-3">
              <FileText size={20} className="text-blue-600 mr-2" />
              <h3 className="font-semibold text-gray-800">Bias Types Explained</h3>
            </div>
            <p className="text-gray-700 text-sm mb-3">
              Detailed explanations of different types of bias with real-world examples from various news sources.
            </p>
            <a href="#" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Download PDF
            </a>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center mb-4">
          <Link size={24} className="text-blue-600 mr-2" />
          <h2 className="text-2xl font-semibold text-gray-800">API Documentation</h2>
        </div>
        
        <p className="text-gray-700 mb-4">
          BiasDetector offers an API for developers who want to integrate our bias and misinformation detection 
          capabilities into their own applications.
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-2">API Features:</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li>Analyze articles for various types of bias</li>
            <li>Fact-check claims against reliable sources</li>
            <li>Generate bias and factual accuracy scores</li>
            <li>Provide detailed explanations of detected biases</li>
          </ul>
          
          <div className="mt-4">
            <a href="#" className="text-blue-600 hover:underline font-medium">View API Documentation →</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResourcesPage;