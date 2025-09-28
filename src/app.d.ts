import YDB from 'ydb-sdk'

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			driver: YDB.Driver
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
