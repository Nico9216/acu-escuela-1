import { NgModule, LOCALE_ID } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EscuelaRoutingModule } from './escuela-routing.module';
import { AgendaMovilComponent } from './components/agenda-movil/agenda-movil.component';
import { AgendaInstructorComponent } from './components/agenda-instructor/agenda-instructor.component';
import { AgendaCursoComponent } from './components/modals/agenda-curso/agenda-curso.component';
import { AltaAlumnoComponent } from './components/modals/alta-alumno/alta-alumno.component';
import { FacturaRutComponent } from './components/modals/factura-rut/factura-rut.component';
import { InscripcionCursoComponent } from './components/modals/inscripcion-curso/inscripcion-curso.component';
import { PedirCantidadClasesComponent } from './components/modals/pedir-cantidad-clases/pedir-cantidad-clases.component';
import { SeleccionarAccionAgendaComponent } from './components/modals/seleccionar-accion-agenda/seleccionar-accion-agenda.component';
import { SeleccionarAlumnoComponent } from './components/modals/seleccionar-alumno/seleccionar-alumno.component';
import { SeleccionarCursoComponent } from './components/modals/seleccionar-curso/seleccionar-curso.component';
import { SeleccionarFechaComponent } from './components/modals/seleccionar-fecha/seleccionar-fecha.component';
import { SeleccionarInstructorComponent } from './components/modals/seleccionar-instructor/seleccionar-instructor.component';
import { SeleccionarItemsFacturarComponent } from './components/modals/seleccionar-items-facturar/seleccionar-items-facturar.component';
import { NavComponent } from './components/nav/nav.component';
import { MaterialModule } from '../material/material.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';

import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import {
  MAT_DATE_LOCALE,
  MAT_DATE_FORMATS,
  DateAdapter,
} from '@angular/material/core';
import { AgendarClaseComponent } from './components/modals/agendar-clase/agendar-clase.component';
import { SeleccionarSocioComponent } from './components/modals/seleccionar-socio/seleccionar-socio.component';
import { ClasesEstimadasComponent } from './components/modals/clases-estimadas/clases-estimadas.component';
import { ClasesEstimadasDetalleComponent } from './components/modals/clases-estimadas-detalle/clases-estimadas-detalle.component';
import { GestionCursoComponent } from './components/gestion-curso/gestion-curso.component';
import { GestionInstructorComponent } from './components/gestion-instructor/gestion-instructor.component';
import { GestionAlumnoComponent } from './components/gestion-alumno/gestion-alumno.component';
import { AbmAlumnoComponent } from './components/abm-alumno/abm-alumno.component';
import { AbmInstructorComponent } from './components/abm-instructor/abm-instructor.component';
import { AbmCursoComponent } from './components/abm-curso/abm-curso.component';

import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { SeleccionarItemCursoComponent } from './components/modals/seleccionar-item-curso/seleccionar-item-curso.component';
import { SuspenderClaseComponent } from './components/modals/suspender-clase/suspender-clase.component';
import { InstructorHorasLibresComponent } from './components/modals/instructor-horas-libres/instructor-horas-libres.component';
import { GestionInscripcionComponent } from './components/gestion-inscripcion/gestion-inscripcion.component';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';

import localeEsUy from '@angular/common/locales/global/es-UY';
import localeEs from '@angular/common/locales/global/es';
import { registerLocaleData } from '@angular/common';
import { InscripcionesAlumnoComponent } from './components/modals/inscripciones-alumno/inscripciones-alumno.component';
import { DisponibilidadAlumnoComponent } from './components/modals/disponibilidad-alumno/disponibilidad-alumno.component';
import { AbmInscripcionComponent } from './components/abm-inscripcion/abm-inscripcion.component';
import { GestionMovilComponent } from './components/gestion-movil/gestion-movil.component';
import { AbmMovilComponent } from './components/abm-movil/abm-movil.component';
import { GenerarExamenComponent } from './components/modals/generar-examen/generar-examen.component';
import { SeleccionarMovilComponent } from './components/modals/seleccionar-movil/seleccionar-movil.component';
import { TestComponent } from './components/test/test.component';
import { EnviarNotificacionComponent } from './components/modals/enviar-notificacion/enviar-notificacion.component';
import { SeleccionarInscripcionComponent } from './dialogs/seleccionar-inscripcion/seleccionar-inscripcion.component';
import { GestionExamenComponent } from './pages/gestion-examen/gestion-examen.component';
import { AbmExamenComponent } from './pages/abm-examen/abm-examen.component';
import { GenerarClaseAdicionalComponent } from './dialogs/generar-clase-adicional/generar-clase-adicional.component';
import { CambiarContraseniaComponent } from './dialogs/cambiar-contrasenia/cambiar-contrasenia.component';
import { GenerarNuevoPlanClasesComponent } from './dialogs/generar-nuevo-plan-clases/generar-nuevo-plan-clases.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { FacturacionPorItemComponent } from './reports/facturacion-por-item/facturacion-por-item.component';
import { SeleccionarItemComponent } from './dialogs/seleccionar-item/seleccionar-item.component';
import { CantidadClasesPorAlumnoPorMesComponent } from './reports/cantidad-clases-por-alumno-por-mes/cantidad-clases-por-alumno-por-mes.component';
import { CantidadClasesPorPeriodoComponent } from './reports/cantidad-clases-por-periodo/cantidad-clases-por-periodo.component';
import { InicioCursoPorPeriodoComponent } from './reports/inicio-curso-por-periodo/inicio-curso-por-periodo.component';
import { CuentaCorrienteComponent } from './pages/cuenta-corriente/cuenta-corriente.component';
import { IngresarClaveAccionesComponent } from './dialogs/ingresar-clave-acciones/ingresar-clave-acciones.component';
import { GestionFormulariosComponent } from './pages/gestion-formularios/gestion-formularios.component';
import { BloquearHorasComponent } from './dialogs/bloquear-horas/bloquear-horas.component';
import { PlanDeClasesExtendidoComponent } from './reports/plan-de-clases-extendido/plan-de-clases-extendido.component';
import { EvaluacionAlumnoComponent } from './formularios/evaluacion-alumno/evaluacion-alumno.component';
import { DiarioMovilComponent } from './formularios/diario-movil/diario-movil.component';
import { DesperfectoMovilComponent } from './formularios/desperfecto-movil/desperfecto-movil.component';
import { ResultadoExamenPracticoComponent } from './formularios/resultado-examen-practico/resultado-examen-practico.component';
import { GestionNotificacionesComponent } from './pages/gestion-notificaciones/gestion-notificaciones.component';
import { AlumnosPendientesDePagoComponent } from './reports/alumnos-pendientes-de-pago/alumnos-pendientes-de-pago.component';
import { FacturasPorAlumnoComponent } from './reports/facturas-por-alumno/facturas-por-alumno.component';
import { ExamenMedicoComponent } from './components/modals/examen-medico/examen-medico.component';
import { ExpedientesProximosVencerComponent } from './reports/expedientes-proximos-vencer/expedientes-proximos-vencer.component';
import { AgendaInstructorRapidaComponent } from './components/agenda-instructor-rapida/agenda-instructor-rapida.component';
import { GestionEstadoAlumnoComponent } from './components/gestion-estado-alumno/gestion-estado-alumno.component';
import { ClasesHastaExamenComponent } from './reports/clases-hasta-examen/clases-hasta-examen.component';
import { CatidadClasesPorInstructorComponent } from './reports/catidad-clases-por-instructor/catidad-clases-por-instructor.component';
import { SocioComponent } from './components/socio/socio.component';
import { ListarClasesEntregadasComponent } from './components/listar-clases-entregadas/listar-clases-entregadas.component';

