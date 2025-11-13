import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private timers: Map<string, { sub: Subscription; subject: BehaviorSubject<boolean>; endTime: number }> = new Map();

  constructor() {
    // Al iniciar, rehidrata timers desde localStorage
    const saved = localStorage.getItem('activeTimers');
    if (saved) {
      const parsed = JSON.parse(saved) as { [key: string]: number };
      const now = Date.now();
      for (const [key, endTime] of Object.entries(parsed)) {
        if (endTime > now) {
          this.createTimer(key, endTime);
        }
      }
    }
  }

  /** Inicia un temporizador en segundos */
  start(key: string, seconds: number): BehaviorSubject<boolean> {
    const endTime = Date.now() + seconds * 1000;
    localStorage.setItem('activeTimers', JSON.stringify({ 
      ...this.getTimersFromStorage(), 
      [key]: endTime 
    }));

    // Si ya existía, lo paramos
    this.stop(key);

    return this.createTimer(key, endTime);
  }

  /** Devuelve observable existente, útil si solo quieres suscribirte */
  getStatus(key: string): BehaviorSubject<boolean> | undefined {
    return this.timers.get(key)?.subject;
  }

  stop(key: string) {
    const t = this.timers.get(key);
    if (t) {
      t.sub.unsubscribe();
      t.subject.next(false);
      this.timers.delete(key);

      // Limpia del storage
      const active = this.getTimersFromStorage();
      delete active[key];
      localStorage.setItem('activeTimers', JSON.stringify(active));
    }
  }

  private createTimer(key: string, endTime: number): BehaviorSubject<boolean> {
    const subject = new BehaviorSubject<boolean>(true);
    const sub = interval(1000).subscribe(() => {
      if (Date.now() >= endTime) {
        this.stop(key);
      }
    });

    this.timers.set(key, { sub, subject, endTime });
    return subject;
  }

  private getTimersFromStorage(): { [key: string]: number } {
    const saved = localStorage.getItem('activeTimers');
    return saved ? JSON.parse(saved) : {};
  }

}
