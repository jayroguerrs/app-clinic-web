import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {BehaviorSubject, Subscriber} from "rxjs";

@Component({
  selector: 'app-group-button',
  templateUrl: './group-button.component.html',
  styleUrls: ['./group-button.component.scss']
})
export class GroupButtonComponent implements OnInit, AfterViewInit {

  @Input() column: number = 4;
  @Input() items: { value: number; text: string }[] = [];
  @Input() current: number | null = null;
  @Input() class: string = 'btn btn-light-primary';

  _current = new BehaviorSubject<number | null>(null);

  constructor() {
  }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this._current.next(this.current);
  }

  select(value: number): void{
    this._current.next(value);
  }

  isActive(value: number): boolean{
    return this._current.value === value;
  }

  get value(): number | null{
    return this._current.value;
  }

}
