import React from 'react';
import { AlertTriangle, Github, Twitter } from 'lucide-react';

interface FooterProps {
  onNavigate?: (page: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNavigation = (page: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate(page);
    }
  };

  return (
    <footer className="bg-gray-800 text-white py-8 px-4 mt-12">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <div className="flex items-center mb-4 md:mb-0">
            <a href="#" onClick={handleNavigation('home')} className="flex items-center">
              <AlertTriangle size={24} className="mr-2" />
              <span className="text-xl font-bold">BiasDetector</span>
            </a>
          </div>
          
          <div className="flex space-x-4">
            <a href="https://github.com" className="text-gray-300 hover:text-white transition-colors">
              <Github size={20} />
            </a>
            <a href="https://twitter.com" className="text-gray-300 hover:text-white transition-colors">
              <Twitter size={20} />
            </a>
          </div>
        </div>
        
        <div className="border-t border-gray-700 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">About</h3>
            <p className="text-gray-400 text-sm">
              BiasDetector is an AI-powered tool designed to help readers identify potential biases and 
              misinformation in news articles, promoting media literacy and critical thinking.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Resources</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" onClick={handleNavigation('resources')} className="hover:text-blue-300 transition-colors">Media Literacy Guide</a></li>
              <li><a href="#" onClick={handleNavigation('resources')} className="hover:text-blue-300 transition-colors">Bias Types Explained</a></li>
              <li><a href="#" onClick={handleNavigation('resources')} className="hover:text-blue-300 transition-colors">Fact-Checking Resources</a></li>
              <li><a href="#" onClick={handleNavigation('resources')} className="hover:text-blue-300 transition-colors">API Documentation</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Legal</h3>
            <ul className="text-gray-400 text-sm space-y-2">
              <li><a href="#" className="hover:text-blue-300 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-300 transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} BiasDetector. All rights reserved.</p>
          <p className="mt-1">
            This tool is for educational purposes only. Always verify information from multiple sources.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;