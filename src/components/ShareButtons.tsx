import React from 'react';

interface ShareButtonsProps {
  title: string;
  url: string;
  biasScore: number;
  factualScore: number;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ title, url, biasScore, factualScore }) => {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const biasPercentage = Math.round(biasScore * 100); // Calculate bias percentage
  const factualPercentage = Math.round(factualScore * 100); // Calculate factual percentage

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
  const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=Bias Score: ${biasPercentage}%, Factual Score: ${factualPercentage}%`;

  return (
    <div className="flex space-x-4 mt-4 justify-center">
      <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out">
        Share on Facebook
      </a>
      <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-400 text-white rounded-md hover:bg-blue-500 transition duration-300 ease-in-out">
        Share on Twitter
      </a>
      <a href={linkedInShareUrl} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-300 ease-in-out">
        Share on LinkedIn
      </a>
    </div>
  );
};

export default ShareButtons;
