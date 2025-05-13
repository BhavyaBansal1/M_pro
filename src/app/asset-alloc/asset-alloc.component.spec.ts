import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetsComponent } from './asset-alloc.component';

describe('AssetAllocComponent', () => {
  let component: AssetsComponent;
  let fixture: ComponentFixture<AssetsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
