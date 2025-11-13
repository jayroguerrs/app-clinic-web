import {Cita} from "./corporal-360/Cita";

export class BoxTime{
  index: number;
  minuto: number;
  reserved: boolean;
  hover: boolean;
  selected: boolean;
  start: boolean;
  end: boolean;

  hoverStart: boolean;
  hoverEnd: boolean;

  reservedStart: boolean;
  reservedEnd: boolean;

  selectedStart: boolean;
  selectedEnd: boolean;


  constructor() {
    this.index = 0;
    this.hover = false;
    this.selected = false;
    this.start = false;
    this.end = false;
    this.reserved = false;
    this.hoverStart = false;
    this.hoverEnd = false;
    this.reservedStart = false;
    this.reservedEnd = false;
    this.selectedStart = false;
    this.selectedEnd = false;
  }
}

export class BoxDay{
  submitted: boolean;
  loadingSubmit: boolean;
  statusSubmit: 'error' | 'success' | null;
  date: Date | null;
  cita: Cita | null;
  saved: boolean;
  constructor() {
    this.loadingSubmit = false;
    this.statusSubmit = null;
    this.date = null;
    this.cita = null;
    this.saved = false;
  }
}

export class BoxWeek{
  submitted: boolean;
  loadingSubmit: boolean;
  saved: boolean;
  dias: BoxDay[];
  constructor() {
    this.saved = false;
    this.loadingSubmit = false;
    this.dias = [];
  }
}
