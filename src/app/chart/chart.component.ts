import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartType } from 'chart.js';

@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.css'],
})
export class ChartComponent implements OnChanges {
  @Input() subClasses: { name: string; percentage: number }[] = [];

  // Static asset class pie chart data
  // assetClassLabels: string[] = ['Equity', 'Fixed Income', 'Real Estate', 'Commodities', 'Cash & Equivalents'];
  // assetClassData: number[] = [35, 25, 15, 15, 10];
  // assetClassType: ChartType = 'pie';

  // Dynamic subcategory pie chart data
  subCategoryLabels: string[] = [];
  subCategoryData: number[] = [];
  subCategoryType: ChartType = 'pie';

  subCategoryColors: string[] = [ 
    '#4E79A7',  // Light Peach (Large Cap)
    '#F28E2B',  // Light Mint Green (Mid Cap)
    '#76B7B2',  // Light Sky Blue (Small Cap);
  ]

  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  ngOnChanges() {
    console.log('Subclasses in ChartComponent:', this.subClasses);
    if (this.subClasses && this.subClasses.length) {
      this.subCategoryLabels = this.subClasses.map(sub => sub.name);  // Set dynamic labels
      this.subCategoryData = this.subClasses.map(sub => sub.percentage);  // Set dynamic data
    }
  }
}

