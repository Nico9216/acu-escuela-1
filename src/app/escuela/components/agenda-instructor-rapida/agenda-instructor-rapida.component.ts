import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { SeleccionarAccionAgendaComponent } from '../modals/seleccionar-accion-agenda/seleccionar-accion-agenda.component';
import { SeleccionarFechaComponent } from '../modals/seleccionar-fecha/seleccionar-fecha.component';

import { AcuService } from 'src/app/core/services/acu.service';
import { SuspenderClaseComponent } from '../modals/suspender-clase/suspender-clase.component';
import { Instructor } from '../../../core/model/instructor.model';
import { VerAgendaComponent } from '../../../shared/dialogs/ver-agenda/ver-agenda.component';
import { GenerarClaseAdicionalComponent } from '@escuela/dialogs/generar-clase-adicional/generar-clase-adicional.component';
import { GenerarExamenComponent } from '../modals/generar-examen/generar-examen.component';

import {
  mensajeConfirmacion,
  confirmacionUsuario,
} from '../../../utils/sweet-alert';

import { isMoment, Moment } from 'moment';
import { AgendaElement, DataAgenda, Cell } from '@core/model/interfaces';
import { errorMensaje } from '@utils/sweet-alert';
import { MovilService } from '@core/services/movil.service';
import { AutenticacionService } from '@core/services/autenticacion.service';
import { CopiarMoverParameters } from '@core/model/copiarMoverParameters.model';
import { SeleccionarMovilComponent } from '@escuela/components/modals/seleccionar-movil/seleccionar-movil.component';
import { BloquearHorasComponent } from '../../dialogs/bloquear-horas/bloquear-horas.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-agenda-instructor-rapida',
  templateUrl: './agenda-instructor-rapida.component.html',
  styleUrls: ['./agenda-instructor-rapida.component.scss'],
})
export class AgendaInstructorRapidaComponent implements OnInit, OnDestroy {
  porcentajeGlobal: number = 0;
  name: string;
  sabadoODomingo: number;
  verAgenda: boolean;
  instructorSeleccionado: any;
  instructoresSelect: any[];
  hoy = new Date();
  agendaDisplayedColumns: string[];
  columns: string[] = [];
  agendaDataSource: AgendaElement[];
  agenda: any[] = [];
  instructores: Instructor[] = [];
  horas: any[] = [];
  fechaClase = '';
  fecha: Date;
  auxFechaClase: Date = new Date();
  sedes: string[] = ['Todas', 'Colonia y Yi', 'Car One', 'Carrasco'];
  selectedSede: string = '';
  horaMovilPlano: DataAgenda[] = null;
  private listObservers: Array<Subscription> = [];
  constructor(
    private acuService: AcuService,
    private movilService: MovilService,
    private auth: AutenticacionService,
    public dialog: MatDialog,
    // tslint:disable-next-line: variable-name
    private _bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.fecha = new Date();
    this.selectedSede = localStorage.getItem('selectedSede');
    this.getInstructores();
    this.getAgenda(this.fecha);
  }
  ngOnDestroy(): void {
    this.acuService.cleanStorageAgenda();
    this.listObservers.forEach((sub) => sub.unsubscribe());
  }
  makeDataSource(horas: any[], instructores: any[]) {
    const col: any[] = [];

    for (const i of instructores) {
      const o = {};
      // tslint:disable-next-line: no-string-literal
      o['Instructor'] = i.EscInsId;

      for (const h of horas) {
        const cell = this.existeEnHorasMoviles(h, i);

        o['class' + h.Hora] = cell.class;
        // tslint:disable-next-line: no-string-literal
        o['existe' + h.Hora] = cell.existe;
        o['Hora' + h.Hora] = cell.value;
      }

      // tslint:disable-next-line: no-string-literal
      o['InstructorPorcentaje'] = i.InstructorPorcentaje;
      col.push(o);
    }

    return col;
  }

