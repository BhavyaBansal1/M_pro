import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserInputService {
  private apiUrl = 'http://localhost:5251/api/Allocation/compute';

  constructor(private http: HttpClient) {}

  submitUserInput(data: UserInput): Observable<any> {
    return this.http.post<any>(this.apiUrl, data);
  }
}

export interface UserInput {
  riskTolerance: string;
  investmentHorizon: string;
  age: number;
  goal: string;
  targetAmount: number;
}