import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComponentsHome } from './components-home';

describe('ComponentsHome', () => {
  let component: ComponentsHome;
  let fixture: ComponentFixture<ComponentsHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComponentsHome],
    }).compileComponents();

    fixture = TestBed.createComponent(ComponentsHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
