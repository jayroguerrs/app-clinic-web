export class ModulosEnt{

    constructor(
        public idModulo: number,
        public path: string,
        public url: string,
        public codigo: string
    ){}

} 
export interface IOModulos {
    idModulo: number;
    path: string;
    url: string;
    codigo: string;
    //disabled?: boolean;
}
export interface IOModulo {
    value: string;
    label: string;
    disabled?: boolean;
    //disabled?: boolean;
}