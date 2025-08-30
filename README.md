# Choose Your DB Frontend

A minimal React + Tailwind + TypeScript application that fetches questions from an API and displays them one by one with navigation and submission functionality.

## Features

- Fetches questions from `GET /questions` API endpoint
- Displays one question per page with radio button choices
- Navigation between questions with Previous/Next buttons
- Submit functionality that sends answers to `POST /recommend` endpoint
- Minimal, clean UI using Tailwind CSS
- Built with React 19 functional components and hooks

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser to `http://localhost:3000`

## Configuration

The API base URL can be configured in `src/config.ts`:

```typescript
export const config = {
  API_BASE_URL: 'http://localhost:8000', // Change this to your API server
  // ... other config
}
```

## API Endpoints

The application expects these API endpoints relative to the base URL:

- `GET /questions` - Returns questions in format: `{"q1": "question text", "q2": "question text", ...}`
- `POST /recommend` - Accepts answers and returns a recommendation

## Project Structure

- `src/App.tsx` - Main application component with all logic
- `src/types.ts` - TypeScript interfaces
- `src/main.tsx` - Application entry point
- `src/index.css` - Tailwind CSS imports

## Build

To build for production:
```bash
npm run build
```

## Deployment

### GitHub Pages

This project is configured for GitHub Pages deployment using manual commands.

1. **Enable GitHub Pages** in your repository:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created automatically)
   - Folder: `/ (root)`

2. **Install gh-pages dependency**:
```bash
npm install --save-dev gh-pages
```

3. **Deploy to GitHub Pages**:
```bash
npm run deploy
```

### What the deploy command does:

- Builds your project (`npm run build`)
- Creates a `gh-pages` branch
- Pushes the built files to that branch
- GitHub Pages automatically serves from this branch

### Important Notes

- **Repository name**: Update `base` in `vite.config.ts` if your repository name is different from `choose-your-db-frontend`
- **API endpoints**: Ensure your API is accessible from the deployed domain
- **CORS**: Your backend API must allow requests from your GitHub Pages domain
- **Re-deploy**: Run `npm run deploy` whenever you want to update the live site

## Technologies Used

- React 19 with functional components and hooks
- TypeScript for type safety
- Tailwind CSS for minimal styling
- Vite for fast development and building