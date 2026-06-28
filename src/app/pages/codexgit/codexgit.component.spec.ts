import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CodexgitComponent } from './codexgit.component';

describe('CodexgitComponent', () => {
  let component: CodexgitComponent;
  let fixture: ComponentFixture<CodexgitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CodexgitComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CodexgitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should include commands for team workflows', () => {
    const titles = component.commands.map(command => command.title);

    expect(titles).toContain('git pull');
    expect(titles).toContain('Resolver conflictos');
  });

  it('should include secondary interview commands outside the main flow', () => {
    const titles = component.secondaryCommands.map(command => command.title);

    expect(titles).toContain('git commit --amend');
    expect(titles).toContain('git squash');
    expect(titles).toContain('git cherry-pick');
    expect(titles).toContain('git revert');
  });
});
