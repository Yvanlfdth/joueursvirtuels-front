// src/app/shared/ui/spinner/spinner.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-ui-loading-spinner',
    standalone: true,
    imports: [CommonModule],
    templateUrl: 'loading-spinner.component.html',
    styleUrl: './loading-spinner.component.scss'
})
export class SpinnerComponent {}
