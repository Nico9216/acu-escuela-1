import { GestionEstadoAlumnoComponent } from './components/gestion-estado-alumno/gestion-estado-alumno.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NavComponent } from './components/nav/nav.component';
import { AgendaInstructorComponent } from './components/agenda-instructor/agenda-instructor.component';
import { SeleccionarAlumnoComponent } from './components/modals/seleccionar-alumno/seleccionar-alumno.component';
import { AgendarClaseComponent } from './components/modals/agendar-clase/agendar-clase.component';
import { GestionCursoComponent } from './components/gestion-curso/gestion-curso.component';
import { GestionInstructorComponent } from './components/gestion-instructor/gestion-instructor.component';
import { GestionAlumnoComponent } from './components/gestion-alumno/gestion-alumno.component';
import { AbmCursoComponent } from './components/abm-curso/abm-curso.component';
import { AbmAlumnoComponent } from './components/abm-alumno/abm-alumno.component';
import { AbmInstructorComponent } from './components/abm-instructor/abm-instructor.component';
import { GestionInscripcionComponent } from './components/gestion-inscripcion/gestion-inscripcion.component';
import { AbmInscripcionComponent } from './components/abm-inscripcion/abm-inscripcion.component';
import { AbmMovilComponent } from './components/abm-movil/abm-movil.component';
import { GestionMovilComponent } from './components/gestion-movil/gestion-movil.component';
import { TestComponent } from './components/test/test.component';
import { GestionExamenComponent } from './pages/gestion-examen/gestion-examen.component';
import { AbmExamenComponent } from './pages/abm-examen/abm-examen.component';
import { ReportesComponent } from './pages/reportes/reportes.component';
import { AutenticacionGuard } from '../core/guards/autenticacion.guard';
import { CuentaCorrienteComponent } from './pages/cuenta-corriente/cuenta-corriente.component';
import { GestionFormulariosComponent } from './pages/gestion-formularios/gestion-formularios.component';
import { GestionNotificacionesComponent } from './pages/gestion-notificaciones/gestion-notificaciones.component';
import { AgendaInstructorRapidaComponent } from './components/agenda-instructor-rapida/agenda-instructor-rapida.component';
import { SocioComponent } from './components/socio/socio.component';

const routes: Routes = [
  {
    path: '',
    component: NavComponent,
    children: [
      {
        path: 'agenda-instructor',
        component: AgendaInstructorComponent,
      },
      {
        path: 'agenda-instructor-rapida',
        component: AgendaInstructorRapidaComponent,
      },
      {
        path: 'gestion-inscripcion',
        component: GestionInscripcionComponent,
      },
      {
        path: 'gestion-curso',
        component: GestionCursoComponent,
      },
      {
        path: 'gestion-movil',
        component: GestionMovilComponent,
      },
      {
        path: 'gestion-alumno',
        component: GestionAlumnoComponent,
      },
      {
        path: 'gestion-examen',
        component: GestionExamenComponent,
      },
      {
        path: 'gestion-instructor',
        component: GestionInstructorComponent,
      },
      {
        path: 'abm-inscripcion',
        component: AbmInscripcionComponent,
      },
      {
        path: 'abm-curso',
        component: AbmCursoComponent,
      },
      {
        path: 'abm-movil',
        component: AbmMovilComponent,
      },
      {
        path: 'abm-alumno',
        component: AbmAlumnoComponent,
      },
      {
        path: 'abm-instructor',
        component: AbmInstructorComponent,
      },
      {
        path: 'abm-examen',
        component: AbmExamenComponent,
      },
      {
        path: 'agendaclase',
        component: AgendarClaseComponent,
      },
      {
        path: 'seleccionarAlumno',
        component: SeleccionarAlumnoComponent,
      },
      {
        path: 'test',
        component: TestComponent,
      },
      {
        path: 'reportes',
        component: ReportesComponent,
      },
      {
        path: 'formularios',
        component: GestionFormulariosComponent,
      },
      {
        path: 'notificaciones',
        component: GestionNotificacionesComponent,
      },
      {
        path: 'cuenta-corriente',
        component: CuentaCorrienteComponent,
      },
      {
        path: 'gestion-estado-alumno',
        component: GestionEstadoAlumnoComponent,
      },
      {
        path: 'socios',
        component: SocioComponent,
      },
    ],
    canActivateChild: [AutenticacionGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EscuelaRoutingModule {}
