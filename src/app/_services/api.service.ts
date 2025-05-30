import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

declare let moment: any;

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    constructor(protected http: HttpClient) {}

    protected get(path: string, params: any = {}): Observable<any> {
        return this.http.get(`${environment.apiUrl}${path}`, { params: ApiService.formatParams(params) })
            .pipe(catchError(ApiService.formatErrors));
    }

    protected put(path: string, body: any = {}): Observable<any> {
        return this.http.put(`${environment.apiUrl}${path}`, this.formatBody(body))
            .pipe(catchError(ApiService.formatErrors));
    }

    protected post(path: string, body: any = {}, options: any = {}): Observable<any> {
        return this.http.post(`${environment.apiUrl}${path}`, this.formatBody(body), options)
            .pipe(catchError(ApiService.formatErrors));
    }

    protected delete(path: string): Observable<any> {
        return this.http.delete(`${environment.apiUrl}${path}`)
            .pipe(catchError(ApiService.formatErrors));
    }

    protected deleteBis(path: string, params: any = {}): Observable<any> {
        return this.http.delete(`${environment.apiUrl}${path}`, { params: ApiService.formatParams(params) })
            .pipe(catchError(ApiService.formatErrors));
    }

    private formatBody(body: any): any {
        for (let key of Object.keys(body)) {
            if (body[key] instanceof moment) {
                if (body[key].isValid()) {
                    body[key] = body[key].format('YYYY-MM-DD HH:mm');
                }
            } else if (body[key] instanceof Object) {
                body[key] = this.formatBody(body[key]);
            }
        }
        return body;
    }

    private static formatErrors(error: any) {
        error.error.status = error.status;
        return throwError(error.error);
    }

    private static formatParams(params: any): any {
        let http_params = new HttpParams();
        if (params) {
            for (let key of Object.keys(params)) {
                if (params[key] !== null && params[key] !== undefined) {
                    if (Array.isArray(params[key])) {
                        for (let p of params[key]) {
                            http_params = http_params.append(`${key}[]`, `${p}`);
                        }
                    } else if (params[key] instanceof moment) {
                        http_params = http_params.append(key, `${params[key].format('YYYY-MM-DD HH:mm')}`);
                    } else if (typeof params[key] === 'boolean') {
                        http_params = http_params.append(key, params[key] ? '1' : '0');
                    } else {
                        http_params = http_params.append(key, `${params[key]}`);
                    }
                }
            }
        }

        return http_params;
    }
}
