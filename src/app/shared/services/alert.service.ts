import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {
    success(message: string) {
        Swal.fire({ icon: 'success', title: 'Succès', text: message });
    }

    error(message: string) {
        Swal.fire({ icon: 'error', title: 'Erreur', text: message });
    }

    confirm(options: any) {
        return Swal.fire(options);
    }
}
