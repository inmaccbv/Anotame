export interface Componente {
    icon: string;
    name: string;
    redirectTo: string;
    roles?: string[];
}

export interface Horario {
    id: string;
    dia: string;
    horaApertura: string;
    horaCierre: string;
}

export interface Local {
    numMesas: number;
    distMesas: string;
    numComensales: number;
}

export interface provincias {
    code: number,
    data: string[],
    authorized: string,
    texto: string;
}

export interface DatosContacto {
    nomLocal: string;
    telf1: string;
    telf2: string;
    direccion: string;
    id_cliente: number;
}

export interface Reserva {
    id_reserva: number;
    fechaHoraReserva: string;
    numPax: number;
    notasEspeciales: string;
    estadoReserva: string;
    fechaCreacion: string;
    id_cliente: number;
}

export interface Texto {
    nomLocal: string;
    texto: string;
}

export interface CartaData {
    id_carta: string;
    carta_img: string;
    base64Data?: string;
}


