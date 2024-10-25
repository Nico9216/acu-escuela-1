import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadAlumnosPorInstructorComponent } from './cantidad-alumnos-por-instructor.component';

describe('CantidadAlumnosPorInstructorComponent', () => {
  let component: CantidadAlumnosPorInstructorComponent;
  let fixture: ComponentFixture<CantidadAlumnosPorInstructorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CantidadAlumnosPorInstructorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CantidadAlumnosPorInstructorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
