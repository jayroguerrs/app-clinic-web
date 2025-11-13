import { Component, OnDestroy, OnInit } from '@angular/core';
import { ParametroSistemaService } from '../../../shared/services/parametro-sistema.service';

@Component({
  selector: 'app-qa-access',
  templateUrl: './qa-access.component.html',
  styleUrls: ['./qa-access.component.scss', '../access/access.component.scss']
})
export class QaAccessComponent implements OnInit, OnDestroy {

  constructor(private parametroService: ParametroSistemaService) { }

  ngOnInit(): void {
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'relative';
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
    document.body.style.position = '';
  }

  redirigirQa(): void {
    this.parametroService.obtenerLinkQA().subscribe((data: any) => {
      window.open(data.response, '_blank');
    })
  }
}
