import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserInputService, UserInput } from '../services/user-input.service';
import { CommonModule } from '@angular/common';
import { PortfolioDataService } from '../services/portfoliodata.service';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-investment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './investment-form.component.html',
  styleUrls: ['./investment-form.component.css'],
})

export class InvestmentFormComponent implements OnInit {
  investmentForm!: FormGroup;
  isWeb2SpeechEnabled: boolean = true;  // Flag to toggle Web2Speech

  toggleWeb2Speech(): void {
    // this.isWeb2SpeechEnabled = !this.isWeb2SpeechEnabled;
  }


  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userInputService: UserInputService,
    private portfolioDataService: PortfolioDataService,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.investmentForm = this.fb.group({
      goal: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(18), Validators.max(100)]],
      targetAmount: ['', [Validators.required, Validators.min(10000), Validators.max(100000000)]],
      riskTolerance: ['', Validators.required],
      investmentHorizon: ['', Validators.required],
    });
  }

  selectHorizon(horizon: string): void {
    this.investmentForm.get('investmentHorizon')?.setValue(horizon);
  }

  selectRisk(risk: string): void {
    this.investmentForm.get('riskTolerance')?.setValue(risk);
  }

  onSubmit(): void {
    if (this.investmentForm.valid) {
      const userInput: UserInput = this.investmentForm.value;

      this.userInputService.submitUserInput(userInput).subscribe({
        next: (response) => {
          console.log('Submission successful:', response);
          // Prepare the payload for the API request
          const payload = {
            allocationResult: response,
            targetAmount: userInput.targetAmount,
            investmentHorizon: userInput.investmentHorizon,
          };
          console.log('Payload for API:', payload);

          // Prepare the portfolio data with sub-assets
          const portfolioData = {
            totalAmount: userInput.targetAmount,
            allocatedMatrix: [
              {
                assetClass: 'Equity',
                percentage: response.assets.equity.percentage,
                subAssets: Object.entries(response.assets.equity.subAssets).map(([name, percentage]) => ({
                  name,
                  percentage,
                })),
                color: '#4E79A7',
              },
              {
                assetClass: 'Fixed Income',
                percentage: response.assets.fixedIncome.percentage,
                subAssets: Object.entries(response.assets.fixedIncome.subAssets).map(([name, percentage]) => ({
                  name,
                  percentage,
                })),
                color: '#F28E2B',
              },
              {
                assetClass: 'Commodities',
                percentage: response.assets.commodities.percentage,
                subAssets: Object.entries(response.assets.commodities.subAssets).map(([name, percentage]) => ({
                  name,
                  percentage,
                })),
                color: '#76B7B2',
              },
              {
                assetClass: 'Cash',
                percentage: response.assets.cash.percentage,
                subAssets: Object.entries(response.assets.cash.subAssets).map(([name, percentage]) => ({
                  name,
                  percentage,
                })),
                color: '#59A14F',
              },
              {
                assetClass: 'Real Estate',
                percentage: response.assets.realEstate.percentage,
                subAssets: Object.entries(response.assets.realEstate.subAssets).map(([name, percentage]) => ({
                  name,
                  percentage,
                })),
                color: '#EDC948',
              },
            ],
          };
          console.log('Portfolio Data:', portfolioData);
          // Save the portfolio data in the service
          this.portfolioDataService.setPortfolioData(portfolioData);

          // Navigate to the portfolio page
          console.log('Navigating to portfolio with state:', { portfolioData });
          this.http.post(`http://localhost:5251/api/ProductAllocation/calculate-product-allocations`, response, {
            params: {
              targetAmount: userInput.targetAmount.toString(),
              investmentHorizon: userInput.investmentHorizon,
            },
          }).subscribe({
            next: (data) => {
              console.log('Product Allocations calculated successfully:', data);
              this.portfolioDataService.setProductData(data);
              this.router.navigate(['/portfolio']);
            },
            error: (error) => {
              console.error('Error calculating product allocations:', error);
            },
          });
        },
        error: (error) => {
          console.error('Submission failed:', error);
        },
      });
    } else {
      console.log('Form is invalid');
      this.investmentForm.markAllAsTouched();
    }
  }

  home(): void {
    this.router.navigate(['/landing']);
  }

  products(): void {
    this.router.navigate(['/products']);
  }

  logout(): void {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

  speakText(text: string): void {
    if (!this.isWeb2SpeechEnabled) {
      return; // ⛔ Skip speaking if toggle is off
    }

    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
    }

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    speech.pitch = 1;
    speech.rate = 1;
    window.speechSynthesis.speak(speech);
  }


}
