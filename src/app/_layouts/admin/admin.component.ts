import { SHARED_IMPORTS } from '@shared/shared.imports';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { MiscService, PageTitleService } from '@services/index';
import { NavbarComponent } from '@layouts/shared/navbar/navbar.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [...SHARED_IMPORTS],
    templateUrl: './admin.component.html'
})

export class LayoutAdminComponent implements OnInit {
    public pageTitle = "";
    public mainColor = environment.defaultMainColor;
    public userLevel = environment.defaultUserLevel;
    public env = environment;
    public isEaster: boolean = false;
    public layoutAdmin = false;

    @ViewChild('sidebar', { static: false }) sidebar;
    @ViewChild(NavbarComponent, { static: false }) navbar: NavbarComponent;
    constructor(private router: Router,
                private miscService: MiscService,
                private pageTitleService: PageTitleService) {}

    ngOnInit() {
        if(!this.miscService.isUserAdmin()) {
            this.miscService.showMsg({ key: "NO_PERMISSION_ACCESS_RESOURCE" });
            this.router.navigate(['/']);
        }

        this.pageTitleService.currentTitle.subscribe(title => this.pageTitle = title);
    }
}