  existeEnHorasMoviles(hora: any, instructor: any): Cell {
    const cell: Cell = {
      value: '',
      class: '',
      existe: false,
    };
    for (const h of this.horaMovilPlano) {
      if (h.Hora === hora.Hora && h.EscInsId === instructor.EscInsId) {
        switch (h.EsAgCuEst) {
          case 'B':
            cell.value = 'BLOQUEADA';
            break;
          case 'I':
            cell.value = 'AUSENCIA INSTRUCTOR';
            break;
          case 'T':
            cell.value = 'TEORICO';
            break;

          default:
            // tslint:disable-next-line: triple-equals
            cell.value =
              h.AluId != 0
                ? `${h.AluNro} ${h.AluApe1}  ${h.TipCurId}`
                : `${h.TipCurId} ${h.TipCurNom}`;
            break;
        }
        cell.class = h.claseCelda;
        cell.existe = true;
      }
    }
    return cell;
  }

  showAlert(instructor: string, hora: number, existe: boolean): void {
    const celda = document.getElementById(`${instructor}${hora}`);
    celda.getAttribute('class');

    localStorage.setItem('fechaClase', this.fechaClase);
    localStorage.setItem('fecha', JSON.stringify(this.fecha));
    localStorage.setItem('instructor', instructor.toString());
    localStorage.setItem('hora', hora.toString());
    localStorage.setItem('existe', existe.toString());

    localStorage.setItem('tipoAgenda', 'instructor');

    const mainParameters = {
      fecha: this.fechaClase,
      instructor,
      esMovil: false,
      hora,
      class: celda.getAttribute('class'),
      text: celda.innerHTML,
    };

    localStorage.setItem('mainParameters', JSON.stringify(mainParameters));
    const lugar = this.horaMovilPlano.find((h) => {
      if (h.EscInsId === instructor && h.Hora === hora) {
        return h;
      }
    });

    const t = this._bottomSheet.open(SeleccionarAccionAgendaComponent, {
      data: {
        // tslint:disable-next-line: triple-equals
        verOpciones: lugar && lugar.AluId != 0,
        fechaClase: this.fechaClase,
      },
    });

    t.afterDismissed().subscribe(({ seleccionoOpcion, params }) => {
      const liberadoCancelado = params ? params.liberarCancelado : null;

      if (seleccionoOpcion) {
        const abrirAgenda = localStorage.getItem('abrirAgenda');

        switch (abrirAgenda) {
          case 'instructor':
            this.abrirAgenda(instructor, hora);
            break;

          case 'evaluacion-practica-instructor':
            this.generarClaseAdicional(instructor, hora, false);
            break;
          case 'clase-adicional-instructor':
            this.generarClaseAdicional(instructor, hora);
            break;
          case 'examen-instructor':
            this.generarExamen(instructor, hora);
            break;

          case 'suspender-instructor':
            this.suspenderDuplicarClase(instructor, hora, true);
            break;
          case 'duplicar-instructor':
            this.suspenderDuplicarClase(instructor, hora, false);
            break;
          case 'copiar-mover-clase':
            const { oldParameters, mainParameters } = params;
            this.copiarMoverClase(oldParameters, mainParameters);
            break;

          default:
            const refreshAgenda: boolean = Boolean(
              JSON.parse(localStorage.getItem('refreshAgenda'))
            );
            const refreshLiberaAgenda: boolean = Boolean(
              JSON.parse(localStorage.getItem('refreshLiberaAgenda'))
            );

            if (refreshLiberaAgenda) {
              localStorage.removeItem('refreshLiberaAgenda');
              celda.removeAttribute('class');
              celda.innerHTML = '';
              celda.classList.add(
                'cdk-cell',
                'mat-cell',
                `cdk-column-${hora}`,
                `mat-column-${hora}`,
                'cell',
                'ng-star-inserted'
              );
            }

            if (refreshAgenda && !liberadoCancelado) {
              const classOld = localStorage.getItem('classOld');
              const textOld = localStorage.getItem('textOld');

              if (localStorage.getItem('limpiarCeldaOld')) {
                const oldParameters = JSON.parse(
                  localStorage.getItem('copiarMoverParameters')
                );

                const celdaOld = document.getElementById(
                  `${oldParameters.escInsIdOld}${oldParameters.horaOld}`
                );
                celdaOld.removeAttribute('class');

                celdaOld.innerHTML = '';
                celdaOld.classList.add(
                  'cdk-cell',
                  'mat-cell',
                  `cdk-column-${oldParameters.horaOld}`,
                  `mat-column-${oldParameters.horaOld}`,
                  'cell',
                  'ng-star-inserted'
                );
                localStorage.removeItem('copiarMoverParameters');
                localStorage.removeItem('limpiarCeldaOld');
              }

              const arrayClass: string[] = classOld?.split(' ');
              localStorage.removeItem('classOld');
              localStorage.removeItem('textOld');

              localStorage.removeItem('refreshLiberaAgenda');
              celda.removeAttribute('class');
              celda.innerHTML = textOld;
              arrayClass?.forEach((element) => celda.classList.add(element));
              if (abrirAgenda === 'pegar-clase-ok') {
                this.getAgenda(this.fecha);
              }
            }

            break;
        }
      }
    });
  }

