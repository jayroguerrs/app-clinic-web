import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()
export class VersionInterceptor implements HttpInterceptor {

  constructor() {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const headers = new HttpHeaders({
      'App-Version': environment.version,
      'Backend': environment.keyBack
    });

      // Clonar la solicitud original para agregar los encabezados nuevos
      const clonedRequest = request.clone({ headers });

      // Pasar la solicitud modificada al siguiente manejador (o al servidor backend)
      return next.handle(clonedRequest);
  }
}
