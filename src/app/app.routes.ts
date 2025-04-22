import { Routes } from '@angular/router';
import { TaskListComponentComponent } from './features/tasks/components/task-list-component/task-list-component.component';
import { DashboardComponentComponent } from './features/tasks/components/dashboard-component/dashboard-component.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'tasks', component: TaskListComponentComponent },
  { path: 'dashboard', component: DashboardComponentComponent },
  { path: '**', redirectTo: '/dashboard' }
];
