import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskSelectComponent } from './task-select.component';

describe('TaskSelectComponent', () => {
  let component: TaskSelectComponent;
  let fixture: ComponentFixture<TaskSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
