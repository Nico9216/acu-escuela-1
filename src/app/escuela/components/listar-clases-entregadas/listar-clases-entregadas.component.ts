import { ListarClasesEntregadas } from './../../../core/model/listarClasesEntregadas';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AlumnoService } from '@core/services/alumno.service';

@Component({
  selector: 'app-listar-clases-entregadas',
  templateUrl: './listar-clases-entregadas.component.html',
  styleUrls: ['./listar-clases-entregadas.component.scss']
})
export class ListarClasesEntregadasComponent implements OnInit {

  displayedColumns: string[] = [
    'AluNumero',
    'Clase',
    'Fecha'
  ]

  dataSource: MatTableDataSource<ListarClasesEntregadas>;

  constructor(
    private alumnoService: AlumnoService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }


  ngOnInit(): void {
    
    this.alumnoService.GetClasesEntregadasPorAlumno(this.data.alumno.AluId).subscribe((resp: any) => {
      this.dataSource = resp
      console.log(resp)
    })

  }

}
