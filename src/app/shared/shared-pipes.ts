import { UpperCasePipe, DatePipe } from '@angular/common';
import { LimitToPipe } from '@pipes/limit-to.pipe';

export const SHARED_PIPES = [
    UpperCasePipe,
    DatePipe,
    LimitToPipe
];