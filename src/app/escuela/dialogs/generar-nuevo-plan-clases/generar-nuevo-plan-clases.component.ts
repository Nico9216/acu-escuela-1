import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ClaseEstimada } from '@core/model/clase-estimada.model';
import { InstructorService } from '@core/services/instructor.service';

import { confirmacionUsuario, mensajeConfirmacion } from '@utils/sweet-alert';
import {
  generateHorasLibres,
  getDisponibilidadFromInscripcion,
  openSamePDF,
} from '../../../utils/utils-functions';
import { Inscripcion } from '../../../core/model/inscripcion.model';
import { ClasesEstimadasComponent } from '../../components/modals/clases-estimadas/clases-estimadas.component';
import { InscripcionService } from '@core/services/inscripcion.service';
import { GestionInscripcionComponent } from '../../components/gestion-inscripcion/gestion-inscripcion.component';
import * as moment from 'moment';
import { MyValidators } from '@utils/validators';
import { ReportesService } from '@core/services/reportes.service';
import { Curso } from '@core/model/curso.model';

@Component({
  selector: 'app-generar-nuevo-plan-clases',
  templateUrl: './generar-nuevo-plan-clases.component.html',
  styleUrls: ['./generar-nuevo-plan-clases.component.scss'],
})
export class GenerarNuevoPlanClasesComponent implements OnInit {
  form: FormGroup;
  horasLibres = [];

