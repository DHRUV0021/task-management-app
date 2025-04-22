import { Pipe, PipeTransform } from '@angular/core';
import { TaskStatus } from '../../core/models/task.model';

@Pipe({
  name: 'taskStatus'
})
export class StatusPipe implements PipeTransform {
  transform(value: TaskStatus): string {
    switch (value) {
      case TaskStatus.TODO:
        return 'To Do';
      case TaskStatus.IN_PROGRESS:
        return 'In Progress';
      case TaskStatus.DONE:
        return 'Done';
      default:
         return value;
    }
  }
}
