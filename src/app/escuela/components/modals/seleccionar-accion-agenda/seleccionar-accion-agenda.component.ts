import { Component, Inject } from '@angular/core';
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';

import { AcuService } from 'src/app/core/services/acu.service';

import {
  confirmacionUsuario,
  errorMensaje,
} from '../../../../utils/sweet-alert';
import { AltaAgeInst } from './../../../../core/model/AltaAgeInst';
import * as moment from 'moment';

import { FechaXDiasAnteriorAHoy } from '@utils/utils-functions';
import Swal from 'sweetalert2';
import { AutenticacionService } from '@core/services/autenticacion.service';
import { InstructorService } from '@core/services/instructor.service';
@Component({
  selector: 'app-seleccionar-accion-agenda',
  templateUrl: './seleccionar-accion-agenda.component.html',
  styleUrls: ['./seleccionar-accion-agenda.component.scss'],
})
export class SeleccionarAccionAgendaComponent {
  today = new Date(moment().toDate().setHours(0, 0, 0, 0));
  pegar: boolean;
  verOpciones: boolean;
  fechaClase: Date;
  usuarioConPermiso: boolean = false;
  fechaAnteriorMaxima;
  private usuarioConPermisoNombre: string[] = [
    'PARRECHE',
    'VMARI',
    'RRUBIO',
    'NBENTOS',
  ]; //Solo este usuario podra mover y suspender clases de hasta 3 días pasados.

  constructor(
    private _bottomSheetRef: MatBottomSheetRef<SeleccionarAccionAgendaComponent>,
    private acuService: AcuService,
    public dialog: MatDialog,
    private auth: AutenticacionService,
    private instrService: InstructorService,

    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.fechaClase = moment(this.data.fechaClase).toDate();
    const usuLocalSt: string = localStorage
      .getItem('usrId')
      .toLocaleUpperCase();
    if (usuLocalSt) {
      if (this.usuarioConPermisoNombre.includes(usuLocalSt)) {
        this.usuarioConPermiso = true;
      }
    }

    this.verOpciones = this.data.verOpciones;
    this.pegar = JSON.parse(localStorage.getItem('pegar-clase'));
    //TODO 3 días atras....
    this.fechaAnteriorMaxima = new Date(FechaXDiasAnteriorAHoy(120)); // La fecha de 3 días para atras.
  }

