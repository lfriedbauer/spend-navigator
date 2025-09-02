# Tail Spend Calculator - CFOCharm

A sophisticated tail spend modeling tool designed for CFOs to quickly assess procurement optimization opportunities.

## Features

- **2-Minute Analysis**: Quick assessment with industry-specific calculations
- **Maturity Assessment**: Personalized savings estimates based on procurement maturity
- **Industry-Specific**: Tailored multipliers for 10+ industries
- **Dark Mode**: Professional interface with light/dark theme toggle
- **Customizable Savings**: Adjust conservative/moderate/aggressive scenarios
- **Share & Export**: Copy link, email results, or print reports

## Tech Stack

- React 18
- Custom CSS with CSS Variables
- Industry data based on McKinsey, BCG, and NYU Stern research (2024)

## Getting Started

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [your-repo-url]
cd spend-navigator

# Install dependencies
npm install

# Start development server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## Calculation Methodology

The calculator uses the following formula:
1. **Indirect Spend** = Operating Expenses × Industry Rate (10-30%)
2. **Tail Spend** = Indirect Spend × 20% (Pareto principle)
3. **Savings Potential** = Tail Spend × Maturity Factor (5-20%)

## Color Scheme

- Primary Green: `#047857` (Savings/Success)
- Primary Teal: `#0d9488` (Trust/Authority)
- Accent Orange: `#c2410c` (CTAs/Actions)
- Supports both light and dark themes

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - CFOCharm.com

## Contact

For questions or feedback, visit [CFOCharm.com](https://cfocharm.com)