registerLocaleData(localeEsUy, 'es-UY');
registerLocaleData(localeEs, 'es');

@NgModule({
  declarations: [
    AgendaMovilComponent,
    AgendaInstructorComponent,
    AgendaCursoComponent,
    AltaAlumnoComponent,
    FacturaRutComponent,
    InscripcionCursoComponent,
    PedirCantidadClasesComponent,
    SeleccionarAccionAgendaComponent,
    SeleccionarAlumnoComponent,
    SeleccionarCursoComponent,
    SeleccionarFechaComponent,
    SeleccionarInstructorComponent,
    SeleccionarItemsFacturarComponent,
    NavComponent,
    AgendarClaseComponent,
    SeleccionarSocioComponent,
    SocioComponent,
    ClasesEstimadasComponent,
    ClasesEstimadasDetalleComponent,
    GestionCursoComponent,
    GestionInstructorComponent,
    GestionAlumnoComponent,
    AbmAlumnoComponent,
    AbmInstructorComponent,
    AbmCursoComponent,
    SeleccionarItemCursoComponent,
    SuspenderClaseComponent,
    InstructorHorasLibresComponent,
    GestionInscripcionComponent,
    InscripcionesAlumnoComponent,
    DisponibilidadAlumnoComponent,
    AbmInscripcionComponent,
    GestionMovilComponent,
    AbmMovilComponent,
    GenerarExamenComponent,
    SeleccionarMovilComponent,
    TestComponent,
    EnviarNotificacionComponent,
    SeleccionarInscripcionComponent,
    GestionExamenComponent,
    AbmExamenComponent,
    GenerarClaseAdicionalComponent,
    CambiarContraseniaComponent,
    GenerarNuevoPlanClasesComponent,
    ReportesComponent,
    FacturacionPorItemComponent,
    SeleccionarItemComponent,
    CantidadClasesPorAlumnoPorMesComponent,
    CantidadClasesPorPeriodoComponent,
    InicioCursoPorPeriodoComponent,
    CuentaCorrienteComponent,
    IngresarClaveAccionesComponent,
    GestionFormulariosComponent,
    BloquearHorasComponent,
    PlanDeClasesExtendidoComponent,
    DesperfectoMovilComponent,
    DiarioMovilComponent,
    EvaluacionAlumnoComponent,
    ResultadoExamenPracticoComponent,
    GestionNotificacionesComponent,
    AlumnosPendientesDePagoComponent,
    FacturasPorAlumnoComponent,
    ExamenMedicoComponent,
    ExpedientesProximosVencerComponent,
    AgendaInstructorRapidaComponent,
    GestionEstadoAlumnoComponent,
    ClasesHastaExamenComponent,
    CatidadClasesPorInstructorComponent,
    ListarClasesEntregadasComponent,
  ],
  imports: [
    CommonModule,
    EscuelaRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    SharedModule,
    FormsModule,
    SweetAlert2Module,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-UY' },

    // `MomentDateAdapter` and `MAT_MOMENT_DATE_FORMATS` can be automatically provided by importing
    // `MatMomentDateModule` in your applications root module. We provide it at the component level
    // here, due to limitations of our example generation script.
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
    { provide: LOCALE_ID, useValue: 'es' },
  ],

  // providers: [
  //   { provide: MAT_DATE_LOCALE, useValue: 'es-UY' }
  // ]
})
export class EscuelaModule {}