  copiarMoverClase(oldParameters, mainParameters) {
    // if( mainParameters.instructor !== oldParameters.escInsIdOld){
    //   return errorMensaje('Error', 'No es posible mover la clase de un instructor hacia otro instructor distinto.')
    // }
    const params: CopiarMoverParameters = {
      accion: oldParameters.accion,
      fechaClaseOld: oldParameters.fechaOld,
      horaClaseOld: oldParameters.horaOld,
      movilOld: oldParameters.movilOld,
      escInsIdOld: oldParameters.escInsIdOld,
      fechaClase: mainParameters.fecha,
      horaClase: mainParameters.hora,
      movil: mainParameters.movil,
      escInsId: mainParameters.instructor,
      esMovil: mainParameters.esMovil,
      userId: this.auth.getUserId(),
    };

    if (params.esMovil) {
      const load1$ = this.acuService
        .copiarMoverClase(params)
        .subscribe((res: any) =>
          this.finalizarCopiarMoverClase(
            res,
            oldParameters,
            mainParameters,
            params
          )
        );
      this.listObservers.push(load1$);
    } else {
      const load1$ = this.acuService
        .copiarMoverInstructorClase(params)
        .subscribe((res: any) => {
          this.finalizarCopiarMoverClase(
            res,
            oldParameters,
            mainParameters,
            params
          );
        });
      this.listObservers.push(load1$);
    }
    // params.esMovil
    //   ? this.acuService
    //       .copiarMoverClase(params)
    //       .subscribe((res: any) =>
    //         this.finalizarCopiarMoverClase(
    //           res,
    //           oldParameters,
    //           mainParameters,
    //           params
    //         )
    //       )
    //   : this.acuService
    //       .copiarMoverInstructorClase(params)
    //       .subscribe((res: any) =>
    //         this.finalizarCopiarMoverClase(
    //           res,
    //           oldParameters,
    //           mainParameters,
    //           params
    //         )
    //       );
  }

