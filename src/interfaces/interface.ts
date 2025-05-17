import { Whatsapp } from '@wppconnect-team/wppconnect';

export interface Bot {
	client: Whatsapp;
}

export interface ClientDB {
	sName: string;
	nBalance: number;
	sPhone: string;
	sState: string;
	owner: number;
}

export interface IText {
	body: string;
	tlf: string;
}
