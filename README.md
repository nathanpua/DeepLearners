# DeepTrust - News Article Bias Analyzer

DeepTrust is an AI-powered tool that helps readers identify potential biases and verify factual accuracy in news articles. Using advanced natural language processing, it analyzes articles across multiple dimensions to provide comprehensive insights about bias and factual accuracy.

## Features

- **AI-Generated Detection**
  - Using Sapling AI API to detect if the piece of content is human-written, or AI-generated

- **Bias Detection**:
  - Political and ideological bias
  - Emotional manipulation
  - Demographic bias
  - Balance in reporting
  - Sensationalism

- **Factual Analysis**:
  - Source credibility
  - Citation verification
  - Statement accuracy
  - Context analysis
  - Evidence evaluation

- **User Features**:
  - Real-time analysis
  - Detailed reports
  - User history tracking
  - User Authentication system

## Tech Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Authentication & Database)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/deeptrust.git
   cd deeptrust
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Project Structure

```
src/
├── components/     # React components
├── pages/         # Page components
├── utils/         # Utility functions
├── types/         # TypeScript types
└── lib/           # External library configurations
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
