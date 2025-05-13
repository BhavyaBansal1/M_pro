import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
 
@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './asset-alloc.component.html',
  styleUrls: ['./asset-alloc.component.css'],
})
export class AssetsComponent {
  @Input() type: 'asset' | 'subclass' = 'asset';
  @Input() subClasses: { name: string; percentage: number }[] = [];
  // 🔄 Now emits BOTH asset class name and its sub-classes
  @Output() assetSelected = new EventEmitter<{ name: string; subClasses: { name: string; percentage: number }[] }>();
  @Output() subClassSelected = new EventEmitter<string>();
    
  assetClasses = [
    { name: 'Equity', percentage: 35 },
    { name: 'Fixed Income', percentage: 25 },
    { name: 'Real Estate', percentage: 15 },
    { name: 'Commodities', percentage: 15 },
    { name: 'Cash', percentage: 10 },
  ];
 
  private allSubClasses: { [key: string]: { name: string; percentage: number }[] } = {
    'Equity': [
      { name: 'Large Cap', percentage: 50 },
      { name: 'Mid Cap', percentage: 30 },
      { name: 'Small Cap', percentage: 20 },
    ],
    'Fixed Income': [
      { name: 'Gov. Bonds', percentage: 40 },
      { name: 'Corp. Bonds', percentage: 35 },
      { name: 'Fixed Deposit', percentage: 25 },
    ],
    'Real Estate': [
      { name: 'REITs', percentage: 50 },
      { name: 'Residential Property', percentage: 30 },
      { name: 'Commercial Property', percentage: 20 },
    ],
    'Commodities': [
      { name: 'Precious Metals', percentage: 40 },
      { name: 'Energy', percentage: 30 },
      { name: 'Agriculture', percentage: 30 },
    ],
    'Cash': [
      { name: 'Liquid Mutual Fund', percentage: 50 },
      { name: 'Savings Account', percentage: 30 },
      { name: 'T - Bill', percentage: 20 },
    ]
  };
 
  selectAsset(name: string) {
    const selectedSubClasses = this.allSubClasses[name] || [];
 
    // 🔄 Emit both asset class name and sub-classes
    this.assetSelected.emit({ name, subClasses: selectedSubClasses });
  }
 
  selectSubClass(name: string) {
    this.subClassSelected.emit(name);
  }

}
 
 



