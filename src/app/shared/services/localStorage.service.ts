import { Injectable } from '@angular/core';

declare var $: any;

@Injectable({
	providedIn: 'root'
})
export class LocalStorageService {
	private objectName: string = "";

  	constructor() { }

    checkItem(itemName: string) {
        return localStorage.getItem(itemName) !== null;
    }

  	setLSItem(itemName: string, object: any) {
		localStorage.setItem(itemName, JSON.stringify(object));
	}

	getLSItem(itemName: string, defaultValue: any = '{}') {
		return JSON.parse(localStorage.getItem(itemName) || defaultValue);
	}

	removeLSItem(itemName: string) {
		localStorage.removeItem(itemName);
	}

	checkContentObject(itemName: string) {
		var object = JSON.parse(localStorage.getItem(itemName)  || '{}');
		var flag = false;
		$.each(object, function(p: number, v: any) {
			if(v !== "" && v !== null && v !== undefined)
				flag = true;
		});

		if(!flag)
			localStorage.removeItem(itemName);
	}
}
