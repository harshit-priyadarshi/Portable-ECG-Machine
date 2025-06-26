import { Component } from '@angular/core';
import { EcgChartComponent } from './ecg-chart/ecg-chart.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [EcgChartComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
