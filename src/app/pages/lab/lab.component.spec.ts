import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsLab } from './lab.component';

describe('ComponentsLab', () => {
  let component: ComponentsLab;
  let fixture: ComponentFixture<ComponentsLab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentsLab],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentsLab);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
