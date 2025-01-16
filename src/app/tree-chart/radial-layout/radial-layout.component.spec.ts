import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadialLayoutComponent } from './radial-layout.component';

describe('RadialLayoutComponent', () => {
  let component: RadialLayoutComponent;
  let fixture: ComponentFixture<RadialLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RadialLayoutComponent]
    });
    fixture = TestBed.createComponent(RadialLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
