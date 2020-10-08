import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 400 || err.status === 401) {
          // auto logout if 401 response returned from api
          this.authenticationService.logout();
          return throwError(new Error('Invalid Username or Password'));
          // location.reload(true);
        }
        console.log('Error: ', err);

        const error = err.error.message || err.statusText;
        return throwError(error);
      })
    );
  }
}
