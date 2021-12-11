import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Injectable } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TokenStorageService } from '../services/token-storage.service';

interface APIErrorResponse extends HttpErrorResponse {
  error: {
    id?: string
    links?: { about: string }
    status: string
    code?: string
    title: string
    detail: string
    source?: {
      pointer?: string
      parameter?: string
    }
    meta?: any
  }
}

const TOKEN_HEADER_KEY = 'x-access-token';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private dialog: MatDialog,
    private token: TokenStorageService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let authReq = request;
    const token = this.token.getToken();

    if (token != null) {
      authReq = request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
    }

    return next.handle(request)
      .pipe(
        catchError((error: APIErrorResponse) => {
          console.log(error.error);
          this.openDialog(JSON.stringify(error.error));
          return throwError(() => new Error(JSON.stringify(error.error)));
        })
      )
  }

  openDialog(element: any) {
    const dialogRef = this.dialog.open(DialogContentCreateUser,
      {
        data: element
      });
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentCreateUser {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}