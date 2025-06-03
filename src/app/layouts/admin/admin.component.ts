import { Component, OnInit, ViewChild } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared.imports';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { UtilsService, PageTitleService } from '@app/shared/services/_shared-services';
import { LayoutsAdminHeaderComponent } from '@layouts/admin/header/header.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [...SHARED_IMPORTS, LayoutsAdminHeaderComponent],
    templateUrl: './admin.component.html'
})

export class LayoutAdminComponent implements OnInit {
    public pageTitle = "";
    public mainColor = environment.defaultMainColor;
    public userLevel = environment.defaultUserLevel;
    public env = environment;
    public isEaster: boolean = false;
    public layoutAdmin = false;

    constructor(private router: Router,
                private utilsService: UtilsService,
                private pageTitleService: PageTitleService) {}

    ngOnInit() {
        if(!this.utilsService.isUserAdmin()) {
            this.utilsService.showMsg({ key: "NO_PERMISSION_ACCESS_RESOURCE" });
            this.router.navigate(['/']);
        }

        this.pageTitleService.currentTitle.subscribe(title => this.pageTitle = title);
    }
}