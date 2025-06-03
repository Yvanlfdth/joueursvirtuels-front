import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'limitTo',
	standalone: true,
})
export class LimitToPipe implements PipeTransform {
	transform(value: string | null | undefined, limitStr: string): string {
		if(!value) {
			return "";
		}
		const limit = parseInt(limitStr, 10);
		if(isNaN(limit) || limit <= 0) {
			return value;
		}

		return value.length > limit ? value.substring(0, limit) + "..." : value;
	}
}