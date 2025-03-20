import { Whatsapp } from "@wppconnect-team/wppconnect";

export interface Bot {
    client: Whatsapp;
}

export interface ClientDB {
    nombre: string;
    saldo: number;
    telefonos: string;
    estado: string;
}

export interface IText {
    body: string;
    tlf: string;
}
