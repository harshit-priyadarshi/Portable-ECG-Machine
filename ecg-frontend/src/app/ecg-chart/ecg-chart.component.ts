import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import {
  Chart,
  ChartData,
  ChartOptions,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { BaseChartDirective } from 'ng2-charts';
import { WebSocketService } from '../web-socket.service';
import { Subscription } from 'rxjs';

Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  zoomPlugin
);

@Component({
  selector: 'app-ecg-chart',
  standalone: true,
  imports: [BaseChartDirective],
  templateUrl: './ecg-chart.component.html',
  styleUrls: ['./ecg-chart.component.css'],
})
export class EcgChartComponent implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  private wsSubscription?: Subscription;

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'ECG Signal',
        borderColor: 'red',
        fill: false,
        tension: 0.1,
        borderWidth: 1,
        pointRadius: 0,
      },
    ],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    animation: false,
    scales: {
      x: {
        type: 'category',
        display: false,
      },
      y: {
        type: 'linear',
        min: 0,
        max: 250,
      },
    },
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: 'x',
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'x',
        },
      },
    },
  };

  constructor(private wsService: WebSocketService) {}

  ngOnInit(): void {
    this.wsSubscription = this.wsService.messages$.subscribe((message) => {
      try {
        const parsed = typeof message === 'string' ? JSON.parse(message) : message;

        if (parsed.type === 'ecg') {
          const value = parseInt(parsed.value, 10);
          if (!isNaN(value)) {
            const data = this.lineChartData.datasets[0].data as number[];
            const labels = this.lineChartData.labels as string[];

            data.push(value);
            labels.push('');

            if (data.length > 200) {
              data.shift();
              labels.shift();
            }

            this.chart?.update();
          }
        } else {
          console.log('Other message from server:', parsed);
        }
      } catch (error) {
        console.error('Failed to parse WebSocket message:', message, error);
      }
    });
  }

  ngOnDestroy(): void {
    this.wsSubscription?.unsubscribe();
  }

  resetZoom(): void {
    this.chart?.chart?.resetZoom();
  }
}

