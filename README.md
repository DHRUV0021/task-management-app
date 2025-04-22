# TaskManagementApp

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 19.2.6.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



**************************************************************************************************************************

## Project overview
************   task.model.ts
This file defines the Task model, which represents the structure of a task entity in the application. It includes the following:

Task (interface):

Represents the key properties of a task — such as id, title, description, status, priority, createdAt, dueDate, etc.

TaskStatus (enum):

Indicates the current status of a task —
values: TODO, IN_PROGRESS, DONE.

TaskPriority (enum):

Defines the priority level of a task —
values: LOW, MEDIUM, HIGH.

************   dashboard-component.component
This component handles the dashboard view and visualizes task-related data using different types of charts. Highlights:

Uses TasksStore to access observable task data such as statusCounts, priorityCounts, and chart-specific data.

Displays three types of charts:

statusChart (doughnut)

priorityChart (bar)

timelineChart (line)

Integrates Chart.js (via ng2-charts) for rendering charts.

In ngOnInit(), it loads sample tasks if none are present.

Uses a reactive effect() to watch changes and update total tasks and chart data dynamically.

************   task-form.component
This component manages the form UI used to create or update tasks. Key points:

@Input() task:
Accepts a task object when editing an existing task.

@Output() save, cancel:

Emits save event when the form is submitted with valid data.

Emits cancel event when the user cancels the action.

statuses, priorities:
Contains predefined enums for task status and priority.

Uses Reactive Forms (FormGroup):
Manages form inputs with validation (e.g., required fields, minimum title length).

ngOnChanges & patchForm():
Automatically populates the form when task input changes.

onSubmit() & onCancel():
Handles form submission and reset logic.

************   TaskItemComponent
Input (@Input() task):
Receives a task object with details like ID, priority, status.

Outputs (@Output() edit, @Output() delete):

edit: Emits the task.id to the parent for editing.

delete: Emits the task.id to the parent for deletion.

Methods:

onEdit(): Emits the edit event with task.id.

onDelete(): Emits the delete event with task.id.

Pipes:
Uses PriorityPipe and StatusPipe to display transformed task data.

************   task-list-component.component.ts
Functionality: Manages the list of tasks and handles adding, editing, updating, and deleting tasks.

Key Actions:

Loads tasks from the store.

Allows adding new tasks (onAddTask()).

Selects a task for editing (onEditTask()).

Updates a task (onUpdateTask()).

Deletes a task (onDeleteTask()).

Cancels editing (onCancelEdit()).

************  TasksStore
State Interface (TasksState):

tasks: An array that holds the list of tasks.

selectedTaskId: Stores the ID of the currently selected task (or null if none is selected).

Initial State (initialState):

Initializes tasks as an empty array and selectedTaskId as null.

Computed Values:

allTasks: Retrieves all tasks.

selectedTask: Retrieves the task matching selectedTaskId.

tasksByStatus: Categorizes tasks by their status (TODO, IN_PROGRESS, DONE).

statusCounts: Counts tasks by status.

priorityCounts: Counts tasks by priority (HIGH, MEDIUM, LOW).

statusChartData: Generates data for a pie chart visualizing task status distribution.

timelineChartData: Generates data for a line chart showing task creation over the past week.

Methods:

addTask(): Adds a new task (excluding id, createdAt, and updatedAt), auto-generates an ID and timestamps.

updateTask(): Updates an existing task by ID, setting the updatedAt timestamp.

deleteTask(): Deletes a task by ID and clears selectedTaskId if the deleted task was selected.

selectTask(): Sets the selectedTaskId to either a specific task ID or null.

loadSampleTasks(): Loads a set of sample tasks with predefined data (for demo purposes).

State Management with patchState():

The patchState() method is used to update the store's state with new data (tasks, selected task, etc.).

Usage of computed and withComputed:

computed() is used to derive values (like task counts and chart data) based on the current state (tasks).

withComputed() groups all these computed properties and exposes them for use within the store.
