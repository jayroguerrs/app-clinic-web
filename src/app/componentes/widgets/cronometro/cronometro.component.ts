import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-cronometro',
  templateUrl: './cronometro.component.html',
  styleUrls: ['./cronometro.component.scss']
})
export class CronometroComponent implements OnInit, OnDestroy {
  private timerSubscription!: Subscription;
  tiempoTranscurrido = 0; // en milisegundos
  corriendo = false;

  get tiempoFormateado(): string {
    const totalMs = this.tiempoTranscurrido;
    const minutos = Math.floor(totalMs / 60000);
    const segundos = Math.floor((totalMs % 60000) / 1000);
    const milisegundos = totalMs % 1000;

    return `${this.pad(minutos)}:${this.pad(segundos)}:${this.padMilis(milisegundos)}`;
  }

  iniciar() {
    if (this.corriendo) return;

    this.corriendo = true;
    this.timerSubscription = interval(10).subscribe(() => {
      this.tiempoTranscurrido += 10; // actualiza cada 10 ms
    });
  }

  pausar() {
    this.corriendo = false;
    this.timerSubscription?.unsubscribe();
  }

  reiniciar() {
    this.pausar();
    this.tiempoTranscurrido = 0;
  }

  pad(valor: number): string {
    return valor < 10 ? '0' + valor : valor.toString();
  }

  padMilis(valor: number): string {
    const centesimas = Math.floor(valor / 10); // convierte ms a centésimas (dos dígitos)
    return centesimas.toString().padStart(2, '0');
  }
  constructor() { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

}
