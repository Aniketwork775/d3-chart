import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TangleChartComponent } from './tangle-chart.component';

describe('TangleChartComponent', () => {
  let component: TangleChartComponent;
  let fixture: ComponentFixture<TangleChartComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TangleChartComponent]
    });
    fixture = TestBed.createComponent(TangleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
