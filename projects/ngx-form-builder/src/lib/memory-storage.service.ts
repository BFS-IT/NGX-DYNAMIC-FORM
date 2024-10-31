import {Injectable} from '@angular/core';

/**
 * A service for storing data in memory.
 *
 * @remarks
 * This service can be used to store and retrieve data in memory. It is intended to be used
 * as a temporary storage mechanism and is not persistent across application sessions.
 */
@Injectable({
	providedIn: 'root'
})
export class MemoryStorageService {
	private data: { [key: string]: unknown } = {};

	constructor() {
	}

	/**
	 * Sets the value of a given key in the memory storage.
	 *
	 * @param {string} key - The key to set the value for.
	 * @param {unknown} data - The value to set for the given key.
	 */
	public setData(key: string, data: unknown) {
		this.data[key] = data;
	}

	/**
	 * Retrieves the data associated with the given key.
	 *
	 * @param {string} key - The key to retrieve the data for.
	 * @returns {TData | undefined} The data associated with the key, or undefined if the key does not exist.
	 */
	public getData<TData>(key: string): TData | undefined {
		return this.data[key] as TData;
	}

	/**
	 * Removes data from the associated key.
	 *
	 * @param {string} key - The key of the data to be removed.
	 * @return {void}
	 */
	public removeData(key: string): void {
		delete this.data[key];
	}

	/**
	 * Clears all stored data.
	 *
	 * @returns {void}
	 */
	public clearData(): void {
		this.data = {};
	}
}
