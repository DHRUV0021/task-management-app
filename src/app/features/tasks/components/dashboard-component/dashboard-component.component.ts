import { Component, effect, inject, ViewChild } from '@angular/core';
import { TasksStore } from '../../store/tasks.store';
import { CommonModule } from '@angular/common';
import { ArcElement, BarController, BarElement, CategoryScale, Chart, ChartConfiguration, ChartType, DoughnutController, Legend, LinearScale, LineController, LineElement, PointElement, Tooltip } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

Chart.register(
  ArcElement,
  DoughnutController,
  LineController,
  LineElement,
  PointElement,
  BarController,
  BarElement,
  LinearScale,
  CategoryScale,
  Legend,
  Tooltip
);

@Component({
  selector: 'app-dashboard-component',
  imports: [CommonModule,BaseChartDirective],
  templateUrl: './dashboard-component.component.html',
  styleUrl: './dashboard-component.component.scss'
})
export class DashboardComponentComponent {
  private tasksStore = inject(TasksStore);
  @ViewChild('statusChart') statusChart?: BaseChartDirective;
  @ViewChild('priorityChart') priorityChart?: BaseChartDirective;
  @ViewChild('timelineChart') timelineChart?: BaseChartDirective;

  // Store data
  statusCounts = this.tasksStore.statusCounts;
  priorityCounts = this.tasksStore.priorityCounts;

  // Computed total tasks
  totalTasks = 0;

  // Chart types
  statusChartType: ChartType = 'doughnut';
  priorityChartType: ChartType = 'bar';
  timelineChartType: ChartType = 'line';

  // Status chart data
  statusChartData = this.tasksStore.statusChartData;

  // Timeline chart data
  timelineChartData = this.tasksStore.timelineChartData;

  // Priority chart data - initialized here
  priorityChartData: ChartConfiguration['data'] = {
    labels: ['High', 'Medium', 'Low'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#dc3545', '#ffc107', '#28a745'],
        borderColor: ['#dc3545', '#ffc107', '#28a745'],
        borderWidth: 1
      }
    ]
  };

  // Common chart options
  doughnutOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10,
        titleFont: {
          size: 14
        },
        bodyFont: {
          size: 13
        }
      }
    }
  };

  barOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10
      }
    }
  };

  lineOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          font: {
            size: 12
          }
        },
        title: {
          display: true,
          text: 'Number of Tasks',
          font: {
            size: 14
          }
        }
      },
      x: {
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: 10
      }
    }
  };

  constructor() {
    // Create an effect to respond to task changes
    effect(() => {
      // Update the total tasks count
      this.totalTasks = this.tasksStore.tasks().length;

      // Update priority chart data
      this.updatePriorityChartData();

      // Update charts
      setTimeout(() => {
        this.statusChart?.update();
        this.priorityChart?.update();
        this.timelineChart?.update();
      });
    });
  }
  tasks = this.tasksStore.allTasks;
  ngOnInit(): void {
    // Initialize priority chart data
    if (this.tasks().length === 0) {
      this.tasksStore.loadSampleTasks();
    }
    this.updatePriorityChartData();
  }

  private updatePriorityChartData(): void {
    const counts = this.priorityCounts();
    if (this.priorityChartData.datasets && this.priorityChartData.datasets.length > 0) {
      this.priorityChartData.datasets[0].data = [counts.high, counts.medium, counts.low];
    }
  }

}