  finalizarCopiarMoverClase(res, oldParameters, mainParameters, params) {
    if (res.errorCode === 0) {
      mensajeConfirmacion('Excelente!', res.Msg);
      this.getAgenda(this.fecha);
    } else {
      // if (res.elegirOtroMovil) {
      //   errorMensaje('Oops...', res.Msg).then(() => {
      //     this.movilService
      //       .getMovilesDisponiblesPorFechaHora(
      //         params.fechaClase,
      //         params.horaClase
      //       )
      //       .subscribe((moviles) => {
      //         const movilesDialogRef = this.dialog.open(
      //           SeleccionarMovilComponent,
      //           {
      //             height: 'auto',
      //             width: '700px',
      //             data: {
      //               moviles,
      //             },
      //           }
      //         );

      //         movilesDialogRef.afterClosed().subscribe((movil) => {
      //           if (movil) {
      //             this.copiarMoverClase(oldParameters, {
      //               ...mainParameters,
      //               movil: movil.MovCod,
      //             });
      //           } else {
      //             this.getAgenda(this.fecha);
      //             this.salirCopiarMoverClase(oldParameters);
      //           }
      //         });
      //       });
      //   });
      //   return;
      // } else {
      errorMensaje('Oops...', res.Msg);
      // }
    }
    this.salirCopiarMoverClase(oldParameters);
  }

  salirCopiarMoverClase(oldParameters) {
    localStorage.setItem('classOld', oldParameters.classOld);
    localStorage.setItem('textOld', oldParameters.textOld);
    localStorage.setItem('refreshAgenda', 'true');
  }

  abrirAgenda(instructor: string, hora: number) {
    const load1$ = this.acuService
      .getInstructorAgenda(this.fechaClase, hora, instructor)
      .subscribe((res: any) => {
        const dialogRef = this.dialog.open(VerAgendaComponent, {
          data: {
            agendaCurso: res.AgendaCurso,
            agendaClase: res.AgendaCurso.AgendaClase,
          },
        });

        dialogRef
          .afterClosed()
          .subscribe(
            (resp: any) =>
              resp?.mensaje && mensajeConfirmacion('Confirmado!', resp?.mensaje)
          );
      });
    this.listObservers.push(load1$);
  }

  generarClaseAdicional(
    instructor: string,
    hora: number,
    esClaseAdicional = true
  ) {
    this.getClaseAgendaAndOpenDialog(
      instructor,
      hora,
      GenerarClaseAdicionalComponent,
      false,
      esClaseAdicional
    );
  }

  generarExamen(instructor: string, hora: number) {
    this.getClaseAgendaAndOpenDialog(instructor, hora, GenerarExamenComponent);
  }

  suspenderDuplicarClase(
    instructor: string,
    hora: number,
    esSuspender: boolean
  ) {
    this.getClaseAgendaAndOpenDialog(
      instructor,
      hora,
      SuspenderClaseComponent,
      esSuspender
    );
  }

  getClaseAgendaAndOpenDialog(
    instructor: string,
    hora: number,
    component: any,
    esSuspender?: boolean,
    esClaseAdicional?: boolean
  ) {
    const load1$ = this.acuService
      .getInstructorAgenda(this.fechaClase, hora, instructor)
      .subscribe((res: any) => {
        const dialogRef = this.dialog.open(component, {
          data: {
            agendaCurso: res.AgendaCurso,
            agendaClase: res.AgendaCurso.AgendaClase,
            esSuspender,
            esClaseAdicional,
          },
        });

        dialogRef
          .afterClosed()
          .subscribe((resp: any) =>
            this.obtenerAgendaYConfirmarUsuario(resp?.mensaje)
          );
      });
    this.listObservers.push(load1$);
  }

  liberarDia() {
    confirmacionUsuario(
      'Confirmación de Usuario',
      'ATENCIÓN: Se procederá a liberar las clases, elimnando los registros actuales. ¿Confirma el proceso?'
    ).then((result) => {
      if (result.value) {
        this.accionGeneralDia('liberar');
      }
    });
  }

  moverDia() {
    confirmacionUsuario(
      'Confirmación de Usuario',
      `ATENCIÓN: Se procederá a mover las clases, eliminando los registros actuales.
    ¿Confirma el proceso?`
    ).then((result) => {
      if (result.value) {
        this.accionGeneralDia('mover');
      }
    });
  }

