import { Component, OnInit } from '@angular/core';
import { ProductService, ProductDTO } from '../services/product.service'; // Ensure correct import path
import { Router } from '@angular/router';
import { NgModel } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
 
@Component({
  standalone:true,
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
  imports:[FormsModule,CommonModule]
})
export class ProductsComponent implements OnInit {
  products: ProductDTO[] = [];
  searchQuery: string = '';
  loading: boolean = false;
 
  constructor(private productService: ProductService, private router: Router) {}
 
  ngOnInit(): void {
    this.fetchProducts();
  }
 
  fetchProducts(): void {
    this.productService.getProducts().subscribe({
      next: (data: ProductDTO[]) => {
        console.log('Fetched Products:', data);  
        this.products = data || [];
        this.loading = false;
      },
      error: () => {  
        // console.error('Failed to fetch products:');
        this.products = [];  
        this.loading = false;
      }
    });
  }
 
  get filteredProducts(): ProductDTO[] {
    const query = this.searchQuery?.toLowerCase() || '';
    return this.products
      .sort((a, b) => (b.annualReturn || 0) - (a.annualReturn || 0)) // Sort by annual return in descending order
      .filter(p => {
        const productNameFirstWord = p?.productName?.split(' ')[0]?.toLowerCase() || '';
        const assetClassName = p?.assetClass?.toLowerCase() || '';
        return productNameFirstWord.startsWith(query) || assetClassName.startsWith(query);
      });
  }
 
  // Navigate to the dashboard/home page
  home():void {
    this.router.navigate(['/landing']);
  }
 
  // Log out the user and clear local storage
  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}