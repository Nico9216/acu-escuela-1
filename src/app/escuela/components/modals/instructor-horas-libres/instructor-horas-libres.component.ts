import {
  Component,
  OnInit,
  ViewChild,
  Inject,
  AfterViewInit,
  AfterViewChecked,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

import { MatTableDataSource } from '@angular/material/table';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';
import { AcuService } from '@core/services/acu.service';
import { InscripcionCursoComponent } from '../inscripcion-curso/inscripcion-curso.component';
import { ClasesEstimadasDetalleComponent } from '../clases-estimadas-detalle/clases-estimadas-detalle.component';
import {
  ClaseEstimada,
  ClaseEstimadaDetalle,
} from '@core/model/clase-estimada.model';

@Component({
  selector: 'app-instructor-horas-libres',
  templateUrl: './instructor-horas-libres.component.html',
  styleUrls: ['./instructor-horas-libres.component.scss'],
})
export class InstructorHorasLibresComponent implements OnInit {
  displayedColumns: string[] = ['actions', 'Fecha', 'HoraInicio', 'HoraFin'];
  dataSource: MatTableDataSource<ClaseEstimadaDetalle>;

  alumno: string;
  detalle: ClaseEstimadaDetalle[];
  titulo: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<InscripcionCursoComponent>,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.detalle = this.data.clasesEstimadas.detalle;

    // this.alumno = this.data.alumno ? this.data.alumno : '';

    this.titulo = this.data.alumno
      ? `Seleccionar hora libre para: ${this.data.alumno}. `
      : '';
    this.titulo += `Próximas horas libres de: ${this.data.clasesEstimadas.instructorCodigo} -
    ${this.data.clasesEstimadas.instructorNombre}`;

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.data.clasesEstimadas.detalle);
  }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onNoClick(): void {
    this.dialogRef.close();
  }
}
