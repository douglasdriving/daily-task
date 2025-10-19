# One-Sentence Summary

An task app that helps you do 1 important thing a day

# Core Problem

All the things we need to do often overwhelm us. The task list feels infinite. It feels as though we will never have time to get to it all. We dont know when we will do which task. We struggle to stay present in the moment, in the day that we have.

# Core Features

A task app that centers around doing 1 important thing each day. It only shows the user the thing they have scheduled for the day, and hides everything else from then. It only requests them to do that one thing, and no more.

Features:
- Enter tasks into the app, with additional data such as if there is a deadline and how important the task is to you, and how long you expect the task to take
- The app arranges the tasks in order of prio based on the data (how important they are, when the deadline is), to make sure there is time for all of them
- User gets a push notification each morning to do the task
- When you open the app, see the one task that you should do
- Check off the task, the app then shows no more tasks until the next morning
- If you for some reason cannot do the task, for example if you are waiting for something, there is a feature to "postpone" the task to a later date. In this case, the app will ask how far you want to postpone it, and add a "cooldown" to the task so that it wont show up again during that time.
- Before you get your daily task, the app will ask if you have more or less time than usual today. In the case that the user has A LOT of extra time, the app will push a longer task. In the case that the user has very little time on the given day, the app will push a shorter task for that day instead.

# Additional requirements

- all data should be stored locally, no login or cloud data
- should work primarily on Android, but be a web app that can be accessed on any platform
- open source