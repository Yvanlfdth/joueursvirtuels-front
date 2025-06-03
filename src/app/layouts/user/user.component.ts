import { Component, OnInit } from '@angular/core';
import { SHARED_IMPORTS } from '@shared/shared.imports';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { UtilsService, PageTitleService } from '@app/shared/services/_shared-services';
import { LayoutsUserHeaderComponent } from '@layouts/user/header/header.component';

@Component({
    selector: 'app-layouts-user',
    standalone: true,
    imports: [...SHARED_IMPORTS, LayoutsUserHeaderComponent],
    templateUrl: './user.component.html'
})

export class LayoutUserComponent implements OnInit {
    public pageTitle = "";
    public mainColor = environment.defaultMainColor;
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