import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ClienteService } from '../../../../shared/services/cliente.service';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-zonas-atendidas',
  templateUrl: './zonas-atendidas.component.html',
  styleUrls: ['./zonas-atendidas.component.scss']
})
export class ZonasAtendidasComponent implements OnInit, OnDestroy {
  @Input() idCliente: number;

  subscriptionZonasAtendidas: Subscription;
  zonasCorporalesHistorico: any = [];
  currentIdServicio: number;
  loadingZonasAtendidas = false;

  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
  ) { }

  ngOnDestroy(): void {
    this.subscriptionZonasAtendidas?.unsubscribe();
  }

  ngOnInit(): void {
    this.mostrarZonasAtendidas();
  }

  mostrarZonasAtendidasService(): void {
    this.loadingZonasAtendidas = true;

    this.subscriptionZonasAtendidas = this.clienteService.obtenerTodasZonasAtendidasPorServicio(this.idCliente, this.currentIdServicio).subscribe(
      resultado => {
        this.zonasCorporalesHistorico = resultado;
      },
      error => {
        console.log('Error al obtener las zonas del cliente', error);
        this.loadingZonasAtendidas = false;
      }, () => {
        this.loadingZonasAtendidas = false;
      }
    );

  }

  mostrarZonasAtendidas(){
    this.route.queryParams.subscribe(params => {
      if(params['idServicio']) {
        this.currentIdServicio = +params['idServicio'];
        this.mostrarZonasAtendidasService()
      } else{
        this.currentIdServicio = 0;
        this.mostrarZonasAtendidasService()
      }
    });
  }
}
