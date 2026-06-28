import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodexsignalsComponent } from './codexsignals.component';

describe('CodexsignalsComponent', () => {
  let component: CodexsignalsComponent;
  let fixture: ComponentFixture<CodexsignalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexsignalsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodexsignalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
