import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrFilingComponent } from './str-filing.component';

describe('StrFilingComponent', () => {
  let component: StrFilingComponent;
  let fixture: ComponentFixture<StrFilingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StrFilingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StrFilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
