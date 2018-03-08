import { Router } from '@angular/router/';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/observable/of';
import 'rxjs/add/observable/throw';
import { AuthService } from '../auth/auth.service';
import { Injectable, Inject, forwardRef, Injector } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse,
    HttpResponse
} from '@angular/common/http';


@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private auth: AuthService, private router: Router) {
    }
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        request = request.clone({
            setHeaders: {
                Authorization: `Bearer ${this.auth.getToken}`,
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
            this.auth.removeToken();
            this.router.navigateByUrl(`/`);
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
