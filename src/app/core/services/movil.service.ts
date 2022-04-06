import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Movil } from '../model/movil.model';

@Injectable({
  providedIn: 'root',
})
export class MovilService {
  // esto va al movilService
  private movilDataSource = new BehaviorSubject({
    modo: 'INS',
    movil: {},
    id: 0,
  });
  movilCurrentData = this.movilDataSource.asObservable();

  constructor(private http: HttpClient) {}

  gestionMovil = (mode: string, movil: Movil) =>
    this.http.post(`${environment.url_ws}/wsGestionMovil`, {
      Movil: {
        Mode: mode,
        Movil: movil,
      },
    });

  getMoviles = () => this.http.get(`${environment.url_ws}/wsGetMoviles`);

  getMovilesDisponiblesPorFechaHora = (fecha, hora) =>
    this.http.get<Movil[]>(
      `${environment.url_ws}/wsGetMovilesDisponiblesPorFechaHora?fecha=${fecha}&hora=${hora}`
    );

  sendDataMovil(modo: string, movil: Movil, id?: number) {
    const data: { modo: string; movil: Movil; id: number } = id
      ? { modo, movil, id }
      : { modo, movil, id: 0 };
    this.movilDataSource.next(data);
  }
}
