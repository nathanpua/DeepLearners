import React from 'react';
interface ShareButtonsProps {
    title: string;
    url: string;
    biasScore: number;
    factualScore: number;
}
declare const ShareButtons: React.FC<ShareButtonsProps>;
export default ShareButtons;
