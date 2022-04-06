import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { AgendaClase } from '@core/model/agenda-clase.model';
import { Alumno } from '@core/model/alumno.model';
import { Instructor } from '@core/model/instructor.model';
import { AcuService } from '@core/services/acu.service';
import { AlumnoService } from '@core/services/alumno.service';
import { CursoService } from '@core/services/curso.service';
import { InstructorService } from '@core/services/instructor.service';
import { AgendaMovilComponent } from '@escuela/components/agenda-movil/agenda-movil.component';
import { MyErrorStateMatcher } from '@escuela/components/modals/agendar-clase/agendar-clase.component';
import { SeleccionarAlumnoComponent } from '@escuela/components/modals/seleccionar-alumno/seleccionar-alumno.component';
import { SeleccionarCursoComponent } from '@escuela/components/modals/seleccionar-curso/seleccionar-curso.component';
import { SeleccionarInstructorComponent } from '@escuela/components/modals/seleccionar-instructor/seleccionar-instructor.component';
import { alumnoTieneExcepcionValidator } from '@utils/validators/alumno-tiene-excepecion.directive';
import { alumnoYaAsignadoValidator } from '@utils/validators/alumno-ya-asignado.directive';
import { existeAlumnoValidator } from '@utils/validators/existe-alumno-validator.directive';
import { instructorYaAsignadoValidator } from '@utils/validators/instructor-ya-asignado-validator.directive';
import { licenciaInstructorValidator } from '@utils/validators/licencia-instructor-validator.directive';
import Swal from 'sweetalert2';
import { AgendaInstructorComponent } from '../../../escuela/components/agenda-instructor/agenda-instructor.component';

@Component({
  selector: 'app-ver-agenda',
  templateUrl: './ver-agenda.component.html',
  styleUrls: ['./ver-agenda.component.scss'],
})
export class VerAgendaComponent implements OnInit {
  form: FormGroup;
  matcher = new MyErrorStateMatcher();
  selected = ' ';
  agendaClase: AgendaClase;
  horaString: string;
  horaNumber: number;
  fechaClase: Date = new Date();

  curso: string;
  hoy = new Date();

  // para el dialog
  alumno: Alumno = {};
  esAgCuAviso: number;
  avisar: string;

  get fecha() {
    return this.form.get('fecha');
  }

  get hora() {
    return this.form.get('hora');
  }

  get movil() {
    return this.form.get('movil');
  }

  get alumnoNombre() {
    return this.form.get('alumnoNombre');
  }

  get alumnoNumero() {
    return this.form.get('alumnoNumero');
  }

  get alumnoTelefono() {
    return this.form.get('alumnoTelefono');
  }

  get alumnoCelular() {
    return this.form.get('alumnoCelular');
  }

  get instructorAsignado() {
    return this.form.get('instructorAsignado');
  }

  get avisoInstructor() {
    return this.form.get('avisoInstructor');
  }

  get instructorId() {
    return this.form.get('instructorId');
  }

  get instructorNombre() {
    return this.form.get('instructorNombre');
  }

  get numeroClase() {
    return this.form.get('numeroClase');
  }
  get observaciones() {
    return this.form.get('observaciones');
  }

  get aviso() {
    return this.form.get('aviso');
  }
  get claseAdicional() {
    return this.form.get('claseAdicional');
  }
  get estadoClase() {
    return this.form.get('estadoClase');
  }
  get detalle() {
    return this.form.get('detalle');
  }
  get tipoClase() {
    return this.form.get('tipoClase');
  }
  get cursoId() {
    return this.form.get('cursoId');
  }

  get cursoNombre() {
    return this.form.get('cursoNombre');
  }

  get usuarioAltaNombre() {
    return this.form.get('usuarioAltaNombre');
  }

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<
      AgendaMovilComponent | AgendaInstructorComponent
    >,
    private acuService: AcuService,
    private cursoService: CursoService,
    private alumnoService: AlumnoService,
    private instructorService: InstructorService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.agendaClase = this.data.agendaClase;
    const day = Number(
      this.agendaClase.FechaClase.substring(
        this.agendaClase.FechaClase.length - 2,
        this.agendaClase.FechaClase.length
      )
    );
    const month = Number(this.agendaClase.FechaClase.substring(5, 7));
    const year = Number(this.agendaClase.FechaClase.substring(0, 4));

