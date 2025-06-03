import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared.imports';

declare var $:any;

// Metadata
export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icon: string;
    anchor?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    fullPath?: boolean;
}

// Menu Items
export const ROUTES: RouteInfo[] = [
    {
        path: '/',  // component "home"
        title: 'Accueil',
        type: 'link',
        icon: 'fa fa-home'
    },
    {
        path:'/articles',
        title:'Articles',
        type: 'parent',
        icon:'fa fa-newspaper-o',
        anchor: 'articles',
        children:[
            { path: '/news', title: 'News' },   // component "articles > news"
            { path: '/tests', title: 'Tests' }, // component "articles > tests"
            { path: '/dossiers', title: 'Dossiers' },   // component "articles > folders"
            { path: '/astuces', title: 'Astuces' }  // component "articles > tips"
        ]
    },
    {
        path: '/forums',
        title: 'Forums',
        icon: 'fa fa-list-alt',
        type: 'link'
    }
];

@Component({
    moduleId: module.id,
    selector: 'app-layouts-admin-menu',
    standalone: true,
    imports: [...SHARED_IMPORTS],
    templateUrl: './menu.component.html'
})
export class LayoutsAdminMenuComponent implements OnInit {
    public menuItems: any[];
    public isNightMode: any;
    public settingsData = {
        logo_url: { value: "/assets/img/logo.png" }
    };

    constructor() {}

    ngOnInit() {
        this.menuItems = ROUTES;
    }

    ngAfterViewInit() {
        var $sidebarParent = $('.sidebar .nav > li.active .collapse li.active > a').parent().parent().parent();
        var collapseId = $sidebarParent.siblings('a').attr("href");
        $(collapseId).collapse("show");
    }

    hideBar() {
        var body = document.getElementsByTagName('body')[0];
        var toggleButton = body.getElementsByClassName('navbar-toggle')[0];
        if(toggleButton && body) {
            toggleButton.classList.remove('toggled');
            body.classList.remove('nav-open');
        }
    }
}