  duplicarDia() {
    confirmacionUsuario(
      'Confirmación de Usuario',
      `ATENCIÓN: Se procederá a duplicar las clases, haciendo una copia los registros actuales a una nueva fecha.
    ¿Confirma el proceso?`
    ).then((result) => {
      if (result.value) {
        this.accionGeneralDia('duplicar');
      }
    });
  }

  accionGeneralDia(accion: string) {
    this.seleccionarFecha().subscribe((fechaSeleccionada: Date) => {
      if (fechaSeleccionada) {
        this.finAccionGeneralDia(fechaSeleccionada, accion);
      }
    });
  }

  finAccionGeneralDia(fechaSeleccionada, accion) {
    if (accion === 'liberar') {
      // acuservice.liberarDiaAgenda
      const load1$ = this.acuService
        .liberarDiaAgenda(fechaSeleccionada)
        .subscribe((response: any) => {
          this.getAgenda(fechaSeleccionada);

          mensajeConfirmacion(
            'Confirmado!',
            'Se libero el día, correctamente.'
          ).then((res2) => {});
        });
      this.listObservers.push(load1$);
    } else {
      confirmacionUsuario(
        'Confirmación de Usuario',
        `ATENCIÓN: Desea marcar las clases para avisar al alumno?`
      ).then((result2) => {
        let EsAgCuAviso = 0;
        if (result2.value) {
          EsAgCuAviso = 1;
        }

        switch (accion) {
          case 'duplicar':
            const load1$ = this.acuService
              .duplicarDiaAgenda({
                fechaClase: this.fecha,
                fechaNueva: fechaSeleccionada,
                EsAgCuAviso,
              })
              .subscribe((resp: any) =>
                this.obtenerAgendaYConfirmarUsuario(resp?.mensaje)
              );
            this.listObservers.push(load1$);
            break;
          case 'mover':
            const load2$ = this.acuService
              .moverDiaAgenda({
                fechaClase: this.fecha,
                fechaNueva: fechaSeleccionada,
                EsAgCuAviso,
              })
              .subscribe((resp: any) =>
                this.obtenerAgendaYConfirmarUsuario(resp?.mensaje)
              );
            this.listObservers.push(load2$);
            break;

          default:
            break;
        }
      });
    }
  }

  obtenerAgendaYConfirmarUsuario(mensaje: string) {
    this.getAgenda(this.fecha);
    if (mensaje) {
      mensajeConfirmacion('Confirmado!', mensaje);
    }
  }

  seleccionarFecha() {
    const fechaDialogRef = this.dialog.open(SeleccionarFechaComponent, {
      height: 'auto',
      width: 'auto',
      data: {
        fecha: this.auxFechaClase,
        invalidFechaAnterior: true,
      },
    });

    return fechaDialogRef.afterClosed();
  }

  diaAnterior() {
    const result = new Date(this.fecha);
    result.setDate(result.getDate() - 1);
    this.sabadoODomingo = result.getDay();
    this.fecha = result;
    this.getAgenda(this.fecha);
  }

  diaSiguiente() {
    this.agendaDataSource = [];
    const result = new Date(this.fecha);
    result.setDate(result.getDate() + 1);
    this.sabadoODomingo = result.getDay();
    this.fecha = result;
    this.getAgenda(this.fecha);
  }

