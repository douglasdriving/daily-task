# Daily Task - One Important Thing, Every Day

A minimalist productivity application that helps you focus on accomplishing **one important task each day**. Built with React, TypeScript, and local-first architecture.

## Overview

Daily Task reduces overwhelm by showing you just one task at a time. The app intelligently prioritizes your tasks based on deadlines, importance, and duration, while adapting to your daily availability.

### Key Features

- **One Task Per Day** - Focus on a single important task
- **Intelligent Prioritization** - Automatic task scheduling based on multiple factors
- **Time Availability Check** - Adapts to your daily schedule
- **Task Postponement** - Handle blocked tasks with cooldown periods
- **Local-First** - All data stored locally with IndexedDB
- **Progressive Web App** - Install on any device, works offline
- **Dark Mode** - Easy on the eyes, day or night
- **Zero Cloud Dependencies** - Complete privacy, no accounts needed

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Local Storage**: Dexie.js (IndexedDB wrapper)
- **Routing**: React Router v6
- **PWA**: Vite PWA Plugin
- **Date Utilities**: date-fns

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd daily_task
```

2. Navigate to the app directory:
```bash
cd app
```

3. Install dependencies:
```bash
npm install
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be created in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Usage

### First Time Setup

1. **Add Tasks**: Create your first tasks with:
   - Task name (required)
   - Description (optional)
   - Importance level (Low, Medium, High, Critical)
   - Estimated duration (15min - Full day)
   - Deadline (optional)

2. **Daily Routine**: Each morning, the app asks about your time availability:
   - **Very limited time**: Get shorter tasks (≤1 hour)
   - **Normal day**: Standard task selection
   - **Extra time today**: Get longer tasks (2+ hours)

3. **Complete or Postpone**:
   - Mark tasks complete when done
   - Postpone tasks if you can't do them (with cooldown)

### Task Prioritization

The app automatically prioritizes tasks based on:

1. **Deadline Urgency** (0-40 points)
   - Overdue: 40 points
   - Due today: 35 points
   - Due in 3 days: 30 points
   - Due this week: 20 points
   - Due in 2 weeks: 10 points

2. **Importance Level** (0-40 points)
   - Critical: 40 points
   - High: 30 points
   - Medium: 20 points
   - Low: 10 points

3. **Time in Queue** (0-20 points)
   - Prevents task starvation
   - Older tasks get priority boost

4. **Duration Match**
   - Matches tasks to your available time
   - Long tasks for extra time days
   - Short tasks for limited time days

### Keyboard Shortcuts

Currently no keyboard shortcuts implemented, but this would be a great enhancement!

## Project Structure

```
daily_task/
├── DESIGN_SPEC.md              # Design & UX specification
├── TECHNICAL_SPEC.md           # Technical architecture document
├── app/                        # Main application
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/            # Reusable UI components
│   │   │   └── features/      # Feature-specific components
│   │   ├── db/                # Database layer (Dexie)
│   │   ├── stores/            # Zustand state management
│   │   ├── types/             # TypeScript type definitions
│   │   ├── utils/             # Utility functions
│   │   ├── App.tsx            # Main app component
│   │   └── main.tsx           # Entry point
│   ├── public/                # Static assets
│   └── dist/                  # Production build
```

## Architecture

### Data Flow

1. **User Action** → UI Component
2. **Component** → Zustand Store Action
3. **Store Action** → Database Operation (Dexie)
4. **Database** → IndexedDB
5. **State Update** → Component Re-render

### State Management

- **Zustand Store**: Centralized state management
- **IndexedDB**: Persistent local storage
- **No Backend**: Completely client-side

### PWA Features

- **Offline Support**: Full functionality without internet
- **Install Prompt**: Add to home screen on mobile/desktop
- **Service Worker**: Caches assets for offline use
- **App Manifest**: Configures PWA metadata

## API Documentation

### Task Store

```typescript
useTaskStore()
  .initialize()                          // Initialize app and load data
  .addTask(taskData)                     // Create new task
  .updateTask(id, updates)               // Update existing task
  .deleteTask(id)                        // Delete task
  .completeTask(id)                      // Mark task complete
  .postponeTask(id, days, reason?)       // Postpone task with cooldown
  .checkDailyTask(availability)          // Set daily task based on availability
  .updateSettings(updates)               // Update app settings
  .setTheme(theme)                       // Change theme
```

### Database Operations

```typescript
// Tasks
createTask(taskData)
getTaskById(id)
getAllTasks()
getPendingTasks()
updateTask(id, updates)
deleteTask(id)

// App State
getAppState()
updateAppState(updates)

// Data Management
exportData()                            // Export as JSON
importData(jsonData)                    // Import from JSON
resetDatabase()                         // Clear all data
```

## Data Privacy

- **No Cloud Storage**: All data stays on your device
- **No Analytics**: No tracking or telemetry
- **No Accounts**: No sign-up required
- **Local-First**: Works completely offline
- **Export/Import**: You own your data

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Any modern browser with IndexedDB support

## Deployment Options

### Static Hosting

Deploy the `dist` folder to:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages
- Any static file server

### Self-Hosting

1. Build the app: `npm run build`
2. Serve the `dist` folder with any web server:
   ```bash
   # Example with Python
   cd dist
   python -m http.server 8000

   # Example with Node.js serve
   npx serve dist
   ```

## Contributing

This is an open-source project. Contributions are welcome!

## Future Enhancements

Potential features for future versions:

- **Recurring Tasks**: Support for daily/weekly tasks
- **Task Templates**: Quick-add common tasks
- **Weekly Review**: Summary of completed tasks
- **Custom Notification Sounds**: Personalize reminders
- **Task Notes**: Add notes during execution
- **Data Sync**: Optional cloud backup (while maintaining local-first)
- **Multiple Languages**: i18n support
- **Accessibility**: Enhanced screen reader support
- **Keyboard Shortcuts**: Power user features

## License

This project is open source. See LICENSE file for details.

## Acknowledgments

Built with Claude Code - AI-assisted development.

## Support

For issues, questions, or feedback, please open an issue in the repository.

---

**Remember**: One important thing, every day. 🎯
