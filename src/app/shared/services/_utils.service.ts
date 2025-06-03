import { map } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { NgxPermissionsService } from 'ngx-permissions';
import { UntypedFormArray, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { environment } from '@env/environment';
import { Globals } from '@app/app.globals';
import { Msg } from '@app/app.msg';
import { LocalStorageService } from './_shared-services';

declare let moment: any;
declare const $: any;

@Injectable({
    providedIn: 'root'
})
// Defines global functions
export class UtilsService {
    public lastNotif = null;

    constructor(private globals: Globals,
                private msg: Msg,
                private localStorageService: LocalStorageService) {}

    inArray(array, value) {
        return (array && Array.isArray(array)) ? (array.indexOf(value) != -1 ? true : false) : false;
    }

    isUserAdmin() {
        let adminRoles = this.globals.adminRoles;
        let user = JSON.parse(this.localStorageService.getLSItem('currentUser'));
        if(user && user.roles) {
            user.roles.forEach(role => {
                if(adminRoles.includes(role.name)) {
                    return true;
                }
            });
        }

        return false;
    }

    showMsg(data) {
        let now = moment();
        let key = data.key;
        let delay = data.delay ?? 4000;
        let status = data.status ?? "error";
        let moreData = data.moreData ?? null;
        let msgMustBeShown = data.msgMustBeShown ?? false;
        let message = this.formatMessage(this.msg.msgs[key], moreData);

        if(!this.lastNotif || (this.lastNotif && now.diff(this.lastNotif, "milliseconds") > delay)) {
            let type = "danger";
            let icon = "pe-7s-close-circle";
            switch (status) {
                case "success":
                    type = "success";
                    icon = "pe-7s-check";
                    break;
                case "error":
                    type = "danger";
                    icon = "pe-7s-close-circle";
                    break;
                case "danger":
                    type = "danger";
                    icon = "pe-7s-close-circle";
                    break;
                case "warning":
                    type = "warning";
                    icon = "pe-7s-attention";
                    break;
                case "info":
                    type = "info";
                    icon = "pe-7s-info";
                    break;
            }

            $.notify({
                icon: icon,
                message: message,
            },
            {
                type: type,
                delay: delay,
                placement: {
                    from: "top",
                    align: "center",
                },
            });
            this.lastNotif = now;
        }
        else if(msgMustBeShown) {
            let self = this;
            data.msgMustBeShown = true;
            setTimeout(function() {
                self.showMsg(data);
            }, now.diff(this.lastNotif, "milliseconds") + 1);
        }
    }

    /**
     * Format a message accorging to its inner variables.
     * Replaces simple variables with its value
     * Replaces three-at-once variables with the word, singular or plural
     * Eg.: string: "Vous avez {count} {count|message|messages} non {count|lu|lus}".
     * 1) count = 1
     * => Vous avez 1 message non lu.
     * 2) count = 3
     * => Vous avez 3 messages non lus.
     * @param string message 
     * @param Object moreData 
     * @returns 
     */
    formatMessage(message: string, moreData: Record<string, any>): string {
        // if no more data, removes "{}" and returns the message
        if(!moreData) {
            return message.replace(/{.*?}/g, "");
        }

        return message.replace(/{(.*?)}/g, (fullMatch, capturedKeys) => {
            const [key, singular, plural] = capturedKeys.split('|');
            const value = moreData[key] != null ? moreData[key] : null;

            // No singular/plural: eg.: {count} => returns 3
            if(singular === undefined) {
                return value ?? "";
            }

            // Singular/plural: eg.: {count|message|messages} => returns messages
            const isPlural = typeof value === "number" ? value > 1 : false;

            return isPlural ? plural : singular;
        });
    }
}