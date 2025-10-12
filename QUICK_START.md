# Quick Start Guide

## Installation & Setup (5 minutes)

1. **Install dependencies**
   ```bash
   cd app
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   - Navigate to `http://localhost:5173`

## Using Daily Task

### First Day

1. **Add your tasks** (click "Add Task")
   - "Finish project proposal" - Critical, 2 hours, Due tomorrow
   - "Review design mockups" - High, 1 hour
   - "Call dentist" - Medium, 15 minutes
   - "Read chapter 3" - Low, 30 minutes, Due next week

2. **Next morning**, open the app:
   - Answer "How is your available time today?"
   - Choose "Normal day"
   - You'll see: "Finish project proposal" (most urgent!)

3. **Complete it**:
   - Click "Mark Complete"
   - Done for the day! Rest well.

### Daily Workflow

**Morning**:
- Open app
- Answer time availability question
- See your one task

**Throughout the day**:
- Work on the task
- If you get blocked → "Can't do today" → Postpone it
- App gives you a new task

**Evening**:
- Mark task complete
- App shows completion message
- No more tasks until tomorrow

### Pro Tips

- **Be honest** with time estimates
- **Add deadlines** for time-sensitive tasks
- **Use importance** wisely (not everything is Critical!)
- **Postpone freely** when needed (it's not failing!)
- **View all tasks** anytime via the menu

## Common Questions

**Q: What if I finish my task early?**
A: Enjoy the rest of your day! The app intentionally doesn't give you more tasks. This encourages realistic planning.

**Q: Can I see all my tasks?**
A: Yes! Click "View All Tasks" from the main menu.

**Q: What if I have no time today?**
A: Select "Very limited time" in the morning check, and you'll get a short task (15-30 min).

**Q: Can I change a task after adding it?**
A: Currently no (v1), but this is planned for a future update.

**Q: Where is my data stored?**
A: Locally in your browser's IndexedDB. It never leaves your device.

## Troubleshooting

**App won't load?**
- Check browser console for errors
- Try clearing browser cache
- Ensure you're using a modern browser

**Lost my tasks?**
- Data is stored per browser
- Switching browsers = fresh start
- Export/import feature coming soon

**Build fails?**
- Delete `node_modules` and run `npm install` again
- Check Node.js version (need 18+)
- Check the error message in terminal

## Next Steps

- Try the app for a week
- Adjust task estimates based on reality
- Find your rhythm
- Focus on progress, not perfection

---

One task at a time. You've got this! 🎯
