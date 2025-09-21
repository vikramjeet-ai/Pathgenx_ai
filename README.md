# PathGenX AI 🚀

A generative AI career and entrepreneurial pathway copilot that maps skills, simulates career paths, and generates personalized roadmaps to help students and professionals navigate the evolving job market.

![PathGenX AI](https://img.shields.io/badge/PathGenX-AI-blue?style=for-the-badge&logo=artificial-intelligence)
![React](https://img.shields.io/badge/React-18.2.0-blue?style=flat&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?style=flat&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-7.1.6-purple?style=flat&logo=vite)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.1-blue?style=flat&logo=tailwindcss)

## 🌟 Features

### 🤖 AI-Powered Career Analysis
- **Personalized Pathway Generation**: Get 2-3 tailored career paths based on your specific dilemma
- **Progressive Loading**: Fast initial results with detailed information loaded progressively
- **Real-time Refinement**: Provide feedback to refine and improve your career analysis
- **Indian Market Focus**: Specialized insights for the Indian job market with salary projections in INR

### 📊 Comprehensive Career Insights
- **Income Projections**: 1, 3, and 5-year salary forecasts in Indian Rupees
- **Skill Development Roadmaps**: Step-by-step skill building plans
- **Stress Level Analysis**: Understanding work-life balance implications
- **Pros & Cons**: Balanced view of each career pathway
- **Industry Trends**: Current market insights affecting your chosen paths

### 🛠️ Advanced Functionality
- **Shareable Analysis**: Generate shareable links to your career analysis
- **Dark Mode Support**: Beautiful UI with light/dark theme switching
- **Responsive Design**: Optimized for desktop and mobile devices
- **Progressive Web App**: Fast loading and smooth user experience

### 📚 Learning Resources
Each career path includes curated resources:
- **Books**: Recommended reading materials
- **Courses**: Online learning opportunities
- **Tools**: Essential software and platforms
- **Communities**: Networking and support groups

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pathgenx-ai.git
   cd pathgenx-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   VITE_API_KEY=your_google_gemini_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

### Getting Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy the key and add it to your `.env` file

## 🏗️ Project Structure

```
pathgenx-ai/
├── src/
│   ├── components/          # React components
│   │   ├── CareerPathCard.tsx
│   │   ├── FeedbackInput.tsx
│   │   ├── Footer.tsx
│   │   ├── Header.tsx
│   │   ├── icons.tsx
│   │   ├── RoadmapChart.tsx
│   │   ├── SkeletonLoader.tsx
│   │   └── UserInput.tsx
│   ├── services/            # API services
│   │   └── geminiService.ts
│   ├── utils/               # Utility functions
│   │   └── shareUtils.ts
│   ├── types.ts             # TypeScript type definitions
│   ├── App.tsx              # Main application component
│   ├── index.tsx            # Application entry point
│   └── index.css            # Global styles
├── public/                  # Static assets
├── dist/                    # Build output
├── package.json             # Dependencies and scripts
├── tailwind.config.js       # Tailwind CSS configuration
├── vite.config.ts          # Vite configuration
└── tsconfig.json           # TypeScript configuration
```

## 🎯 How It Works

### 1. **Input Your Career Dilemma**
Describe your career crossroads, skills, interests, and what you're looking for.

### 2. **AI Analysis Process**
- **Path Outlines**: Generate 2-3 career pathway titles and descriptions
- **Detailed Analysis**: Progressive loading of comprehensive details for each path
- **Summary Generation**: AI-powered comparison and recommendations

### 3. **Interactive Refinement**
- Provide feedback on the analysis
- Request additional information (day-in-the-life, work-life balance, etc.)
- Refine and improve your career insights

### 4. **Share and Save**
- Generate shareable links to your analysis
- Copy URLs to share with mentors, friends, or family

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🎨 Technologies Used

### Frontend
- **React 18.2.0** - Modern React with hooks and functional components
- **TypeScript 5.2.2** - Type-safe JavaScript development
- **Vite 7.1.6** - Fast build tool and development server
- **Tailwind CSS 3.4.1** - Utility-first CSS framework

### AI & Backend
- **Google Gemini 2.5 Flash** - Advanced AI model for career analysis
- **@google/genai** - Official Google AI SDK

### Utilities
- **Pako** - Data compression for efficient sharing
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🔧 Configuration

### Environment Variables
- `VITE_API_KEY` - Your Google Gemini API key (required)

### Tailwind Configuration
The project uses a custom Tailwind configuration with:
- Dark mode support
- Custom color schemes
- Responsive breakpoints
- Custom animations

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)



## 🗺️ Roadmap

### Planned Features
- [ ] intregrate RAG pipeline
- [ ] Career path comparison tool
- [ ] Integration with job boards
- [ ] Mentor matching system
- [ ] Career progress tracking
- [ ] Mobile app development
- [ ] Multi-language support
- [ ] Advanced analytics dashboard

### Recent Updates
- ✅ Progressive loading implementation
- ✅ Shareable analysis links
- ✅ Dark mode support
- ✅ Mobile-responsive design
- ✅ Indian market specialization

## 🙏 Acknowledgments

- Google Gemini AI for providing powerful career analysis capabilities
- The React and TypeScript communities for excellent documentation
- Tailwind CSS for the beautiful design system
- All contributors and users who provide valuable feedback

---

**Made with ❤️ for career explorers and future builders**

*PathGenX AI - Your AI-powered career copilot*