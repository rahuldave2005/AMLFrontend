import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RuleConfigManagementComponent } from './rule-config-management.component';

describe('RuleConfigManagementComponent', () => {
  let component: RuleConfigManagementComponent;
  let fixture: ComponentFixture<RuleConfigManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RuleConfigManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RuleConfigManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
