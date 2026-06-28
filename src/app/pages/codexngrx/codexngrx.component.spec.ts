import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodexngrxComponent } from './codexngrx.component';

describe('CodexngrxComponent', () => {
  let component: CodexngrxComponent;
  let fixture: ComponentFixture<CodexngrxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexngrxComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodexngrxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