  selected = ' ';
  fechaClase: Date = new Date();
  movil: number;
  instructorAsignado = '';
  curso: string;
  hoy = new Date();
  titulo: string;
  inscripcion: Inscripcion;
  verLimiteClases = false;
  pdeReagendar = false;
  cursoModel: Curso;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<GestionInscripcionComponent>,
    private reportesService: ReportesService,
    private instructorService: InstructorService,
    private inscripcionService: InscripcionService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public data: { inscripcion: Inscripcion; curso: Curso }
  ) {
    this.inscripcion = this.data.inscripcion;
    this.cursoModel = this.data.curso;
    this.horasLibres = generateHorasLibres();
    this.buildForm();
  }

  ngOnInit(): void {
    if (
      this.inscripcion.numeroClases >= Number(this.cantClasesDelCurso.value)
    ) {
      this.pdeReagendar = false;
    } else {
      this.pdeReagendar = true;
    }
  }

  private buildForm() {
    const {
      TipCurId,
      TipCurNom,
      numeroClases,
      EscInsId,
      EscInsNom,
      AluNro,
      AluNomComp,
    } = this.inscripcion;

    const {
      disponibilidadLunes,
      disponibilidadMartes,
      disponibilidadMiercoles,
      disponibilidadJueves,
      disponibilidadViernes,
      disponibilidadSabado,
    } = getDisponibilidadFromInscripcion(this.inscripcion);
    const today = new Date();
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    const cantClasesDelCurso = this.cursoModel.TipCurClaPra;

    this.form = this.formBuilder.group({
      fecha: [tomorrow, MyValidators.fechaAnteriorOIgualAHoy],
      cursoId: [TipCurId],
      cursoNombre: [TipCurNom],
      numeroClase: [numeroClases],
      escInsId: [EscInsId],
      escInsNom: [EscInsNom],
      alumnoNumero: [AluNro],
      alumnoNombre: [AluNomComp],
      disponibilidadLunes: [disponibilidadLunes],
      disponibilidadMartes: [disponibilidadMartes],
      disponibilidadMiercoles: [disponibilidadMiercoles],
      disponibilidadJueves: [disponibilidadJueves],
      disponibilidadViernes: [disponibilidadViernes],
      disponibilidadSabado: [disponibilidadSabado],
      observaciones: [null],
      limitarClases: [false],
      limiteClases: [3],
      cantClasesDelCurso: [cantClasesDelCurso],
    });

    this.cursoId.disable();
    this.cursoNombre.disable();
    this.alumnoNumero.disable();
    this.alumnoNombre.disable();
    this.numeroClase.disable();
    this.escInsId.disable();
    this.escInsNom.disable();
    this.cantClasesDelCurso.disable();
  }

  getInscripcion() {
    const { EscAluCurId, AluId, TipCurId } = this.inscripcion;
    const fecha = moment(this.fecha.value).toISOString();
    this.inscripcionService
      .obtenerInscripcionById(EscAluCurId, AluId, TipCurId, fecha)
      .subscribe((inscripcion) => {
        this.inscripcion = inscripcion;
        this.numeroClase.setValue(this.inscripcion.numeroClases);
      });
  }

  generarPlanClases(event: Event) {
    event.preventDefault();

    if (this.form.invalid) {
      return;
    }

    confirmacionUsuario(
      'Confirmación de Usuario',
      '¿Confirma la generación del nuevo plan de clases ?'
    ).then((confirm) => {
      if (confirm.isConfirmed) {
        const cantidad =
          this.inscripcion.TipCurClaPra - this.inscripcion.numeroClases;
        const inscripcion = {
          AluId: this.inscripcion.AluId,
          TipCurId: this.cursoId.value,
          EsAgCuObs: this.observaciones.value,
          EscAluCurId: this.inscripcion.EscAluCurId,
          disponibilidadLunes: this.disponibilidadLunes.value,
          disponibilidadMartes: this.disponibilidadMartes.value,
          disponibilidadMiercoles: this.disponibilidadMiercoles.value,
          disponibilidadJueves: this.disponibilidadJueves.value,
          disponibilidadViernes: this.disponibilidadViernes.value,
          disponibilidadSabado: this.disponibilidadSabado.value,
          fechaClaseEstimada: this.fecha.value,
          limitarClases: this.limitarClases.value,
          limiteClases: this.limiteClases.value,
          ClasesEstimadas: {},
          usrId: localStorage.getItem('usrId'),
        };

        this.instructorService
          //.getDisponibilidadInstructoresPorCantidadCharp(
          .getDisponibilidadInstructoresPorCantidad(inscripcion, null, cantidad)
          .subscribe((clasesEstimadas) => {
            const clasesEstimadasDialogRef = this.dialog.open(
              ClasesEstimadasComponent,
              {
                height: 'auto',
                width: '700px',
                data: {
                  clasesEstimadas,
                  inscripcion,
                  cantidad,
                },
              }
            );

            clasesEstimadasDialogRef
              .afterClosed()
              .subscribe(
                (result: {
                  continuar: boolean;
                  claseEstimada: ClaseEstimada;
                }) => {
                  const { claseEstimada } = result;
                  inscripcion.ClasesEstimadas = claseEstimada;

                  if (!result.continuar) {
                    return;
                  }

                  this.reportesService
                    .getPDFPlanDeClases(
                      claseEstimada,
                      null,
                      null,
                      null,
                      'wsPDFPlanDeClasesHasta5Clases'
                    )
                    .subscribe((pdf) => {
                      openSamePDF(pdf, 'PlanDeClases');
                    });

                  this.inscripcionService
                    .generarNuevoPlanClases(inscripcion)
                    .subscribe(
                      (res: { errorCode: number; errorMensaje: string }) => {
                        mensajeConfirmacion('Excelente!', res.errorMensaje);
                        this.dialogRef.close();
                      }
                    );
                }
              );
          });
      }
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  get limiteClases() {
    return this.form.get('limiteClases');
  }

  get limitarClases() {
    return this.form.get('limitarClases');
  }

  get fecha() {
    return this.form.get('fecha');
  }
  get cursoId() {
    return this.form.get('cursoId');
  }
  get cursoNombre() {
    return this.form.get('cursoNombre');
  }
  get alumnoNumero() {
    return this.form.get('alumnoNumero');
  }
  get alumnoNombre() {
    return this.form.get('alumnoNombre');
  }
  get numeroClase() {
    return this.form.get('numeroClase');
  }

  get escInsId() {
    return this.form.get('escInsId');
  }
  get escInsNom() {
    return this.form.get('escInsNom');
  }

  get observaciones() {
    return this.form.get('observaciones');
  }
  get disponibilidadLunes() {
    return this.form.get('disponibilidadLunes');
  }

  get disponibilidadMartes() {
    return this.form.get('disponibilidadMartes');
  }

  get disponibilidadMiercoles() {
    return this.form.get('disponibilidadMiercoles');
  }

  get disponibilidadJueves() {
    return this.form.get('disponibilidadJueves');
  }

  get disponibilidadViernes() {
    return this.form.get('disponibilidadViernes');
  }

  get disponibilidadSabado() {
    return this.form.get('disponibilidadSabado');
  }

  get cantClasesDelCurso() {
    return this.form.get('cantClasesDelCurso');
  }
}
