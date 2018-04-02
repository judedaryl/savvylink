import { AuthenticationService } from './../services/authentication.service';
import { Router } from '@angular/router/';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/switchMap';
import { Injectable, Inject, forwardRef, Injector } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpResponse,
    HttpHeaders
} from '@angular/common/http';
import { environment } from '../../environments/environment';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router, private auth: AuthenticationService) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        const token = this.auth.getToken;
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`,
            }
        });

        return next.handle(request).do(event => {
            if (event instanceof HttpResponse) {
            }
        }).catch(x => this.handleAuthError(x));


    }

    private handleAuthError(err: HttpErrorResponse): Observable<any> {
        // handle your auth error or rethrow
        if (err.status === 401 || err.status === 403) {
            // navigate /delete cookies or whatever
            // this.router.navigateByUrl('/Unauthorized');
            return Observable.of(err.message);
        }
        if (err.status === 400) {
            // navigate /delete cookies or whatever
            return Observable.throw(err);
            // return Observable.of(err.message);
        }
        return Observable.throw(err);
    }

}