  getAgenda(fecha: Date) {
    this.verAgenda = false;
    const strFecha = this.formatDateToString(fecha);
    const filtro = this.instructorSeleccionado?.EscInsId
      ? this.instructorSeleccionado?.EscInsId
      : 'Todas';

    const load1$ = this.acuService
      .getAgendaPorFecha(strFecha, 'rapida', filtro)
      .subscribe((res: any) => {
        this.agenda = res.TablaAgenda;
        this.instructores = res.TablaAgenda.Instructores;
        this.horas = res.TablaAgenda.Horas;

        this.fechaClase = res.TablaAgenda.FechaClase;
        this.columns = this.horas.map((item) => item.Hora.toString());
        this.horaMovilPlano = res.TablaAgenda.HoraMovilPlano;
        this.agendaDataSource = this.makeDataSource(
          this.horas,
          this.instructores
        );

        // este es un cambio

        this.agendaDisplayedColumns = ['Instructor'];
        this.agendaDisplayedColumns = this.agendaDisplayedColumns.concat(
          this.columns
        );
        // this.agendaDisplayedColumns = this.agendaDisplayedColumns.concat([
        //   'InstructorPorcentaje',
        // ]);
        this.verAgenda = true;
        const cantidadHoras = this.horas.length;
        const cantidadInstructores = this.instructores.length;
        const cantidadHorasTrabajadas = this.horaMovilPlano.length;
        this.porcentajeGlobal =
          cantidadHoras !== 0 && cantidadInstructores !== 0
            ? Math.round(
                (cantidadHorasTrabajadas * 100) /
                  (cantidadInstructores * cantidadHoras)
              )
            : 0;
      });
    this.listObservers.push(load1$);
  }
  getInstructores() {
    this.acuService
      .getInstructores()
      .subscribe((instructores: Instructor[]) => {
        // Assign the data to the data source for the table to render
        this.instructoresSelect = instructores;
        const inst = { EscInsId: 'Todas' };
        this.instructoresSelect.unshift(inst);
        this.instructorSeleccionado = 'Todas';
      });
  }
  cambioUsuAsig(e: any) {
    this.instructorSeleccionado = e.value;
    this.verAgenda = false;
    const strFecha = this.formatDateToString(this.fecha);
    const instId = e.value.EscInsId;
    //this.estadoSeleccionado = 'Todos';

    const load1$ = this.acuService
      .getAgendaPorFecha(strFecha, 'rapida', instId)
      .subscribe((res: any) => {
        this.agenda = res.TablaAgenda;
        this.instructores = res.TablaAgenda.Instructores;
        this.horas = res.TablaAgenda.Horas;

        this.fechaClase = res.TablaAgenda.FechaClase;
        this.columns = this.horas.map((item) => item.Hora.toString());
        this.horaMovilPlano = res.TablaAgenda.HoraMovilPlano;
        this.agendaDataSource = this.makeDataSource(
          this.horas,
          this.instructores
        );

        this.agendaDisplayedColumns = ['Instructor'];
        this.agendaDisplayedColumns = this.agendaDisplayedColumns.concat(
          this.columns
        );

        this.verAgenda = true;
      });
    this.listObservers.push(load1$);
  }
  getPorcentaje = (hora: number) =>
    this.horas.find((h) => h.Hora === hora).HoraPorcentaje;

  formatDateToString(fechaParm: Date | Moment): string {
    let auxFecha: Date;
    if (isMoment(fechaParm)) {
      auxFecha = fechaParm.toDate();
    } else if (fechaParm instanceof Date) {
      auxFecha = fechaParm;
    }
    const fecha = auxFecha;
    this.fecha = auxFecha;
    const day = fecha.getDate();
    const month = fecha.getMonth() + 1;
    const year = fecha.getFullYear();

    let strDay;
    let strMonth;
    const strYear = year.toString();

    if (day < 10) {
      strDay = '0' + day.toString();
    } else {
      strDay = day.toString();
    }

    if (month < 10) {
      strMonth = '0' + month.toString();
    } else {
      strMonth = month.toString();
    }
    return `${strYear}-${strMonth}-${strDay}`;
  }

  bloquearHoras = () => {
    const fechaDialogRef = this.dialog.open(BloquearHorasComponent, {
      height: 'auto',
      width: '700px',
    });

    return fechaDialogRef
      .afterClosed()
      .subscribe(() => this.getAgenda(this.fecha));
  };

  cambiarSede(e: any) {
    localStorage.setItem('selectedSede', e.value);
    this.selectedSede = e.value;
    this.getAgenda(this.fecha);
  }
}
