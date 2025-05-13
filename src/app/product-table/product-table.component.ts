import { Component, OnInit, OnChanges, SimpleChanges,Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Product {
  id: number;
  name: string;
  percentage: number;
  amount: number;
  return: number;
  assetClass: string;
  subclass: string;
  pros: string;
  cons: string;
  liquidity: string;
  risk: string;
}

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.css'],
})
export class ProductsComponent implements OnInit, OnChanges {
  @Input() selectedAssetClass: string = '';
  @Input() selectedSubClass: string = '';
    products: Product[] = [];
    filteredProducts: Product[] = [];
  
    constructor(private http: HttpClient) {}
  
    ngOnInit() {
      this.http.get<any>('').subscribe((data) => {
        this.products = this.flattenProductsData(data);
        this.filterProducts(); 
      });
    }
  
    ngOnChanges(changes: SimpleChanges) {
      // Only run filter if products are already loaded
      if (this.products.length > 0) {
        this.filterProducts();
      }
    }
  
    flattenProductsData(data: any): Product[] {
      const allProducts: Product[] = [];
      for (const assetClass in data) {
        for (const subclass in data[assetClass]) {
          const subclassProducts = data[assetClass][subclass];
          subclassProducts.forEach((product: any) => {
            allProducts.push({
              ...product,
              assetClass,
              subclass,
            });
          });
        }
      }
      return allProducts;
    }
  
    filterProducts() {
      let filtered = this.products;
  
      if (this.selectedAssetClass) {
        filtered = filtered.filter((product) =>
          product.assetClass.toLowerCase().includes(this.selectedAssetClass.toLowerCase())
        );
      }
  
      if (this.selectedSubClass) {
        filtered = filtered.filter((product) =>
          product.subclass.toLowerCase().includes(this.selectedSubClass.toLowerCase())
        );
      }
  
      this.filteredProducts = filtered;
    }
  }
  