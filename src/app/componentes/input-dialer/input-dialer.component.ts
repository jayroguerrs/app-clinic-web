import {AfterViewInit, Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {BehaviorSubject, Observable} from "rxjs";

@Component({
  selector: 'app-input-dialer',
  templateUrl: './input-dialer.component.html',
  styleUrls: ['./input-dialer.component.scss']
})
export class InputDialerComponent implements OnInit, AfterViewInit{

  @Input() step: number = 1;
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() class: string = '';
  @Input() min: number | null = null;
  @Input() max: number | null = null;
  @Input() current: number = 0;
  _current = new BehaviorSubject<number | null>(null);

  constructor() {
  }

  ngOnInit(): void {
    this._current.next(this.current);
  }

  ngAfterViewInit(): void {
  }

  less(): void{
    if(this.min !== null){
      // console.log(this.value > this.min);
      if(this.value > this.min){
        this._current.next(Math.round((this.value - this.step) * 1e12) / 1e12);
      }
    }else{
      // console.log(this.value > this._min);
      this._current.next(Math.round((this.value - this.step) * 1e12) / 1e12);
    }
  }

  plus(): void{
    if(this.max !== null){
      // console.log(this.value > this.min);
      if(this.value < this.max){
        this._current.next(Math.round((this.value + this.step) * 1e12) / 1e12);
      }
    }else{
      // console.log(this.value > this._min);
      this._current.next(Math.round((this.value + this.step) * 1e12) / 1e12);
    }
  }

  get value(): number | null{
    return this._current.value;
  }

  onChange(): Observable<any>{
    return this._current;
  }

}
