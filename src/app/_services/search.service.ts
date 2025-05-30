import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { ApiService } from '@services/api.service';

@Injectable({
    providedIn: 'root'
})
export class SearchService extends ApiService {
    private apiUrl = environment.apiUrl;

    constructor(protected override http: HttpClient) {
        super(http);
    }

    // Get
    getByTerm(term:any) {
        return super.get(this.apiUrl + '/search/' + term).pipe(map((data:any) => data));
    }

    searchUser(term:any) {
        return super.get(this.apiUrl + '/search/users/' + term).pipe(map((data:any) => data));
    }
}
