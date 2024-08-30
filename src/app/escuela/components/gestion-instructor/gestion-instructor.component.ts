import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { InstructorService } from '@core/services/instructor.service';
import { Router } from '@angular/router';
import { confirmacionUsuario, mensajeConfirmacion } from '@utils/sweet-alert';
import { Instructor } from '@core/model/instructor.model';
import { MatSelectChange } from '@angular/material/select';
import { FormBuilder, FormGroup } from '@angular/forms';
import { environment } from '@environments/environment';
import { generateEstadosSiNo } from '../../../utils/utils-functions';

@Component({
  selector: 'app-gestion-instructor',
  templateUrl: './gestion-instructor.component.html',
  styleUrls: ['./gestion-instructor.component.scss'],
})
export class GestionInstructorComponent implements OnInit {
  displayedColumns: string[] = [
    'actions',
    'EscInsId',
    'EscInsNom',
    'EscInsTel',
    'EscInsAct',
  ];
  dataSource: MatTableDataSource<Instructor>;
  verInstructor: boolean;
  estados = [];
  instructores: Instructor[];
  form: FormGroup;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  pageSize = environment.pageSize;

  get escInsAct() {
    return this.form.get('escInsAct');
  }

  constructor(
    private fb: FormBuilder,
    private instructorService: InstructorService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
    this.getInstructores('S');
    this.estados = generateEstadosSiNo();
  }

  buildForm() {
    this.form = this.fb.group({
      escInsAct: ['S'],
    });
  }

  verActivos(event: MatSelectChange) {
    const filterValue = event.value;
    const instructores =
      filterValue === '-'
        ? this.instructores
        : this.instructores.filter(
            (instructor) => instructor.EscInsAct === filterValue
          );

    this.dataSource = new MatTableDataSource(instructores);

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abmInstructor(modo: string, instructor: Instructor) {
    switch (modo) {
      case 'INS':
        this.instructorService.sendDataInstructor(modo, instructor, 0);
        this.router.navigate(['/escuela/abm-instructor']);
        // });
        break;
      case 'UPD':
        this.instructorService.sendDataInstructor(modo, instructor);
        this.router.navigate(['/escuela/abm-instructor']);
        break;
      case 'DLT':
        confirmacionUsuario(
          'Confirmación de Usuario',
          `Está seguro que desea eliminar el instructor: ${instructor.EscInsNom}`
        ).then((confirm) => {
          if (confirm.isConfirmed) {
            this.instructorService
              .gestionInstructor(modo, instructor)
              .subscribe((res: any) => {
                mensajeConfirmacion('Ok', res.Instructor.ErrorMessage).then(
                  () => this.getInstructores(this.escInsAct.value)
                );
              });
          }
        });

        break;

      default:
        break;
    }
  }

  getInstructores(EscInsAct?: string) {
    this.verInstructor = false;
    this.instructorService
      .getInstructores()
      .subscribe((instructores: Instructor[]) => {
        this.verInstructor = true;
        // Assign the data to the data source for the table to render
        this.instructores = instructores;
        const auxInstructores =
          EscInsAct === '-'
            ? this.instructores.filter(
                (instructor) =>
                  instructor.EscInsAct === 'S' || instructor.EscInsAct === 'N'
              )
            : this.instructores.filter(
                (instructor) => instructor.EscInsAct === EscInsAct
              );

        this.dataSource = new MatTableDataSource(auxInstructores);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }
}
