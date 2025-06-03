import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiService } from '@services/api.service';

@Injectable({
    providedIn: 'root'
})
export class SettingService extends ApiService {
    private apiUrl = environment.apiUrl;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    // Get
    getAll() {
        return super.get(this.apiUrl + '/settings').pipe(map((data:any) => data));
    }

    getAllEditable() {
        return super.get(this.apiUrl + '/settings/editable').pipe(map((data:any) => data));
    }

    getPasswordConstraints() {
        return super.get(this.apiUrl + '/settings/password/constraints').pipe(map((data:any) => data));
    }

    getByKey(key: string) {
        return super.get(this.apiUrl + '/settings/' + key).pipe(map((data:any) => data));
    }

    // Post
    checkSettings(data: any) {
        return super.post(this.apiUrl + '/settings/check', data).pipe(map((data:any) => data));
    }

    // Put
    update(data: any) {
        return super.put(this.apiUrl + '/settings', data).pipe(map((data:any) => data));
    }
}
