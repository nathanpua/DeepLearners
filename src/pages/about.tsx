import React from 'react';
//import Header from '../components/Header';
//import Footer from '../components/Footer';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      
      <main className="container mx-auto px-4 flex-grow py-8">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">About DeepTrust</h1>
          
          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Our Mission</h2>
            <p className="text-gray-600 leading-relaxed mb-4">
              DeepTrust is dedicated to promoting media literacy and critical thinking in the digital age. 
              Our AI-powered platform helps readers identify potential biases and verify factual accuracy 
              in news articles, empowering them to make informed decisions about the content they consume.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">How It Works</h2>
            <div className="space-y-4">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Bias Detection</h3>
                <p className="text-gray-600">
                  Our advanced natural language processing algorithms analyze articles for various types of bias, 
                  including political, ideological, and demographic biases. We examine language patterns, 
                  emotional manipulation, and source credibility to provide a comprehensive bias assessment.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Fact Checking</h3>
                <p className="text-gray-600">
                  We evaluate factual accuracy by cross-referencing claims with reliable sources, 
                  analyzing citation patterns, and identifying potential misinformation. Our system 
                  provides confidence scores and detailed explanations for fact-check results.
                </p>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Privacy & Security</h2>
            <p className="text-gray-600 leading-relaxed">
              We take your privacy seriously. All article analyses are performed securely, and we do not 
              store the full text of analyzed articles. User data is protected using industry-standard 
              encryption and security practices.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Disclaimer</h2>
            <p className="text-gray-600 leading-relaxed">
              While we strive for accuracy in our analysis, DeepTrust should be used as a tool to 
              supplement, not replace, critical thinking and personal judgment. Our AI-based analysis 
              is probabilistic in nature and should be considered alongside other factors when 
              evaluating news content.
            </p>
          </section>
        </div>
      </main>
      
    </div>
  );
};

export default About; 