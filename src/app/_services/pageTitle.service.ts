import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root'
})
export class PageTitleService {

    private titleSource = new BehaviorSubject<string>(environment.defaultSoftwareName);
    private breadcrumbsSource = new BehaviorSubject<any>([]);

    currentTitle = this.titleSource.asObservable();
    breadcrumbs = this.breadcrumbsSource.asObservable();

    constructor(private title: Title) {}

    changeTitle(message: any) {
        this.titleSource.next(message)
        this.title.setTitle(message);
    }

    changeBreadcrumbs(message: any) {
        this.breadcrumbsSource.next(message)
    }
}
