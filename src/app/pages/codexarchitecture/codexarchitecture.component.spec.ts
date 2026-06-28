import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodexarchitectureComponent } from './codexarchitecture.component';

describe('CodexarchitectureComponent', () => {
  let component: CodexarchitectureComponent;
  let fixture: ComponentFixture<CodexarchitectureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexarchitectureComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodexarchitectureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
