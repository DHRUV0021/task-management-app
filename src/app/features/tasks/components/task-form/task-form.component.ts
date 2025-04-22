import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { Task, TaskPriority, TaskStatus } from '../../../../core/models/task.model';
import { StatusPipe } from '../../../../shared/pipes/status.pipe';
import { PriorityPipe } from '../../../../shared/pipes/priority.pipe';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule,NgIf,CommonModule,StatusPipe,PriorityPipe],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent {
  @Input() task: Task | null = null;
  @Output() save = new EventEmitter<Partial<Task>>();
  @Output() cancel = new EventEmitter<void>();

  statuses: TaskStatus[] = [TaskStatus.TODO, TaskStatus.IN_PROGRESS, TaskStatus.DONE];
  priorities: TaskPriority[] = [TaskPriority.HIGH, TaskPriority.MEDIUM, TaskPriority.LOW];

  taskForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.taskForm = this.createForm();
  }

  ngOnInit(): void {
    if (this.task) {
      this.patchForm();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && changes['task'].currentValue) {
      this.patchForm();
    } else if (changes['task'] && !changes['task'].currentValue) {
      this.taskForm.reset({
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM
      });
    }
  }

  createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required]],
      status: [TaskStatus.TODO, [Validators.required]],
      priority: [TaskPriority.MEDIUM, [Validators.required]],
      dueDate: [null]
    });
  }

  patchForm(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title,
        description: this.task.description,
        status: this.task.status,
        priority: this.task.priority,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate) : null
      });
    }
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.taskForm.markAllAsTouched();
      return;
    }

    this.save.emit(this.taskForm.value);

    if (!this.task) {
      this.taskForm.reset({
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
    if (!this.task) {
      this.taskForm.reset({
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM
      });
    }
  }
}

