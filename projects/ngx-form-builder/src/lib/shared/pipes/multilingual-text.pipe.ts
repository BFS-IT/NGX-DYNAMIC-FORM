import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

export interface MultilingualText {
	de?: string;
	fr?: string;
	it?: string;
	en?: string;
}

@Pipe({
	name: 'multilingualText',
	standalone: true
})
export class MultilingualTextPipe implements PipeTransform {

	constructor(private translateService: TranslateService) {
	}

	transform(value: (MultilingualText | string) | undefined | null, ...args: unknown[]): string {
		if (value) {
			if (typeof value === 'string') {
				return value;
			} else {
				const lang = this.translateService.currentLang;
				return (value as any)[lang] ?? value.de ?? value.fr ?? value.it ?? value.en ?? '';
			}
		}
		return '';
	}

}
