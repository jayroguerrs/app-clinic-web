import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-purchase-history',
  templateUrl: './purchase-history.component.html',
  styleUrls: ['./purchase-history.component.scss']
})
export class PurchaseHistoryComponent {

  @Input() client: any;

  constructor(public activeModal: NgbActiveModal) {}

  cerrarModal(): void {
    this.activeModal.close();
  }
}
