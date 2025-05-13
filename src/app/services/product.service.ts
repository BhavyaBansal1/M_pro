import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ProductDTO {
  // name: string;
  // assetClass: string;
  // return: string;
  // description: string;

  productName: string;
  annualReturn:number;
  assetClass: string;
  SubAssetClass: string;
  Liquidity: string;
  Pros:string[];
  Cons:string[];
  riskLevel: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiUrl = 'http://localhost:5251/api/Products/products';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<ProductDTO[]> {
    return this.http.get<ProductDTO[]>(this.apiUrl);
  }
}