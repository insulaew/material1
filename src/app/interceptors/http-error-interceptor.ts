import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Injectable } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {

  constructor(
    private dialog: MatDialog
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
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
    const dialogRef = this.dialog.open(DialogContentExampleDialog,
      {
        data: element
      });
  }
}

@Component({
  selector: 'dialog-content-example-dialog',
  templateUrl: 'dialog-content-example-dialog.html',
})
export class DialogContentExampleDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

}