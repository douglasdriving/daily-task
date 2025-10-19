# Daily Task App - Design Specification

## Overview

**Daily Task** is a minimalist productivity application designed to help users focus on accomplishing one important task each day. By reducing overwhelm and promoting intentional action, the app creates a calm, focused approach to personal task management.

## Core Philosophy

The app is built around these principles:
- **One task per day** - Focus creates progress
- **Intelligent prioritization** - The system handles scheduling complexity
- **Presence over planning** - Stay in today, not lost in tomorrow
- **Zero pressure after completion** - Rest is productive

## Target Users

- Individuals who feel overwhelmed by long task lists
- People who struggle with prioritization
- Users seeking a more mindful approach to productivity
- Anyone who wants to make consistent progress on important goals

## User Flows

### 1. First Time Experience

**Flow:**
1. User opens the app for the first time
2. Welcome screen explains the core concept: "One important thing, every day"
3. Brief tutorial (optional skip) shows how the app works
4. User is prompted to add their first few tasks
5. App is ready to schedule the first daily task

**Key Screens:**
- Welcome/intro screen
- Quick tutorial (3-4 screens)
- Initial task entry

### 2. Adding a New Task

**Flow:**
1. User taps "Add Task" button (available from task list view)
2. Task entry form appears with fields:
   - **Task name** (required) - What needs to be done
   - **Description** (optional) - Additional details
   - **Importance level** (required) - Low, Medium, High, Critical
   - **Deadline** (optional) - Specific date or "No deadline"
   - **Estimated duration** (required) - 15 min, 30 min, 1 hour, 2 hours, 4 hours, Full day
3. User fills out the form
4. User taps "Save Task"
5. Task is added to the queue (not immediately visible)
6. Confirmation message: "Task added to your queue"

**Validation:**
- Task name cannot be empty
- At least importance and duration must be selected

### 3. Morning Routine - Starting the Day

**Flow:**
1. User receives push notification in the morning (default: 7 AM, customizable)
2. Notification says: "Ready for today? Your task is waiting."
3. Before showing the task, app asks: "How is your available time today?"
   - Options:
     - "Normal day" (default)
     - "Extra time today"
     - "Very limited time"
4. Based on response, app selects appropriate task from queue
5. App displays the single task for the day with:
   - Task name
   - Description (if provided)
   - Estimated duration
   - "Mark Complete" button
   - "Can't do today" button (postpone option)

**Task Selection Logic:**
- **Normal day**: Task is selected by standard priority
- **Extra time**: Longer duration tasks are prioritized
- **Limited time**: Shorter duration tasks are prioritized
- Priority considers: deadline proximity, importance level, cooldown status

### 4. Completing a Task

**Flow:**
1. User works on their daily task
2. When finished, user opens app
3. User taps "Mark Complete" button
4. Celebration screen appears with encouraging message: "Well done! See you tomorrow."
5. App shows peaceful empty state (no more tasks today)
6. App remains in this state until next morning

**Empty State:**
- Clean, minimal design
- Message: "You're done for today. Rest well."
- No task addition or management available until tomorrow

### 5. Postponing a Task

**Flow:**
1. User opens app and sees their daily task
2. User realizes they cannot complete it today (e.g., waiting on someone)
3. User taps "Can't do today" button
4. Postponement dialog appears: "When can you revisit this?"
   - Options:
     - "Tomorrow" (+1 day cooldown)
     - "In a few days" (+3 days cooldown)
     - "Next week" (+7 days cooldown)
     - "In 2 weeks" (+14 days cooldown)
     - Custom date picker
