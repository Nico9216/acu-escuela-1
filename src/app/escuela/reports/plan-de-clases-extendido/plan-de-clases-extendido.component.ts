import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AlumnoService } from '@core/services/alumno.service';
import { ReportesService } from '@core/services/reportes.service';
import { SeleccionarAlumnoComponent } from '@escuela/components/modals/seleccionar-alumno/seleccionar-alumno.component';
import { downloadFileFromBase64, openSamePDF } from '@utils/utils-functions';

@Component({
  selector: 'app-plan-de-clases-extendido',
  templateUrl: './plan-de-clases-extendido.component.html',
  styleUrls: ['./plan-de-clases-extendido.component.scss'],
})
export class PlanDeClasesExtendidoComponent implements OnInit {
  form: FormGroup;
  aluId: number = null;

  get alumnoNumero() {
    return this.form.get('alumnoNumero');
  }
  get alumnoNombre() {
    return this.form.get('alumnoNombre');
  }
  constructor(
    private formBuilder: FormBuilder,
    private alumnoService: AlumnoService,
    public dialog: MatDialog,
    private reportesService: ReportesService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      alumnoNumero: [null, Validators.required],
      alumnoNombre: [null],
    });

    this.alumnoNombre.disable();
  }

  seleccionarAlumno() {
    this.alumnoService
      .obtenerAlumnos(5, 1, '')
      .subscribe((res: any) =>
        this.openDialogAlumnos(res.alumnos, res.cantidad)
      );
  }

  private openDialogAlumnos(alumnos, cantidad) {
    const alumnosDialogRef = this.dialog.open(SeleccionarAlumnoComponent, {
      height: 'auto',
      width: '700px',
      data: {
        alumnos,
        cantidad,
      },
    });

    alumnosDialogRef.afterClosed().subscribe((alumno) => {
      if (alumno) {
        this.aluId = alumno.AluId;
        this.form.patchValue({
          alumnoNumero: alumno.AluNro,
          alumnoNombre: alumno.AluNomComp,
        });
      }
    });
  }

  generarReporte(event, action: string) {
    if (action == 'completo') {
      this.reportesService
        .getPDFPlanDeClases(
          { AluId: this.aluId },
          null,
          null,
          null,
          'wsPDFPlanDeClasesExtendido'
        )
        .subscribe((pdf: any) => {
          openSamePDF(pdf, 'PlanDeClasesExtendido');
        });
    } else {
      this.reportesService
        .getPDFPlanDeClases(
          { AluId: this.aluId },
          null,
          null,
          null,
          'wsPDFPlanDeClasesExtendidoHasta5Clases'
        )
        .subscribe((pdf: any) => {
          openSamePDF(pdf, 'PlanDeClasesExtendido');
        });
    }
  }
}
