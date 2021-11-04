import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpHeaders
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { map, catchError, tap, finalize } from 'rxjs/operators';

@Injectable()
export class CargandoInterceptor implements HttpInterceptor {


  @BlockUI() blockUI: NgBlockUI;
  constructor(
    private router: Router,
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const req = request.clone({
      setHeaders: {
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache'
      }
    });
    this.blockUI.start();
    return next.handle(req).pipe(
      map((event: HttpEvent<any>) => {


        if (event instanceof HttpResponse) {
          // console.log('event:: ', event);

        }
        return event;
      }),
      catchError((err) => {
        if (err.status === 401) {
          this.router.navigate(['/login']);
        }

        console.log(err);

        return throwError(err);
      })
      ,finalize( () => this.blockUI.stop() )
    );
  }
}
