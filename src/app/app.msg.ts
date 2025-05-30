import { Injectable } from '@angular/core';

Injectable()

@Injectable()
// Defines msgs
export class Msg {
    msgs = {
        // ERROR
        'NO_PERMISSION_ACCESS_RESOURCE': "Vous n'avez pas la permission pour accéder à cette ressource",
        
        // WARNING
        'NOTIFICATIONS_UNREAD': "{count} {count|notification|notifications} non {count|lue|lues}",

        // INFO
        'NEW_NOTIFICATIONS': "Vous avez {count} {count|nouvelle|nouvelles} {count|notification|notifications}"
    }
}