import React from 'react';
import { HelpCircle, ChevronDown, ChevronUp } from 'lucide-react';

const FAQPage: React.FC = () => {
  const [openFaq, setOpenFaq] = React.useState<number | null>(0);

  const toggleFaq = (index: number) => {
    if (openFaq === index) {
      setOpenFaq(null);
    } else {
      setOpenFaq(index);
    }
  };

  const faqs = [
    {
      question: "How does BiasDetector work?",
      answer: "BiasDetector uses advanced natural language processing and machine learning algorithms to analyze news articles. Our system examines the text for various types of bias indicators, including word choice, framing, source selection, and context. We also fact-check key claims against reliable sources to assess factual accuracy. The results are presented as bias and factual accuracy scores, along with detailed explanations of our findings."
    },
    {
      question: "Is BiasDetector politically neutral?",
      answer: "Yes, BiasDetector is designed to be politically neutral. Our algorithms are trained on diverse datasets from across the political spectrum, and our team includes people with various political perspectives. We focus on identifying bias techniques and factual inaccuracies regardless of political leaning. Our goal is not to push any particular viewpoint but to help readers understand when information is being presented in a biased way."
    },
    {
      question: "How accurate is BiasDetector?",
      answer: "BiasDetector achieves approximately 85% accuracy in identifying various types of bias when compared to expert human analysis. However, bias detection is inherently subjective, and our system is continuously improving. We recommend using BiasDetector as one tool in your critical thinking toolkit, not as the final authority on bias or factual accuracy. Always cross-reference information with multiple sources."
    },
    {
      question: "Can BiasDetector analyze articles in languages other than English?",
      answer: "Currently, BiasDetector only supports English-language articles. We're working on expanding to other languages, with Spanish and French as our next priorities. We hope to add support for additional languages in the future."
    },
    {
      question: "How does BiasDetector handle paywalled content?",
      answer: "BiasDetector can only analyze the content you provide. If an article is behind a paywall, you'll need to copy and paste the accessible content. We respect copyright laws and terms of service, so please ensure you have the right to access and analyze the content you submit."
    },
    {
      question: "Does BiasDetector store the articles I analyze?",
      answer: "Yes, BiasDetector stores the articles you analyze in your account history to allow you to review past analyses. This data is associated with your account and is not shared with third parties. You can delete your analysis history at any time from your account settings. We use this data to improve our algorithms and provide a better service."
    },
    {
      question: "Can I use BiasDetector for academic research?",
      answer: "Yes, BiasDetector can be a valuable tool for academic research on media bias and misinformation. We offer special access and features for academic researchers. Please contact us at research@biasdetector.com for more information about our academic program."
    },
    {
      question: "How can I provide feedback or report issues?",
      answer: "We welcome your feedback! You can provide feedback or report issues by clicking on the 'Feedback' button in the application or by emailing us at feedback@biasdetector.com. Your input helps us improve BiasDetector for everyone."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex items-center mb-6">
          <HelpCircle size={28} className="text-blue-600 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Frequently Asked Questions</h1>
        </div>
        
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                className="w-full flex justify-between items-center p-4 text-left bg-gray-50 hover:bg-gray-100 transition-colors"
                onClick={() => toggleFaq(index)}
              >
                <span className="font-medium text-gray-800">{faq.question}</span>
                {openFaq === index ? (
                  <ChevronUp size={20} className="text-blue-600" />
                ) : (
                  <ChevronDown size={20} className="text-blue-600" />
                )}
              </button>
              
              {openFaq === index && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <p className="text-gray-700">{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Still Have Questions?</h2>
        
        <p className="text-gray-700 mb-6">
          If you couldn't find the answer to your question in our FAQ, please feel free to contact us directly.
          Our support team is available to help you with any questions or concerns.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Email Support</h3>
            <p className="text-gray-700 text-sm mb-3">
              Send us an email and we'll get back to you within 24 hours.
            </p>
            <a 
              href="mailto:support@biasdetector.com" 
              className="text-blue-600 hover:underline font-medium"
            >
              support@biasdetector.com
            </a>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">Live Chat</h3>
            <p className="text-gray-700 text-sm mb-3">
              Chat with our support team during business hours (9am-5pm EST).
            </p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors">
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;