    this.fechaClase.setDate(day);
    this.fechaClase.setMonth(month - 1);
    this.fechaClase.setFullYear(year);

    this.esAgCuAviso = this.agendaClase.EsAgCuAviso;
    this.avisar =
      this.agendaClase.EsAgCuAviso === 0 || this.agendaClase.EsAgCuAviso === 2
        ? 'Avisar'
        : 'Avisado';
    this.alumno.AluId = this.agendaClase.AluId;

    this.horaString = `${this.agendaClase.Hora}:00`;
    this.buildForm();
    this.deshabilitarCampos();
  }
  ngOnInit() {
    // toISOString, es el formato que leyo bien la api.
    localStorage.setItem('fechaClase', this.fechaClase.toISOString());
    const horaStr = this.agendaClase.Hora * 100;
    localStorage.setItem('horaClase', horaStr.toString());
    localStorage.setItem('movilCod', this.movil.value.toString());
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private buildForm() {
    if (this.agendaClase) {
      this.form = this.formBuilder.group({
        fecha: [this.fechaClase],
        hora: [this.horaString],
        movil: [this.agendaClase.EscMovCod],
        alumnoNumero: [
          this.agendaClase.AluNro,
          [Validators.required], // sync validators
          [
            existeAlumnoValidator(this.alumnoService),
            alumnoYaAsignadoValidator(this.alumnoService),
            alumnoTieneExcepcionValidator(this.alumnoService),
          ], // async validators
        ],
        alumnoNombre: [this.agendaClase.AluNomApe],
        alumnoTelefono: [this.agendaClase.AluTelefono],
        alumnoCelular: [this.agendaClase.AluCelular],
        cursoId: [this.agendaClase.TipCurId, [Validators.required]],
        cursoNombre: [this.agendaClase.TipCurNom],
        tipoClase: [this.agendaClase.EsAgCuTipCla],
        numeroClase: [this.agendaClase.EsAgCuNroCla],
        claseAdicional: [this.agendaClase.EsAgCuClaAdiSN],
        avisoInstructor: [this.agendaClase.AvisoInstructor],

        instructorId: [
          this.agendaClase.EsAgCuInsId,
          [Validators.required], // sync validators
          [
            licenciaInstructorValidator(this.instructorService),
            instructorYaAsignadoValidator(this.instructorService),
          ], // async validators
        ],
        instructorNombre: [
          `${this.agendaClase.EsAgCuInsId.toString().trim()} ${
            this.agendaClase.EsAgCuInsNom
          }`,
        ],
        detalle: [this.agendaClase.EsAgCuDet],
        estadoClase: [this.agendaClase.EsAgCuEst],
        usuarioAltaNombre: [this.agendaClase.UsuarioAltaNombre],
        observaciones: [this.agendaClase.EsAgCuObs],
        aviso: [this.agendaClase.EsAgCuDetAviso],
      });
    } else {
      this.form = this.formBuilder.group({
        fecha: [''],
        hora: [''],
        movil: [''],
        alumnoNumero: [
          '',
          [Validators.required], // sync validators
          [
            existeAlumnoValidator(this.alumnoService),
            alumnoYaAsignadoValidator(this.alumnoService),
            alumnoTieneExcepcionValidator(this.alumnoService),
          ], // async validators
        ],
        alumnoNombre: ['', [Validators.required]],
        alumnoTelefono: [''],
        alumnoCelular: [''],

        cursoId: ['', [Validators.required]],
        cursoNombre: [''],
        tipoClase: [''],
        numeroClase: [''],
        claseAdicional: [''],
        avisoInstructor: [''],
        instructorId: [
          '',
          [Validators.required], // sync validators
          [
            licenciaInstructorValidator(this.instructorService),
            instructorYaAsignadoValidator(this.instructorService),
          ], // async validators
        ],
        instructorNombre: [''],
        detalle: [''],
        estadoClase: [''],
        usuarioAltaNombre: [''],
        observaciones: [''],
        aviso: [''],
      });
    }
  }

  deshabilitarCampos() {
    // Deshabilitar fecha de inscripicón
    this.fecha.disable();
    this.hora.disable();
    this.movil.disable();

    // Campos deshabilitados del alumno
    this.alumnoNombre.disable();
    this.alumnoTelefono.disable();
    this.alumnoCelular.disable();

    // Campos deshabilitados del curso

    this.cursoNombre.disable();
    this.numeroClase.disable();
    this.claseAdicional.disable();

    // Campos deshabilitados del instructor

    this.instructorNombre.disable();
    this.avisoInstructor.disable();

    this.usuarioAltaNombre.disable();
    this.estadoClase.disable();
  }

  seleccionarInstructor() {
    this.instructorService
      .getInstructores()
      .subscribe((instructores: Instructor[]) => {
        this.openDialogInstructores(instructores);
      });
  }

  private openDialogInstructores(instructores) {
    const instructoresDialogRef = this.dialog.open(
      SeleccionarInstructorComponent,
      {
        height: 'auto',
        width: '700px',
        data: {
          instructores,
        },
      }
    );

    instructoresDialogRef.afterClosed().subscribe((result) => {
      this.alumno = result;
      this.form.patchValue({
        instructor: result.EscInsId,
        instructorAsignado: result.EscInsNom,
      });
    });
  }

  seleccionarAlumno = () =>
    this.alumnoService
      .obtenerAlumnos(5, 1, '')
      .subscribe((res: any) =>
        this.openDialogAlumnos(res.alumnos, res.cantidad)
      );

  seleccionarCurso = () =>
    this.cursoService
      .getCursos()
      .subscribe((res: any) => this.openDialogCursos(res));

  private openDialogCursos(cursos) {
    const cursosDialogRef = this.dialog.open(SeleccionarCursoComponent, {
      height: 'auto',
      width: '700px',
      data: {
        cursos,
      },
    });

    cursosDialogRef.afterClosed().subscribe((result) => {
      this.curso = result;
      this.agendaClase.TipCurId = result.TipCurId;
      this.agendaClase.TipCurNom = result.TipCurNom;
      this.addInfoCursoToForm(result);
    });
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

    alumnosDialogRef.afterClosed().subscribe((alumno: Alumno) => {
      this.alumno = alumno;
      this.form.patchValue({
        alumnoNombre: alumno.AluNomComp,
        alumnoNumero: alumno.AluNro,
      });
    });
  }

  avisoAlumno() {
    this.avisar = 'Avisar';
    this.esAgCuAviso = 2;
    if (this.esAgCuAviso === 0 || this.esAgCuAviso === 2) {
      this.avisar = 'Avisado';
      this.esAgCuAviso = 1;
    }
  }

  guardarClase(event: Event) {
    event.preventDefault();

    if (this.form.invalid) {
      return;
    }

    this.acuService
      .guardarAgendaClase(this.agendaClase)
      .subscribe((res: any) => this.dialogRef.close(res));
  }

  obtenerCurso() {
    const cursoId = this.cursoId.value;
    if (cursoId !== '') {
      this.cursoService.getCurso(cursoId).subscribe((res: any) => {
        if (res.TipCurId === '0') {
          Swal.fire({
            icon: 'warning',
            title: 'No encontrado!',
            text: 'El código del curso no existe, seleccione un existente.',
          }).then();
        }

        res.TipCurId = cursoId;
        this.agendaClase.TipCurId = res.TipCurId;
        this.agendaClase.TipCurNom = res.TipCurId;

        this.addInfoCursoToForm(res);
      });
    }
  }

  addInfoCursoToForm(result: any) {
    this.form.patchValue({
      cursoId: result.TipCurId,
      cursoNombre: result.TipCurNom,
    });
  }
}
