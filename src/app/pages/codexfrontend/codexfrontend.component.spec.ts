import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodexfrontendComponent } from './codexfrontend.component';

describe('CodexfrontendComponent', () => {
  let component: CodexfrontendComponent;
  let fixture: ComponentFixture<CodexfrontendComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexfrontendComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodexfrontendComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should include practical frontend practices', () => {
    expect(component.examples.length).toBeGreaterThan(5);
  });
});
