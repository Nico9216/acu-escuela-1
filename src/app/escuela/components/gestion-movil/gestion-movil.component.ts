import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MovilService } from '@core/services/movil.service';
import { Router } from '@angular/router';
import { confirmacionUsuario, mensajeConfirmacion } from '@utils/sweet-alert';
import { MatSelectChange } from '@angular/material/select';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Movil } from '@core/model/movil.model';
import { environment } from '@environments/environment';
import { generateEstadosActivoDeshabilitado } from '@utils/utils-functions';

@Component({
  selector: 'app-gestion-movil',
  templateUrl: './gestion-movil.component.html',
  styleUrls: ['./gestion-movil.component.scss'],
})
export class GestionMovilComponent implements OnInit {
  displayedColumns: string[] = ['actions', 'MovCod', 'EscVehEst'];
  dataSource: MatTableDataSource<Movil>;
  verMovil: boolean;
  filtro: string;

  estados = [];
  form: FormGroup;

  pageSize = environment.pageSize;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private movilService: MovilService,
    private router: Router
  ) {}

  ngOnInit() {
    this.buildForm();
    this.getMoviles('A');
    this.estados = generateEstadosActivoDeshabilitado();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  abmMovil(modo: string, movil: Movil) {
    switch (modo) {
      case 'INS':
        this.movilService.sendDataMovil(modo, movil, 0);
        this.router.navigate(['/escuela/abm-movil']);
        break;
      case 'UPD':
        this.movilService.sendDataMovil(modo, movil);
        this.router.navigate(['/escuela/abm-movil']);
        break;
      case 'DLT':
        confirmacionUsuario(
          'Confirmación de Usuario',
          `Está seguro que desea eliminar el movil: ${movil.MovCod}`
        ).then((confirm) => {
          if (confirm.isConfirmed) {
            this.movilService
              .gestionMovil(modo, movil)
              .subscribe((res: any) => {


                mensajeConfirmacion('Ok', res.Movil.ErrorMessage).then(
                  () => this.getMoviles(this.filtro)
                );
              });
          }
        });

        break;

      default:
        break;
    }
  }

  getMoviles(EscVehEst?: string) {
    this.verMovil = false;
    this.movilService.getMoviles().subscribe((moviles: Movil[]) => {

      this.verMovil = true;
      const auxMoviles =
        EscVehEst === '-' || !EscVehEst
          ? moviles
          : moviles.filter((movil) => movil.EscVehEst === EscVehEst);
      // Assign the data to the data source for the table to render
      this.dataSource = new MatTableDataSource(auxMoviles);

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  buildForm() {
    this.form = this.fb.group({
      tipCurEst: ['A'],
    });
  }
  verActivos(event: MatSelectChange) {

    const filterValue = event.value;
    this.getMoviles(filterValue);
  }

}
