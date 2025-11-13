import {Component, OnInit} from '@angular/core';


@Component({
  selector: 'app-float-button',
  templateUrl: './float.component.html',
  styleUrls: ['./float.component.scss']
})
export class FloatComponent implements OnInit {

  open = false;

  constructor() { }

  ngOnInit(): void {
  }

  view(): void{
    this.open = !this.open;
  }

}
