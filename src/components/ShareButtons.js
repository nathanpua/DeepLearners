import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Facebook, Instagram, Linkedin, X } from 'lucide-react';
const ShareButtons = ({ title, url, biasScore, factualScore }) => {
    const encodedTitle = encodeURIComponent(title);
    const encodedUrl = encodeURIComponent(url);
    const biasPercentage = Math.round(biasScore * 100); // Calculate bias percentage
    const factualPercentage = Math.round(factualScore * 100); // Calculate factual percentage
    // Share URLs
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`;
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=Bias Score: ${biasPercentage}%, Factual Score: ${factualPercentage}%`;
    const instagramShareUrl = `https://www.instagram.com/`; // Instagram doesn't support direct sharing, so this can link to their homepage or a custom URL
    return (_jsxs("div", { className: "flex space-x-4 mt-4 justify-center", children: [_jsxs("a", { href: facebookShareUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center flex-1 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-300 ease-in-out", children: [_jsx(Facebook, { size: 18, className: "mr-2" }), "Share on Facebook"] }), _jsxs("a", { href: twitterShareUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center flex-1 px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 ease-in-out", children: [_jsx(X, { size: 18, className: "mr-2" }), "Share on X"] }), _jsxs("a", { href: linkedInShareUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center flex-1 px-4 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 transition duration-300 ease-in-out", children: [_jsx(Linkedin, { size: 18, className: "mr-2" }), "Share on LinkedIn"] }), _jsxs("a", { href: instagramShareUrl, target: "_blank", rel: "noopener noreferrer", className: "flex items-center justify-center flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:from-purple-600 hover:to-pink-600 transition duration-300 ease-in-out", children: [_jsx(Instagram, { size: 18, className: "mr-2" }), "Share on Instagram"] })] }));
};
export default ShareButtons;
