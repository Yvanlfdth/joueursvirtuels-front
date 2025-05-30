import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiService } from '@services/api.service';

@Injectable({
    providedIn: 'root'
})
export class PasswordService extends ApiService {
    private apiUrl = environment.apiUrl;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    // Post
    requestPwdEmail(data) {
        return super.post(this.apiUrl + '/password/email', data).pipe(map((data:any) => data));
    }

    requestPwdReset(data) {
        return super.post(this.apiUrl + '/password/reset', data).pipe(map((data:any) => data));
    }
}
