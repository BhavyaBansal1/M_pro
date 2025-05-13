import { Component, OnInit } from '@angular/core';
import { PortfolioDataService } from '../services/portfoliodata.service';
import { ChartType, ChartConfiguration } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { CommonModule } from '@angular/common';
import { ChartComponent } from '../chart/chart.component';
import { AssetsComponent } from '../asset-alloc/asset-alloc.component';
import { ProductsComponent } from '../product-table/product-table.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-portfolio-page',
  standalone: true,
  imports: [NgChartsModule, CommonModule, ChartComponent, AssetsComponent, ProductsComponent],
  templateUrl: './portfolio-page.component.html',
  styleUrls: ['./portfolio-page.component.css'],
})
export class PortfolioPageComponent implements OnInit {
  portfolioData: any;
  productData: any;
  subClasses: { name: string; percentage: number }[] = [];
  selectedAssetClass: string = '';
  selectedSubClassName: string = '';
  filteredProducts: any[] = [];

  // Chart data
  assetClassChartLabels: string[] = [];
  assetClassChartData: number[] = [];
  pieChartType: ChartType = 'pie';
  assetClassChartColors: string[] = ['#4E79A7', '#F28E2B', '#76B7B2', '#59A14F', '#EDC948'];
  pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  constructor(
    private portfolioDataService: PortfolioDataService,
    private router: Router 
  ) {}

  ngOnInit(): void {
    // Retrieve portfolio data from the service
    this.portfolioData = this.portfolioDataService.getPortfolioData();
    console.log('Portfolio Data:', this.portfolioData);

    this.productData = this.portfolioDataService.getProductData();
    console.log('Product Data:', this.productData);

    if (this.portfolioData) {
      // Populate chart data
      this.assetClassChartLabels = this.portfolioData.allocatedMatrix.map((asset: any) => asset.assetClass);
      this.assetClassChartData = this.portfolioData.allocatedMatrix.map((asset: any) => asset.percentage);
      this.assetClassChartColors = this.portfolioData.allocatedMatrix.map((asset: any) => asset.color);

      // Set default selected asset class and sub-classes
      if (this.portfolioData.allocatedMatrix.length > 0) {
        this.selectedAssetClass = this.portfolioData.allocatedMatrix[0].assetClass;
        this.subClasses = this.portfolioData.allocatedMatrix[0].subAssets;
      }
    }

    this.filterProducts();
  }

  filterProducts(): void {
    const allProducts: any[] = [];
    Object.keys(this.productData).forEach((assetClassKey) => {
      const subClasses = this.productData[assetClassKey];
      Object.keys(subClasses).forEach((subClassKey) => {
        const products = subClasses[subClassKey];
        Object.keys(products).forEach((productKey) => {
          allProducts.push(products[productKey]);
        });
      });
    });

    this.filteredProducts = allProducts.filter((product) => {
      const matchesAssetClass = product.asset_class === this.selectedAssetClass;
      const matchesSubClass = this.selectedSubClassName
        ? product.sub_asset_class === this.selectedSubClassName
        : true;
      console.log('Asset: ', matchesAssetClass);
      console.log('Product:', product.asset_class);
      console.log('Selected: ', this.selectedAssetClass);
      return matchesAssetClass && matchesSubClass;
    });
  }

  onAssetSelected(assetClass: string): void {
    const selectedAsset = this.portfolioData.allocatedMatrix.find((asset: any) => asset.assetClass === assetClass);
    if (selectedAsset) {
      this.selectedAssetClass = selectedAsset.assetClass;
      this.subClasses = selectedAsset.subAssets;
      this.selectedSubClassName = ''; 
      this.filterProducts(); // Update filtered products
    }
  }

  onSubClassSelected(subClassName: string): void {
    this.selectedSubClassName = subClassName;
    this.filterProducts(); // Update filtered products
  }

  logout(): void {
    localStorage.clear(); // Clear local storage
    this.router.navigate(['/login']); // Navigate to the login page
  }

  products(): void {
    this.router.navigate(['/products']); // Navigate to the products page
  }

  input(): void {
    this.router.navigate(['/input']); // Navigate to the input page
  }

  home(): void {
    this.router.navigate(['/landing']); // Navigate to the home page
  }

}