import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared.imports';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { UtilsService, AuthenticationService, LocalStorageService, NotificationService, SearchService, SettingService } from '@app/shared/services/_shared-services';
import { PageTitleService } from '@services/pageTitle.service';
import { environment } from '@env/environment';
import { forkJoin } from 'rxjs';
import { LayoutsUserMenuComponent } from "@layouts/user/menu/menu.component";

var misc:any ={
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
}
declare var $: any;

@Component({
    selector: 'app-layouts-user-header',
    standalone: true,
    imports: [
        ...SHARED_IMPORTS,
        LayoutsUserMenuComponent
    ],
    moduleId: module.id,
    templateUrl: 'header.component.html'
})

export class LayoutsUserHeaderComponent implements OnInit, AfterViewInit {
    private pageTitle = "";
    private toggleButton;
    public absoluteSearch: any = {};
    public displayAutocompleteResults: boolean = false;
    public isMiniSidebar: boolean = false;
    public env = environment;
    public editAdmin = false;
    public currentUserData:any;
    public notifNumber = 0;

    searchLoading: boolean = false;

    @ViewChild("navbar-cmp", { static: false }) button;

    constructor(private router: Router,
                private location: Location,
                private element: ElementRef,
                private utilsService: UtilsService,
                private authenticationService: AuthenticationService,
                private localStorageService: LocalStorageService,
                private notificationService: NotificationService,
                private searchService: SearchService,
                private settingService: SettingService,
                private pageTitleService: PageTitleService) {}

    ngOnInit() {
        let permissions = JSON.parse(this.localStorageService.getLSItem('currentUserPermissions'));
        this.editAdmin = this.utilsService.inArray(permissions, "editAdmin");

        if($('body').hasClass('sidebar-mini')){
            misc.sidebar_mini_active = true;
        }

        this.isMiniSidebar = localStorage.getItem('sidebarMini') === "true";

        this.notificationService.notificationsCount.subscribe(count => {
            if(count > -1) {
                this.notifNumber = count;
            }
        });
    }

    ngAfterViewInit() {
        var navbar : HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
        $("body").click(function(){
            this.displayAutocompleteResults = false;
            $(".autocomplete").hide();
        })
    }

    setSettings() {
        this.currentUserData = this.localStorageService.getLSItem("currentUser");

        this.settingService.getAll().subscribe(data => {
            let settings: any = {};
            for(let d of data) {
                settings[d.key] = {id: d.id, value: d.value};
            }

            this.localStorageService.setLSItem("settings", settings);
        });
    }

    goBack() {
		this.location.back();
	}

    search(term) {
        if(term.length >= 3){
            $(".autocomplete").show();
            term = encodeURIComponent(term);

            this.absoluteSearch.result = {};
            this.searchLoading = true;

            forkJoin([
                this.searchService.searchUser(term)
            ]).subscribe(
                result => {
                    this.absoluteSearch.result.users = result[0];
                    this.displayAutocompleteResults = true;
                    this.searchLoading = false;
                },
            );

        }
        else {
            this.displayAutocompleteResults = false;
        }
    }

    get notResultFound() {
        if(this.searchLoading === false) {
            if(this.absoluteSearch.result) {
                let findResult = false;
                let keys = Object.keys(this.absoluteSearch.result);
                for(let key of keys) {
                    if(this.absoluteSearch.result[key].length > 0) {
                        findResult = true;
                    }
                }
                return !findResult;
            }
        }

        return false;
    }

    goToResult(id, model) {
        switch(model) {
            case 'users':
                this.router.navigate(['/users/edit'], {queryParams: {id: id}});

            break;
        }
        this.displayAutocompleteResults = false;

    }

    displayAutocomplete(display = true) {
        this.displayAutocompleteResults = display;
    }

    isMobileMenu() {
        if($(window).width() < 991){
            return false;
        }

        return true;
    }

    sidebarOpen() {
        var toggleButton = this.toggleButton;
        var body = document.getElementsByTagName('body')[0];
        toggleButton.classList.add('toggled');
        body.classList.add('nav-open');
    }

    sidebarClose() {
        var body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        body.classList.remove('nav-open');
    }

    sidebarToggle() {
        if(!this.toggleButton.classList.contains('toggled')){
            this.sidebarOpen();
        }
        else {
            this.sidebarClose();
        }
    }

    getTitle() {
        this.pageTitleService.currentTitle.subscribe(title => {
            this.pageTitle = title;
        });

        return this.pageTitle;
    }

    logout() {
        this.authenticationService.logout();
    }

    getPath() {
        return this.location.prepareExternalUrl(this.location.path());
    }

    switchMini($event) {
        var $body = $('body');
        if(misc.sidebar_mini_active == true){
            $('body').removeClass('sidebar-mini');
            misc.sidebar_mini_active = false;
            localStorage.setItem('sidebarMini', "false");

        }
        else{
            $('.sidebar .collapse').collapse('hide').on('hidden.bs.collapse',function(){
                $(this).css('height','auto');
            });

            localStorage.setItem('sidebarMini', "true");
            setTimeout(function(){
                $('body').addClass('sidebar-mini');

                $('.sidebar .collapse').css('height','auto');
                misc.sidebar_mini_active = true;
            }, 300);
        }

        var simulateWindowResize = setInterval(function() {
            window.dispatchEvent(new Event('resize'));
        },180);

        setTimeout(function() {
            clearInterval(simulateWindowResize);
        },1000);
    }
}
