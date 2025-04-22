import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { computed } from '@angular/core';
import { Task, TaskPriority, TaskStatus } from '../../../core/models/task.model';

export interface TasksState {
  tasks: Task[];
  selectedTaskId: string | null;
}

const initialState: TasksState = {
  tasks: [],
  selectedTaskId: null
};

export const TasksStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),

  withComputed((store) => {
    const allTasks = computed(() => store.tasks());

    const selectedTask = computed(() => {
      const selectedId = store.selectedTaskId();
      return selectedId ? store.tasks().find(task => task.id === selectedId) || null : null;
    });

    const tasksByStatus = computed(() => {
      const tasks = store.tasks();
      return {
        todo: tasks.filter(t => t.status === TaskStatus.TODO),
        inProgress: tasks.filter(t => t.status === TaskStatus.IN_PROGRESS),
        done: tasks.filter(t => t.status === TaskStatus.DONE)
      };
    });

    const statusCounts = computed(() => {
      const { todo, inProgress, done } = tasksByStatus();
      return {
        todo: todo.length,
        inProgress: inProgress.length,
        done: done.length
      };
    });

    const priorityCounts = computed(() => {
      const tasks = store.tasks();
      return {
        high: tasks.filter(t => t.priority === TaskPriority.HIGH).length,
        medium: tasks.filter(t => t.priority === TaskPriority.MEDIUM).length,
        low: tasks.filter(t => t.priority === TaskPriority.LOW).length
      };
    });

    const statusChartData = computed(() => {
      const counts = statusCounts();
      return {
        labels: ['To Do', 'In Progress', 'Done'],
        datasets: [{
          data: [counts.todo, counts.inProgress, counts.done],
          backgroundColor: ['#FF6384', '#36A2EB', '#4BC0C0']
        }]
      };
    });

    const timelineChartData = computed(() => {
      const tasks = store.tasks();
      const dates = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
      }).reverse();

      const taskCounts = dates.map(date =>
        tasks.filter(task =>
          new Date(task.createdAt).toISOString().split('T')[0] === date
        ).length
      );

      return {
        labels: dates.map(d => new Date(d).toLocaleDateString()),
        datasets: [{
          label: 'Tasks Created',
          data: taskCounts,
          borderColor: '#4BC0C0',
          fill: false,
          tension: 0.1
        }]
      };
    });

    return {
      allTasks,
      selectedTask,
      tasksByStatus,
      statusCounts,
      priorityCounts,
      statusChartData,
      timelineChartData
    };
  }),

  withMethods((store) => ({
    addTask(task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) {
      const now = new Date();
      const newTask: Task = {
        ...task,
        id: crypto.randomUUID(),
        createdAt: now,
        updatedAt: now
      };

      patchState(store, {
        tasks: [...store.tasks(), newTask]
      });
    },

    updateTask(id: string, changes: Partial<Omit<Task, 'id' | 'createdAt' | 'updatedAt'>>) {
      patchState(store, {
        tasks: store.tasks().map(task =>
          task.id === id
            ? { ...task, ...changes, updatedAt: new Date() }
            : task
        )
      });
    },

    deleteTask(id: string) {
      patchState(store, {
        tasks: store.tasks().filter(task => task.id !== id),
        selectedTaskId: store.selectedTaskId() === id ? null : store.selectedTaskId()
      });
    },

    selectTask(id: string | null) {
      patchState(store, { selectedTaskId: id });
    },

    loadSampleTasks() {
      const now = new Date();
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const twoDaysAgo = new Date(now);
      twoDaysAgo.setDate(now.getDate() - 2);

      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Create Angular project',
          description: 'Set up Angular 19 project with NgRx Signals',
          status: TaskStatus.DONE,
          priority: TaskPriority.HIGH,
          createdAt: twoDaysAgo,
          updatedAt: yesterday
        },
        {
          id: '2',
          title: 'Implement Store',
          description: 'Create Task store with NgRx Signals',
          status: TaskStatus.DONE,
          priority: TaskPriority.HIGH,
          createdAt: yesterday,
          updatedAt: now
        },
        {
          id: '3',
          title: 'Create task components',
          description: 'Build UI for task management',
          status: TaskStatus.IN_PROGRESS,
          priority: TaskPriority.MEDIUM,
          createdAt: yesterday,
          updatedAt: now
        },
        {
          id: '4',
          title: 'Add charts',
          description: 'Implement chart visualizations',
          status: TaskStatus.TODO,
          priority: TaskPriority.MEDIUM,
          createdAt: now,
          updatedAt: now
        },
        {
          id: '5',
          title: 'Write documentation',
          description: 'Document architecture and patterns',
          status: TaskStatus.TODO,
          priority: TaskPriority.LOW,
          createdAt: now,
          updatedAt: now
        }
      ];

      patchState(store, { tasks: sampleTasks });
    }
  }))
);
