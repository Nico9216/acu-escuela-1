import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AcuService } from '@core/services/acu.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-socio',
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.scss'],
})
export class SocioComponent implements OnInit {
  formBusquedaSoc: FormGroup;
  private listObservers: Array<Subscription> = [];
  tipoBusqueda: string[] = ['CEDULA', 'NUMERO'];
  mensaje: string;
  errorC: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private acuService: AcuService
  ) {
    this.formBusquedaSoc = this.formBuilder.group({
      numero: ['', [Validators.required]],
      tipoBusqueda: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.formBusquedaSoc.patchValue({
      tipoBusqueda: this.tipoBusqueda[0],
    });
  }

  buscar() {
    this.errorC = false;
    const tipo = this.tipo;
    const nro = Number(this.numero);
    if (nro < 1) {
      this.mensaje = 'El número no puede ser 0';
      this.errorC = true;
      return;
    }
    const load1$ = this.acuService.getBuscarSocio(nro, tipo).subscribe({
      next: (response: any) => {
        this.mensaje = `La cédula o número ingresado pertenece al socio ${response.nom1} ${response.ape1} con número ${response.id}.`;
      },
      error: (error) => {
        this.mensaje = error;
        this.errorC = true;
      },
    });
    this.listObservers.push(load1$);
  }
  ngOnDestroy(): void {
    this.listObservers.forEach((sub) => sub.unsubscribe());
  }
  get tipo(): string {
    return this.formBusquedaSoc.get('tipoBusqueda')?.value;
  }
  get numero(): string {
    return this.formBusquedaSoc.get('numero')?.value;
  }
}
