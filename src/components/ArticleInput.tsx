import React, { useState } from 'react';
import { Article } from '../types';
import { getExampleArticle } from '../utils/analysisUtils';
import { FileText, Link, User, Calendar } from 'lucide-react';

interface ArticleInputProps {
  onAnalyze: (article: Article) => void;
}

const ArticleInput: React.FC<ArticleInputProps> = ({ onAnalyze }) => {
  const [article, setArticle] = useState<Article>({
    title: '',
    content: '',
    source: '',
    author: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setArticle(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (article.title.trim() && article.content.trim()) {
      onAnalyze(article);
    }
  };

  const loadExample = () => {
    const exampleArticle = getExampleArticle();
    setArticle(exampleArticle);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Article Input</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
            <FileText size={16} className="mr-1" /> Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={article.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter article title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
            Article Content
          </label>
          <textarea
            id="content"
            name="content"
            value={article.content}
            onChange={handleChange}
            rows={8}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Paste the full article content here"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label htmlFor="source" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Link size={16} className="mr-1" /> Source
            </label>
            <input
              type="text"
              id="source"
              name="source"
              value={article.source}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="News source"
            />
          </div>
          
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <User size={16} className="mr-1" /> Author
            </label>
            <input
              type="text"
              id="author"
              name="author"
              value={article.author}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Article author"
            />
          </div>
          
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
              <Calendar size={16} className="mr-1" /> Publication Date
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={article.date}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={loadExample}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Load Example
          </button>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Analyze Article
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleInput;