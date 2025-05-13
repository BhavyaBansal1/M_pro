import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { PortfolioDataService } from '../services/portfoliodata.service';

Chart.register(...registerables, ChartDataLabels);

@Component({
  selector: 'app-portfolio',
  standalone: true,
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
  imports: [CommonModule, HttpClientModule]
})
export class PortfolioComponent implements OnInit {
  totalAmount = 0;
  allocatedMatrix: any[] = [];
  chart: Chart | undefined;

  constructor(private router: Router, private portfolioDataService: PortfolioDataService) {}

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { portfolioData: any };

    if (state?.portfolioData) {
      console.log('Portfolio data received from state:', state.portfolioData);
      this.totalAmount = state.portfolioData.totalAmount;
      this.allocatedMatrix = state.portfolioData.allocatedMatrix;
    } else {
      const portfolioData = this.portfolioDataService.getPortfolioData();
      if (portfolioData) {
        console.log('Portfolio data retrieved from service:', portfolioData);
        this.totalAmount = portfolioData.totalAmount;
        this.allocatedMatrix = portfolioData.allocatedMatrix;
      } else {
        console.error('No portfolio data available. Redirecting to investment form.');
        this.router.navigate(['/investment-form']);
        return;
      }
    }

    this.renderChart(this.allocatedMatrix);
  }

  renderChart(allocatedMatrix: any[]): void {
    const ctx = document.getElementById('portfolioChart') as HTMLCanvasElement;
    if (!ctx) {
      console.error('Canvas element not found.');
      return;
    }

    const labels = allocatedMatrix.map((item) => item.assetClass);
    const data = allocatedMatrix.map((item) => item.percentage);
    const colors = allocatedMatrix.map((item) => item.color);

    this.chart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: colors,
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw}%`
            }
          },
          legend: {
            position: 'bottom'
          },
          datalabels: {
            formatter: (value, context) => {
              const dataset = context.chart.data.datasets[0].data as number[];
              const total = dataset.reduce((a, b) => a + b, 0);
              return ((value / total) * 100).toFixed(1) + '%';
            },
            color: '#000',
            font: {
              weight: 'bold'
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });
  }

  home(): void {
    this.router.navigate(['/landing']);
  }

  products(): void {
    this.router.navigate(['/products']);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }
}