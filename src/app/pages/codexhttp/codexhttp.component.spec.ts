import { provideHttpClient } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodexhttpComponent } from './codexhttp.component';

describe('CodexhttpComponent', () => {
  let component: CodexhttpComponent;
  let fixture: ComponentFixture<CodexhttpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexhttpComponent],
      providers: [provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(CodexhttpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
