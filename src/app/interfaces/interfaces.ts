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
    nombre: string;
    telefono1: string;
    telefono2: string;
    direccion: string;
}