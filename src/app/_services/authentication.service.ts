import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { ApiService, LocalStorageService, UserService } from '@services/index';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends ApiService {
    private apiUrl = environment.apiUrl;

    constructor(protected override http: HttpClient,
                private router: Router,
                private localStorageService: LocalStorageService,
                private userService: UserService) {
        super(http);
    }

    login(identifier: string, password: string) {
        return super.post(this.apiUrl + '/login', { identifier, password }).pipe(
            map((response: any) => {
                // login successful if there's a jwt token in the response
                let user = response.data;
                if (user && user.api_token) {
                    // store user details and jwt token in local storage to keep user logged in between page refreshes
                    this.localStorageService.setLSItem('currentUser', JSON.stringify(user));
                    this.userService.saveAuth(response);
                }

                return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        let except = ["sidebarMini"];
        for(var l in localStorage) {
           if(except.indexOf(l) == -1){
               this.localStorageService.removeLSItem(l);
           }
        }

        this.router.navigate(['/'])
    }
}
