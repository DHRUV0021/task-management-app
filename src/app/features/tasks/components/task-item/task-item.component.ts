import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriorityPipe, } from '../../../../shared/pipes/priority.pipe';
import { Task } from '../../../../core/models/task.model';
import { StatusPipe } from '../../../../shared/pipes/status.pipe';

@Component({
  selector: 'app-task-item',
  imports: [CommonModule, PriorityPipe,StatusPipe],
  templateUrl: './task-item.component.html',
  styleUrl: './task-item.component.scss'
})
export class TaskItemComponent {
  @Input() task!: Task;
  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();

  onEdit(): void {
    this.edit.emit(this.task.id);
  }

  onDelete(): void {
    this.delete.emit(this.task.id);
  }
}
