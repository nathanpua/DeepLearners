import React from 'react';
import { AlertTriangle, Users, Shield, Brain, BarChart } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">About BiasDetector</h1>
        
        <div className="prose max-w-none">
          <p className="text-lg text-gray-700 mb-6">
            BiasDetector is an AI-powered tool designed to help readers identify potential biases and 
            misinformation in news articles. In today's media landscape, it's increasingly difficult 
            to distinguish fact from opinion, and to recognize when information is being presented in 
            a way that subtly influences our perceptions.
          </p>
          
          <div className="flex items-start mb-8">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <AlertTriangle size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Mission</h2>
              <p className="text-gray-700">
                Our mission is to promote media literacy and critical thinking by providing tools that 
                help people evaluate the information they consume. We believe that understanding bias 
                is essential for making informed decisions in a democratic society.
              </p>
            </div>
          </div>
          
          <div className="flex items-start mb-8">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Brain size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Technology</h2>
              <p className="text-gray-700">
                BiasDetector uses advanced natural language processing and machine learning algorithms 
                to analyze news articles for various types of bias, including political, racial, gender, 
                religious, and socioeconomic bias. Our system also fact-checks key claims against reliable 
                sources to assess factual accuracy.
              </p>
            </div>
          </div>
          
          <div className="flex items-start mb-8">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Users size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Team</h2>
              <p className="text-gray-700">
                BiasDetector was created by a diverse team of data scientists, journalists, and media 
                literacy experts. We come from various backgrounds and political perspectives, which 
                helps us build a tool that identifies bias across the spectrum rather than from a 
                single viewpoint.
              </p>
            </div>
          </div>
          
          <div className="flex items-start mb-8">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Shield size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Commitment</h2>
              <p className="text-gray-700">
                We are committed to transparency, accuracy, and continuous improvement. Our algorithms 
                are regularly updated based on user feedback and expert review. We do not store the 
                content of articles you analyze beyond what's necessary to provide our service, and 
                we respect your privacy.
              </p>
            </div>
          </div>
          
          <div className="flex items-start">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <BarChart size={24} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Our Impact</h2>
              <p className="text-gray-700">
                Since our launch, BiasDetector has analyzed over 100,000 articles and helped thousands 
                of users become more critical consumers of news. We've partnered with educational 
                institutions to develop media literacy curricula and worked with journalists to improve 
                the quality of reporting.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Contact Us</h2>
        <p className="text-gray-700 mb-6">
          We welcome your feedback, questions, and suggestions. Please reach out to us at:
        </p>
        
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <p className="text-gray-800 font-medium">Email: <a href="mailto:info@biasdetector.com" className="text-blue-600 hover:underline">info@biasdetector.com</a></p>
          <p className="text-gray-800 font-medium mt-2">Twitter: <a href="https://twitter.com/biasdetector" className="text-blue-600 hover:underline">@biasdetector</a></p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;