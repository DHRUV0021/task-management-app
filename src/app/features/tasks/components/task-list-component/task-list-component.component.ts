import { Component, inject, OnInit } from '@angular/core';
import { Task } from '../../../../core/models/task.model';
import { TasksState, TasksStore } from '../../store/tasks.store';
import { TaskItemComponent } from '../task-item/task-item.component';
import { TaskFormComponent } from '../task-form/task-form.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-task-list-component',
  imports: [TaskItemComponent,TaskFormComponent,CommonModule],
  templateUrl: './task-list-component.component.html',
  styleUrl: './task-list-component.component.scss'
})
export class TaskListComponentComponent implements OnInit {
  private tasksStore = inject(TasksStore);

  tasks = this.tasksStore.allTasks;
  selectedTask = this.tasksStore.selectedTask;


  ngOnInit(): void {
    // Load sample tasks if the store is empty
    if (this.tasks().length === 0) {
      this.tasksStore.loadSampleTasks();
    }
  }

  onAddTask(task: Partial<Task>): void {
    this.tasksStore.addTask(task as Omit<Task, 'id' | 'createdAt' | 'updatedAt'>);
  }

  onEditTask(taskId: string): void {
    this.tasksStore.selectTask(taskId);
  }

  onUpdateTask(task: Partial<Task>): void {
    const id = this.selectedTask()?.id;
    if (id) {
      this.tasksStore.updateTask(id, task);
      this.tasksStore.selectTask(null);
    }
  }

  onDeleteTask(taskId: string): void {
    if (confirm('Are you sure you want to delete this task?')) {
      this.tasksStore.deleteTask(taskId);
    }
  }

  onCancelEdit(): void {
    this.tasksStore.selectTask(null);
  }
}
