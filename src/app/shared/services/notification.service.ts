import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { UtilsService, ApiService, LocalStorageService } from '@app/shared/services/_shared-services';

@Injectable({
    providedIn: 'root'
})
export class NotificationService extends ApiService {

    public notificationsCountSubject: BehaviorSubject<any>;
    public notificationsCount: Observable<number>;

    constructor(public override http: HttpClient,
                private localStorageService: LocalStorageService,
                private utilsService: UtilsService) {
        super(http);
        let self = this;

        this.notificationsCountSubject = new BehaviorSubject<any>(null);
        this.notificationsCount = this.notificationsCountSubject.asObservable();
        this.unreadCount();

        setInterval(function () {
            self.unreadCount();
        }, 60000);
    }

    index(params: any) {
        return super.get('/notifications', params);
    }

    unreadCount() {
        let currentUser = this.localStorageService.getLSItem('currentUser');
        let api_token = currentUser && currentUser.api_token ? currentUser.api_token : null;

        if(api_token) {
            const currentCount = this.notificationsCountSubject.value;
            super.get('/notifications/unread/count').subscribe(count => {
                this.notificationsCountSubject.next(count);
                if(currentCount === null && count > 0) {
                    this.utilsService.showMsg({
                        key: "NOTIFICATIONS_UNREAD",
                        status: "warning",
                        moreData: { count: count }
                    });
                }
                else if (currentCount !== null && currentCount < count) {
                    this.utilsService.showMsg({
                        key: "NEW_NOTIFICATIONS",
                        status: "info",
                        moreData: { count: count - currentCount }
                    });
                }
            });
        }
    }

    destroyAll() {
        return super.delete('/notifications');
    }

    destroy(id: number) {
        return super.delete('/notifications/' + id);
    }
}
