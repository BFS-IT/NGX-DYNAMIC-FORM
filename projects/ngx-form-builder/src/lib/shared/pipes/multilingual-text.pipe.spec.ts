import {MultilingualText, MultilingualTextPipe} from './multilingual-text.pipe';
import {TranslateService} from '@ngx-translate/core';
import {TestBed} from '@angular/core/testing';

describe('MultilingualTextPipe', () => {

	let pipe: MultilingualTextPipe;

	beforeEach(async () => {
		const translateService = {
			currentLang: 'fr'
		};

		TestBed.configureTestingModule({
			providers: [
				MultilingualTextPipe,
				{
					provide: TranslateService,
					useValue: translateService
				}
			]
		});

		pipe = TestBed.inject(MultilingualTextPipe);
	});

	it('create an instance', () => {
		expect(pipe).toBeTruthy();
	});

	it('should return empty string when value is undefined', () => {
		// Act
		const text = pipe.transform(undefined);

		// Assert
		expect(text).toBe('');
	});

	it('should return empty string when value is null', () => {
		// Act
		const text = pipe.transform(null);

		// Assert
		expect(text).toBe('');
	});

	it('should return value when value is a string', () => {
		// Act
		const text = pipe.transform('SomeString');

		// Assert
		expect(text).toBe('SomeString');
	});

	it('should return text in language found in TranslateService when value is a MultilingualText and language has a value', () => {
		// Arrange
		const multilingualText: MultilingualText = {
			fr: 'Some french text'
		};

		// Act
		const text = pipe.transform(multilingualText);

		// Assert
		expect(text).toBe('Some french text');
	});

	it('should return first found text when value is a MultilingualText and no text found in language', () => {
		// Arrange
		const multilingualText: MultilingualText = {
			de: 'Some german text',
			it: 'Some italian text'
		};

		// Act
		const text = pipe.transform(multilingualText);

		// Assert
		expect(text).toBe('Some german text');
	});

	it('should return empty string when value is a MultilingualText and no text provided', () => {
		// Arrange
		const multilingualText: MultilingualText = {};

		// Act
		const text = pipe.transform(multilingualText);

		// Assert
		expect(text).toBe('');
	});
});
