import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';
import { LocalStorageService } from '@services/localStorage.service';
import { NgxPermissionsService } from 'ngx-permissions';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from '@nm/rxjs/operators';
import { ApiService } from '@services/api.service';

@Injectable({
    providedIn: 'root'
})
export class UserService extends ApiService {
    private apiUrl = environment.apiUrl;

    constructor(protected override http: HttpClient,
                private localStorageService: LocalStorageService,
                private ngxPermissionsService: NgxPermissionsService) {
        super(http);
    }

    // Auth
    public currentUserSubject: any = new BehaviorSubject(null);
    public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

    private isCustomerSubject = new BehaviorSubject(true);
    public isCustomerObsevable = this.isCustomerSubject.asObservable().pipe(distinctUntilChanged());

    public filesTokensSubject = new BehaviorSubject(null);
    public filesTokens = this.filesTokensSubject.asObservable().pipe(distinctUntilChanged());

    get getCurrentUser() {
        return this.currentUserSubject.value;
    }

    get isCustomer() {
        return this.isCustomerSubject.value;
    }

    get getFilesTokens(): any {
        return this.filesTokensSubject.value;
    }

    me() {
        let user = this.localStorageService.getLSItem('currentUser');
        if (user && user.api_token) {
            super.get(`${this.apiUrl}/me`).subscribe(
                data => this.saveAuth(data),
                () => this.cleanAuth(),
            );
        }
        else {
            this.cleanAuth();
        }
    }

    saveAuth(data: any) {
        const user = data.user || data.data || null;

        if(user) {
            this.currentUserSubject.next(user);
            if(data.permissions != undefined && data.permissions) {
                this.ngxPermissionsService.loadPermissions(data.permissions);
            }
            if(!user.roles) {
                this.isCustomerSubject.next(true);
            }
            else {
                this.isCustomerSubject.next(!!(user.roles || []).find(role => role.name == 'customer'));
            }

            this.filesTokensSubject.next(data?.files_tokens);

            if(data.permissions) this.localStorageService.setLSItem('currentUserPermissions', data.permissions);
            if(data.env) this.localStorageService.setLSItem('env', data.env);
        }
        else {
            this.cleanAuth();
        }
    }

    cleanAuth() {
        this.currentUserSubject.next(false);
        this.ngxPermissionsService.flushPermissions();

        this.localStorageService.removeLSItem('currentUser');
        this.localStorageService.removeLSItem('env');

        let except = ['gunOrSmartphone', 'isNightMode', 'last_changelog', 'last_update', 'sidebarMini', 'okBrowser'];

        for (let l in localStorage) {
            if(except.indexOf(l) == -1){
                localStorage.removeItem(l);
            }
        }
    }

    // Get
    getAll() {
        return super.get(this.apiUrl + '/users/all').pipe(map((data:any) => data));
    }

    getById(id: number) {
        return super.get(this.apiUrl + '/users/' + id).pipe(map((data:any) => data));
    }

    // Post
    create(data: any) {
        return super.post(this.apiUrl + '/users/', data).pipe(map((data:any) => data));
    }

    checkIdentifiers(data: any) {
        return super.post(this.apiUrl + '/users/check/identifiers', data).pipe(map((data: any) => data));
    }

    requestPwdEmail(data) {
        return super.post(this.apiUrl + '/password/email', data).pipe(map((data:any) => data));
    }

    requestPwdReset(data) {
        return super.post(this.apiUrl + '/password/reset', data).pipe(map((data:any) => data));
    }

    // Put
    update(data: any) {
        return super.put(this.apiUrl + '/users', data).pipe(map((data:any) => data));
    }

    updatePwd(data: any) {
        return super.put(this.apiUrl + '/users/pwd', data).pipe(map((data:any) => data));
    }

    updateRole(data: any) {
        return super.put(this.apiUrl + '/users/role', data).pipe(map((data:any) => data));
    }

    newBan(data: any) {
        return super.put(this.apiUrl + '/users/ban/new', data).pipe(map((data:any) => data));
    }

    updateBan(data: any) {
        return super.put(this.apiUrl + '/users/ban/update', data).pipe(map((data:any) => data));
    }

    // Delete
    deleteUser(id: number) {
        return super.delete(this.apiUrl + '/users/' + id).pipe(map((data:any) => data));
    }

    updateAvatar(data: any) {
        return super.put(this.apiUrl + '/users/avatar', data).pipe(map((data:any) => data));
    }
}
