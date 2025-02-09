import { Component, OnInit } from '@angular/core';
import { FormulariosService } from '../../../core/services/formularios.service';
import { DesperfectoMovil } from '../../../core/model/formularios/desperfecto-movil.model';
import { Actions } from '@core/model/actions.model';
import { downloadFileFromBase64 } from '@utils/utils-functions';
import * as moment from 'moment';

@Component({
  selector: 'app-desperfecto-movil',
  templateUrl: './desperfecto-movil.component.html',
  styleUrls: ['./desperfecto-movil.component.scss'],
})
export class DesperfectoMovilComponent implements OnInit {
  formularios: DesperfectoMovil[] = [];
  exportData: DesperfectoMovil[] = [];
  columnas = ['movil', 'instructor', 'kilometraje', 'desperfecto', 'fecha'];
  refreshIntervalId: any;
  exportarExcel = () => {
    this.formulariosService
      .getExcelDesperfectoMovil(this.exportData.map((f) => f.id))
      .subscribe(({ file }: any) =>
        downloadFileFromBase64(
          file,
          `desperfecto-movil-${moment().format('DD-MM-yyyy')}.xlsx`
        )
      );
  };

  actualizar = () => {
    this.formulariosService.getDesperfectoMovil().subscribe((formularios) => {
      formularios = formularios.map((form) => {
        form.fecha = moment(form.fechaCreacion).format('DD/MM/yyyy HH:mm');
        return form;
      });
      this.formulariosService.setFormularios('desperfectoMovil', formularios);
    });
  };

  actionsHeader: Actions[] = [
    {
      title: 'Exportar a excel',
      callback: this.exportarExcel,
    },
    {
      title: 'Actualizar',
      callback: this.actualizar,
    },
  ];

  constructor(private formulariosService: FormulariosService) {}

  ngOnInit(): void {
    this.refreshIntervalId = setInterval(this.actualizar, 600000);

    this.formulariosService.formularios$.subscribe(({ desperfectoMovil }) => {
      this.formularios = desperfectoMovil;
      this.exportData = desperfectoMovil;
    });
    this.formulariosService.getDesperfectoMovil().subscribe((formularios) => {
      formularios = formularios.map((form) => {
        form.fecha = moment(form.fechaCreacion).format('DD/MM/yyyy HH:mm');
        return form;
      });
      this.formulariosService.setFormularios('desperfectoMovil', formularios);
    });
  }

  changeData(formularios) {
    this.exportData = formularios;
  }

  ngOnDestroy(): void {
    clearInterval(this.refreshIntervalId);
  }
}
