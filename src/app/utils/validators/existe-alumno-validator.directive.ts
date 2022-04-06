import { Directive } from '@angular/core';
import {
  AsyncValidatorFn,
  AsyncValidator,
  NG_ASYNC_VALIDATORS,
  AbstractControl,
  ValidationErrors,
} from '@angular/forms';

import { map } from 'rxjs/operators';

import { AlumnoService } from '@core/services/alumno.service';
import { Observable } from 'rxjs';

export function existeAlumnoValidator(
  alumnoService: AlumnoService
): AsyncValidatorFn {
  return (
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> => {
    return alumnoService.existeAlumno(control.value).pipe(
      map((res: any) => {
        // tslint:disable-next-line: object-literal-key-quotes
        return !res.existe ? { existeAlumno: true } : null;
      })
    );
  };
}

@Directive({
  // tslint:disable-next-line: directive-selector
  selector:
    '[existeAlumno][formControlName],[existeAlumno][formControl],[existeAlumno][ngModel]',
  providers: [
    {
      provide: NG_ASYNC_VALIDATORS,
      useExisting: ExisteAlumnoValidatorDirective,
      multi: true,
    },
  ],
})
export class ExisteAlumnoValidatorDirective implements AsyncValidator {
  constructor(private alumnoService: AlumnoService) {}

  validate(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    return existeAlumnoValidator(this.alumnoService)(control);
  }
}
