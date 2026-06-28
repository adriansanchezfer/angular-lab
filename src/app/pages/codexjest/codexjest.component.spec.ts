import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodexjestComponent } from './codexjest.component';

describe('CodexjestComponent', () => {
  let component: CodexjestComponent;
  let fixture: ComponentFixture<CodexjestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexjestComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodexjestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
