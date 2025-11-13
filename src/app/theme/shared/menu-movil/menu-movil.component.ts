import {Component, OnInit} from '@angular/core';
import { MatBottomSheetRef} from "@angular/material/bottom-sheet";

@Component({
  selector: 'app-menu-movil',
  templateUrl: './menu-movil.component.html',
  styleUrls: ['./menu-movil.component.scss']
})
export class MenuMovilComponent implements OnInit{

  constructor(
    public bottomRef: MatBottomSheetRef<MenuMovilComponent>,
  ) {}

  closeBottomSheet(){
    this.bottomRef.dismiss();
  }

  ngOnInit() {
  }

}
