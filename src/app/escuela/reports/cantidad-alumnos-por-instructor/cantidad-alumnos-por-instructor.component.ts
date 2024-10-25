import { ReportesService } from './../../../core/services/reportes.service';
import { ListarAlumnosPorInstructor } from './../../../core/model/ListarAlumnosPorInstructor';
import { Component, Inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-cantidad-alumnos-por-instructor',
  templateUrl: './cantidad-alumnos-por-instructor.component.html',
  styleUrls: ['./cantidad-alumnos-por-instructor.component.scss']
})
export class CantidadAlumnosPorInstructorComponent implements OnInit {

  displayedColumns: string[] = ['escinsid', 'cantidadAlumnos'];

  dataSource: MatTableDataSource<ListarAlumnosPorInstructor>;

  constructor(
    private reportesService: ReportesService
  ) {}

  ngOnInit(): void {
    this.reportesService.getReporteAlumnosPorInstructor()
    .subscribe((resp: any) => {
      //console.log(resp);
      this.dataSource=resp
    } )
  }

  

}
