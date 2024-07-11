import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AlumnoService } from '@core/services/alumno.service';
import { Alumno } from '@core/model/alumno.model';
import { Router } from '@angular/router';
import { confirmacionUsuario, mensajeConfirmacion } from '@utils/sweet-alert';
import { MatDialog } from '@angular/material/dialog';
import { InscripcionesAlumnoComponent } from '../modals/inscripciones-alumno/inscripciones-alumno.component';
import { AgendaClase } from '../../../core/model/agenda-clase.model';
import { environment } from '../../../../environments/environment';
import { ListarClasesEntregadasComponent } from '../listar-clases-entregadas/listar-clases-entregadas.component';

@Component({
  selector: 'app-gestion-alumno',
  templateUrl: './gestion-alumno.component.html',
  styleUrls: ['./gestion-alumno.component.scss'],
})
export class GestionAlumnoComponent implements OnInit {
  displayedColumns: string[] = [
    'actions',
    'AluNro',
    'AluNomComp',
    'AluCI',
    'inscripciones',
  ];

  dataSource: MatTableDataSource<Alumno>;
  verAlumnos: boolean;
  filtro: string = '';

  pageEvent: PageEvent;
  pageIndex: number;
  pageSize = environment.pageSize;
  length: number;
  cantidad = 60000;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private alumnoService: AlumnoService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    const event = this.ejecutoEvent(null);

    // Get the input box
    const input = document.getElementById('search');

    // Init a timeout variable to be used below
    let timeout = null;

    // Listen for keystroke events
    input.addEventListener('keyup', (e) => {
      // Clear the timeout if it has already been set.
      // This will prevent the previous task from executing
      // if it has been less than <MILLISECONDS>
      clearTimeout(timeout);

      // Make a new timeout set to go off in 1000ms (1 second)
      timeout = setTimeout(() => {
        this.getAlumnos(this.pageSize, 1, this.filtro);
      }, 500);
    });
  }

  abmAlumno(modo: string, alumno: Alumno) {
    switch (modo) {
      case 'INS':
        this.alumnoService
          .getAlumnoNumero()
          .subscribe((res: { numero: number }) => {
            this.alumnoService.sendDataAlumno(modo, alumno, res.numero);
            this.router.navigate(['/escuela/abm-alumno']);
          });
        break;
      case 'UPD':
        this.alumnoService.sendDataAlumno(modo, alumno);
        this.router.navigate(['/escuela/abm-alumno']);
        break;
      case 'DLT':
        confirmacionUsuario(
          'Confirmación de Usuario',
          `Está seguro que desea eliminar el alumno: ${alumno.AluNomComp}`
        ).then((res) => {
          if (res.isConfirmed) {
            this.alumnoService
              .gestionAlumno(modo, alumno)
              .subscribe((res: any) => {
                mensajeConfirmacion('Ok', res.Alumno.ErrorMessage).then(
                  (res2) => {
                    this.getAlumnos(this.pageSize, 1, '');
                  }
                );
              });
          }
        });

        break;
      case 'INSC':
        this.alumnoService
          .getDisponibilidadAlumno(alumno.AluId)
          .subscribe((res: { Disponibilidades: AgendaClase[] }) => {
            const inscripcionesDialogRef = this.dialog.open(
              InscripcionesAlumnoComponent,
              {
                height: 'auto',
                width: '700px',
                data: {
                  inscripciones: res.Disponibilidades,
                  alumno: `${alumno.AluNom} ${alumno.AluApe1}`,
                },
              }
            );
          });
        break;
      case 'SHOW':
        //this.alumnoService.GetClasesEntregadasPorAlumno(alumno.AluId);
        this.dialog.open(
          ListarClasesEntregadasComponent,
          {
            maxHeight: '70vh',
            width: '700px',
            data: {
              alumno
            },
          }
        );
      break;
      default:
        break;
    }
  }

  getAlumnos(pageSize, pageNumber, filtro) {
    if (pageNumber === 0) {
      pageNumber = 1;
    }
    this.verAlumnos = false;
    this.alumnoService
      .obtenerAlumnos(pageSize, pageNumber, filtro)
      .subscribe((res: any) => {
        this.length = res.cantidad;
        this.actualizarDatasource(res, pageSize, pageNumber - 1);
      });
  }

  ejecutoEvent(pageEvento: PageEvent) {
    this.pageEvent = pageEvento;
    const filter = this.filtro ? this.filtro : '';

    if (pageEvento) {
      let index = pageEvento.pageIndex;
      this.pageSize = pageEvento.pageSize;
      index += 1;
      // Si estoy retrocediendo saco 1 del index
      if (pageEvento.previousPageIndex > pageEvento.pageIndex) {
        index -= 1;
      }

      this.getAlumnos(pageEvento.pageSize, index, filter);
    } else {
      this.getAlumnos(this.pageSize, 1, '');
    }
    return pageEvento;
  }

  actualizarDatasource(data, size?, index?) {
    this.dataSource = data.alumnos;

    this.verAlumnos = true;

    if (size) {
      this.pageSize = size;
    }

    this.length = data.cantidad;

    if (index) {
      this.pageIndex = index;
    }

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
}
