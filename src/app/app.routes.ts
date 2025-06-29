import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: false,
            anchorScrolling: 'enabled'
        }),
    ],
    exports: [RouterModule]
})
export class AppRoutesgModule {}