  openLink(event: MouseEvent, key: string): void {
    const tipoAgenda = localStorage.getItem('tipoAgenda');
    const existe: boolean = JSON.parse(localStorage.getItem('existe'));
    const mainParameters = JSON.parse(localStorage.getItem('mainParameters'));

    localStorage.removeItem('abrirAgenda');
    let continuar = false;
    switch (key) {
      case 'abrir-clase':
        localStorage.setItem('abrirAgenda', tipoAgenda);
        continuar = true;
        break;

      case 'examen-clase':
        localStorage.setItem('abrirAgenda', `examen-${tipoAgenda}`);
        continuar = true;
        break;

      case 'clase-adicional':
        localStorage.setItem('abrirAgenda', `clase-adicional-${tipoAgenda}`);
        continuar = true;
        break;

      case 'evaluacion-practica':
        localStorage.setItem(
          'abrirAgenda',
          `evaluacion-practica-${tipoAgenda}`
        );
        continuar = true;
        break;

      case 'suspender-clase':
        //localStorage.setItem('abrirAgenda', `suspender-${tipoAgenda}`);

        const nroAlumno = mainParameters.text.slice(1, 6);
        const age: AltaAgeInst = {
          Aluid: 0,
          Tipcurid: 0,
          Inst: mainParameters.instructor,
          Hora: mainParameters.hora,
          Usuario: this.auth.getUserId(),
          Fecha: mainParameters.fecha,
        };
        Swal.fire({
          title: `¿Segur@ que desea liberar la clase del alumno ${nroAlumno} con fecha ${moment(
            age.Fecha
          ).format('DD-MM-YYYY')} a la hora ${age.Hora} con el instructor ${
            age.Inst
          }?`,
          showCancelButton: true,
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Si',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.acuService.bajaAgendaInst(age).subscribe((resp) => {
              this.cerrarBottomSheet(true, event);
              Swal.fire({
                title: 'Excelente!',
                text: resp,
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              });
            });
          } else {
            this.cerrarBottomSheet(true, event, { liberarCancelado: true });
          }
        });

        break;

      case 'teorico-clase':
        //localStorage.setItem('abrirAgenda', `suspender-${tipoAgenda}`);
        continuar = true;
        const age2: AltaAgeInst = {
          Aluid: 0,
          Tipcurid: 0,
          Inst: mainParameters.instructor,
          Hora: mainParameters.hora,
          Usuario: this.auth.getUserId(),
          Fecha: mainParameters.fecha,
        };
        Swal.fire({
          title: `¿Segur@ que desea dar alta una clase torica para la fecha ${moment(
            age2.Fecha
          ).format('DD-MM-YYYY')} a la hora ${age2.Hora} con el instructor ${
            age2.Inst
          }?`,
          showCancelButton: true,
          cancelButtonColor: '#d33',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Si',
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          if (result.isConfirmed) {
            this.instrService.altaHoraTeorico(age2).subscribe(() => {
              Swal.fire({
                title: 'Excelente!',
                text: 'Alta exitosa',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false,
              }).then(() => {
                window.location.reload();
              });
            });
          }
        });

        break;

      case 'duplicar-clase':
        localStorage.setItem('abrirAgenda', `duplicar-${tipoAgenda}`);
        continuar = true;
        break;

      case 'mover-clase':
      case 'copiar-clase': // setItem('abrirAgenda', tipoAgenda);
        const copiarMoverParameters = {
          accion: key === 'mover-clase' ? 'MOVER' : 'COPIAR',
          fechaOld: mainParameters.fecha,
          movilOld: mainParameters.movil,
          escInsIdOld: mainParameters.instructor,
          horaOld: mainParameters.hora,
          classOld: mainParameters.class,
          textOld: mainParameters.text,
        };

        localStorage.setItem(
          'copiarMoverParameters',
          JSON.stringify(copiarMoverParameters)
        );

        this.setPegarStorage();
        continuar = true;
        break;

      case 'pegar-clase':
        const oldParameters = JSON.parse(
          localStorage.getItem('copiarMoverParameters')
        );

        if (existe) {
          errorMensaje('Oops...', 'Ese turno ya esta ocupado, elegí otro!');
        } else {
          continuar = false;
          if (oldParameters.fechaOld > mainParameters.fecha) {
            confirmacionUsuario(
              'Confirmación de usuario',
              'ATENCIÓN: La fecha seleccionada es anterior a la actual. ¿Confirma continuar?'
            ).then((result) => {
              if (result.value) {
                this.copiarMoverClase(oldParameters, mainParameters, event);
              }
            });
          } else {
            this.copiarMoverClase(oldParameters, mainParameters, event);
          }
        }
        break;

      case 'cancelar':
        this.setPegarStorage();
        localStorage.setItem('abrirAgenda', `pegar-clase-ok`);
        continuar = true;
        break;

      default:
        this.acuService.cleanStorageAgenda();
        continuar = true;
        break;
    }

    if (continuar) {
      this.cerrarBottomSheet(true, event);
    }
  }

  copiarMoverClase(oldParameters, mainParameters, event) {
    localStorage.setItem('abrirAgenda', 'copiar-mover-clase');
    this.setPegarStorage();
    this.cerrarBottomSheet(true, event, {
      oldParameters,
      mainParameters,
      event,
    });
  }

  cerrarBottomSheet(correcto?: boolean, event?: Event, params?) {
    this._bottomSheetRef.dismiss({ seleccionoOpcion: correcto, params });
    event.preventDefault();
  }

  setPegarStorage() {
    this.pegar = !this.pegar;
    localStorage.setItem('pegar-clase', this.pegar.toString());
  }
}
