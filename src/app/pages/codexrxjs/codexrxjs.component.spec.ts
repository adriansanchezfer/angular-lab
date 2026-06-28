import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodexrxjsComponent } from './codexrxjs.component';

describe('CodexrxjsComponent', () => {
  let component: CodexrxjsComponent;
  let fixture: ComponentFixture<CodexrxjsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexrxjsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodexrxjsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should include the main RxJS examples', () => {
    const titles = component.examples.map(example => example.title);

    expect(titles).toContain('map');
    expect(titles).toContain('filter');
    expect(titles).toContain('switchMap');
    expect(titles).toContain('catchError');
  });
});
