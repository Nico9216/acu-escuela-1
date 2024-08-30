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
import { openSamePDF } from '../../../../utils/utils-functions';
import { ReportesService } from '@core/services/reportes.service';
import { InstructorService } from '@core/services/instructor.service';

@Component({
  selector: 'app-clases-estimadas',
  templateUrl: './clases-estimadas.component.html',
  styleUrls: ['./clases-estimadas.component.scss'],
})
export class ClasesEstimadasComponent implements OnInit {
  displayedColumns: string[] = ['EscInsId', 'EscInsNom', 'detalle'];
  dataSource: MatTableDataSource<ClaseEstimada>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    public dialogRef: MatDialogRef<InscripcionCursoComponent>,
    public dialog: MatDialog,
    private reportesService: ReportesService,
    private instructorService: InstructorService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(
      this.data.clasesEstimadas.ClasesEstimadas
    );
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

  verPDF(claseEstimada: ClaseEstimada) {
    if (this.data.desdeInscripcion == 'desdeInscripcion') {
      this.reportesService
        .getPDFPlanDeClases(claseEstimada)
        .subscribe((pdf: any) => {
          openSamePDF(pdf, 'PlanDeClases');
        });
    } else {
      //Cuando es desde regenrar un plan de clases

      this.instructorService
        .getDisponibilidadInstructoresPorCantidad(
          this.data.inscripcion,
          claseEstimada.EscInsId,
          this.data.cantidad
        )
        .subscribe((data: any) => {
          console.log(data.ClasesEstimadas[0]);
          this.reportesService
            .getPDFPlanDeClases(data.ClasesEstimadas[0])
            .subscribe((pdf: any) => {
              openSamePDF(pdf, 'PlanDeClases');
            });
        });
    }
  }

  verDetalle(detalles: any) {
    if (this.data.desdeInscripcion == 'desdeInscripcion') {
      const clasesEstimadasDialogRef = this.dialog.open(
        ClasesEstimadasDetalleComponent,
        {
          height: 'auto',
          width: '700px',
          data: {
            detalles: detalles.Detalle,
          },
        }
      );
    } else {
      //Cuando es desde regenrar un plan de clases
      this.instructorService
        .getDisponibilidadInstructoresPorCantidad(
          this.data.inscripcion,
          detalles.EscInsId,
          this.data.cantidad
        )
        .subscribe((data: any) => {
          console.log(data.ClasesEstimadas[0]);
          const clasesEstimadasDialogRef = this.dialog.open(
            ClasesEstimadasDetalleComponent,
            {
              height: 'auto',
              width: '700px',
              data: {
                detalles: data.ClasesEstimadas[0].Detalle,
              },
            }
          );
        });
    }
  }

  seleccionarEstimacion(claseEstimada: ClaseEstimada) {
    if (this.data.desdeInscripcion == 'desdeInscripcion') {
      this.dialogRef.close({
        salir: false,
        continuar: true,
        claseEstimada,
      });
    } else {
      //Cuando es desde regenrar un plan de clases
      this.instructorService
        .getDisponibilidadInstructoresPorCantidad(
          this.data.inscripcion,
          claseEstimada.EscInsId,
          this.data.cantidad
        )
        .subscribe((data: any) => {
          console.log(data.ClasesEstimadas[0]);
          this.dialogRef.close({
            salir: false,
            continuar: true,
            claseEstimada: data.ClasesEstimadas[0],
          });
        });
    }
  }

  onSalir(): void {
    this.dialogRef.close({
      salir: true,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
