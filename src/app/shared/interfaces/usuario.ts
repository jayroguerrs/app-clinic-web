export interface User {
  id: number;
  name: string;
  username: string;
  rol: {
    id: number;
    name: string;
  }
  photo: string;
  menu: {};
  sede: {
    id: string;
    name: string;
  }
  fechaRegistra: Date;
  new_menu?: [];
  datosActualizados?: boolean;
  privilegio?: number;
  aprobado?: number;
  idSupervisor?: number;
}