5. User selects timeframe
6. Task enters cooldown period (won't appear until that date)
7. Reason prompt (optional): "Why are you postponing? (optional note)"
8. New task is immediately presented for today
9. Confirmation: "Task postponed. Here's another task for today."

**Postponement Rules:**
- Can only postpone once per day
- After postponement, a replacement task appears
- Postponed tasks maintain their original priority/deadline

### 6. Managing Tasks (Task Queue View)

**Flow:**
1. User taps "View All Tasks" from menu (not prominent)
2. List view shows all pending tasks ordered by priority
3. Each task card shows:
   - Task name
   - Importance indicator (color coded)
   - Deadline (if set)
   - Estimated duration
   - Status (scheduled date if postponed/in cooldown)
4. User can tap a task to:
   - Edit details
   - Delete task
   - View full description
5. User can add new tasks from this view

**Design Notes:**
- This view is intentionally de-emphasized
- User should rarely need to visit it
- Focus remains on daily task, not queue management

### 7. Settings and Preferences

**Flow:**
1. User accesses settings from menu
2. Available settings:
   - **Notification time** - When to receive daily reminder
   - **Enable notifications** - Toggle on/off
   - **First day preference** - Start week on Sunday/Monday
   - **Default time availability** - Default answer for daily time check
   - **Theme** - Light/Dark mode
   - **Data management** - Export/import tasks

## Feature Details

### Task Prioritization Algorithm

The system automatically determines which task to show each day based on:

1. **Cooldown status** - Tasks in cooldown are excluded
2. **Deadline proximity** - Tasks due soon get higher priority
3. **Importance level** - User-set importance (Critical > High > Medium > Low)
4. **Task duration vs. available time** - Matches task length to user's daily availability
5. **Age in queue** - Older tasks get slight priority boost to prevent starvation

**Priority Score Formula (conceptual):**
```
Priority = (Importance Weight) + (Deadline Urgency) + (Age Factor) + (Duration Match)
```

### Daily Time Check

**Purpose**: Adapt daily task selection to user's realistic availability

**When**: Triggered when user first opens app each morning

**Options**:
- **Normal day**: Standard task selection (uses estimated duration as-is)
- **Extra time**: Prioritizes tasks with longer durations (2+ hours)
- **Very limited time**: Prioritizes tasks with shorter durations (≤1 hour)

### Postponement and Cooldown System

**Purpose**: Handle tasks that are blocked or cannot be done currently

**Cooldown Period**: Time during which a task won't be scheduled
- Starts from postponement date
- Task re-enters queue pool after cooldown expires
- User can see postponed tasks in queue view with cooldown indicator

### Notifications

**Daily Reminder**:
- Default time: 7:00 AM
- Message: "Ready for today? Your task is waiting."
- Opens app to time availability check

**Completion Celebration** (optional):
- Subtle positive reinforcement
- Does not guilt or pressure
- Can be disabled in settings

## Edge Cases and Special Scenarios

### No Tasks in Queue
- **State**: All tasks completed or postponed
- **UI**: Shows encouraging empty state
- **Action**: Prompts user to add new tasks or celebrate being caught up

### Deadline Passed
- **Handling**: Overdue tasks get maximum priority
- **UI**: Shows deadline in red with "Overdue" indicator
- **Note**: System doesn't guilt user, just indicates urgency

### All Tasks in Cooldown
- **State**: Every task is postponed
- **UI**: Special message: "All your tasks are on hold. Add something new, or take the day off!"
- **Action**: Allows adding new tasks or skip day

### Multiple Tasks Same Priority
- **Resolution**: Task that's been waiting longest gets selected
- **Randomization**: If tied, random selection to ensure variety

### User Doesn't Open App
- **Behavior**: Task "rolls over" to next day
- **No penalty**: System doesn't punish missed days
- **Note**: Same task appears next time app is opened

## Non-Goals (Out of Scope)

These features are intentionally excluded to maintain simplicity:
- Task sharing or collaboration
- Task categories or tags
- Subtasks or checklists
- Time tracking or statistics
- Gamification (streaks, points, achievements)
- Multiple tasks per day
- Calendar integration
- Cloud sync or multi-device support

## Success Metrics

The app succeeds if users:
- Feel less overwhelmed by their task list
- Consistently complete one task per day
- Experience increased focus and presence
- Report reduced anxiety about productivity
- Continue using the app over weeks/months

## Accessibility Considerations

- Large, readable text
- High contrast color schemes
- Screen reader support for all UI elements
- Simple, clear navigation
- No time-pressure mechanics
- Calm, non-stressful visual design

## Privacy and Data

- All data stored locally on device
- No account creation required
- No data sent to external servers
- User owns and controls all task data
- Export capability for data portability
