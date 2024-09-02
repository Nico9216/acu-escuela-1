import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ClaseEstimada } from '@core/model/clase-estimada.model';
import { environment } from '@environments/environment';
import { formatDateToString } from '@utils/utils-functions';
import { AutenticacionService } from './autenticacion.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class ReportesService {
  headers = new HttpHeaders();

  options;

  constructor(
    private http: HttpClient,
    private authService: AutenticacionService
  ) {
    this.headers.set('Aceppt', 'application/pdf;');
    this.options = {
      headers: this.headers,
      responseType: 'blob' as 'json',
    };
  }

  ocupacionInstructorPorPeriodo = () => {};

  ocupacionInstructoresPorPeriodo = () => {};

  facturacionPorItem = (codigoInicial, codigoFinal, fechaInicio, fechaFinal) =>
    this.http.post(
      `${environment.url_ws}/RListCo1`,
      { codigoInicial, codigoFinal, fechaInicio, fechaFinal },
      this.options
    );

  dataIniciosCursosPorPeriodo = (fechaInicial, fechaFinal) =>
    this.http.get(
      `${
        environment.url_ws
      }/getDataInicioCurso?fechaInicial=${formatDateToString(
        fechaInicial.toDate()
      )}&fechaFinal=${formatDateToString(fechaFinal.toDate())}`
    );

  iniciosCursosPorPeriodo = (fechaInicial, fechaFinal) =>
    this.http.post(`${environment.url_ws}/getExcelInicioCurso`, {
      fechaInicial,
      fechaFinal,
    });

  cantidadClasesPorPeriodo = (usrId, mes, anio) =>
    this.http.post(`${environment.url_ws}/PEscConClases`, { usrId, mes, anio });

  alumnosEnCurso = (fechaDesde, fechaHasta) =>
    this.http.post(`${environment.url_ws}/REscClasesAlumHora`, {
      fechaDesde,
      fechaHasta,
    });

  // REscClasesAlumHora
  alumnosPendientesDePago = (fechaDesde, fechaHasta) =>
    this.http.post(`${environment.url_ws}/reporteAlumnosPendientesDePago`, {
      fechaDesde,
      fechaHasta,
    });

  getPDFPlanDeClases(
    planDeClase: ClaseEstimada,
    escCurTe1?: string,
    escCurTe2?: string,
    escCurTe3?: symbol,
    //path = 'wsPDFPlanDeClases'
    path = 'wsPDFPlanDeClasesHasta5Clases'
  ) {
    const headers = new HttpHeaders();
    headers.set('Aceppt', 'application/pdf;');

    return this.http.post(
      `${environment.url_ws}/${path}`,
      {
        PlanDeClase: { ...planDeClase, UsrId: this.authService.getUserId() },
        escCurTe1,
        escCurTe2,
        escCurTe3,
      },
      {
        headers,
        responseType: 'blob' as 'json',
      }
    );
  }

  getPDFPlanDeClasesExtendido5(
    planDeClase: ClaseEstimada,
    entregado?: boolean,
    //path = 'wsPDFPlanDeClases'
    path = 'wsPDFPlanDeClasesExtendidoHasta5Clases'
  ) {
    const headers = new HttpHeaders();
    headers.set('Aceppt', 'application/pdf;');

    return this.http.post(
      `${environment.url_ws}/${path}`,
      {
        PlanDeClase: { ...planDeClase, UsrId: this.authService.getUserId() },
        entregado,
      },
      {
        headers,
        responseType: 'blob' as 'json',
      }
    );
  }

  facturasPorAlumno = (aluId) =>
    this.http.post(`${environment.url_ws}/reporteFacturasPorAlumno`, {
      aluId,
    });

  expedientesProximos_A_Vencer(fechaDesde, fechaHasta, alumnoId) {
    return this.http.post(
      `${environment.url_ws}/reporteExpedientesProximosVencer`,
      {
        fechaDesde,
        fechaHasta,
        AluId: alumnoId,
      }
    );
  }

  getExcelClasesHastaExamen = (month: number, year: number) =>
    this.http.get(
      `${environment.url_Backend_Charp}/Alumno/GetExcelClasesHastaExamen?month=${month}&year=${year}`,
      {
        responseType: 'text',
      }
    );

  getReporteCursoAlumno = () =>
    this.http.get(
      `${environment.url_Backend_Charp}/Alumno/GetReporteCursoAlumno`,
      {
        responseType: 'text',
      }
    );

  getReporteResultadoExamenes = () =>
    this.http.get(
      `${environment.url_Backend_Charp}/ResultadoExamenPractico/ResultadoExamenPractico`,
      {
        responseType: 'text',
      }
    );

  obtenerAlumnosCon10ClasesOmas = () =>
    this.http.post(`${environment.url_ws}/wsReporteCantClasesPorAlumno`, {});

  getReporteClasesPorInstructors = (fechaDesde: string, fechaHasta: string) =>
    this.http.get(
      `${environment.url_Backend_Charp}/Instructor/GetReporteClasesPorInstructores?fechaDesde=${fechaDesde}&fechaHasta=${fechaHasta}`,
      {
        responseType: 'text',
      }
    );

  getReporteAlumnosPorInstructor = () =>
    this.http.get(
      `${environment.url_Backend_Charp}/Instructor/ReporteAlumnoPorInstructor`,
      // {
      //   responseType: 'text',
      // }
    );
}
