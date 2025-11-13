import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthGuard } from './shared/helpers/auth.guard';
import { LogoutComponent } from './componentes/account/logout/logout.component';
import { LogoutGuard } from './shared/guards/logout.guard';
import { VerificationGuard } from './shared/guards/verification.guard';
import { paths as p } from '../commons/routes'; 

const accountModule = () =>
  import('./componentes/account/account.module').then((x) => x.AccountModule);

const routes: Routes = [
  { path: 'account', loadChildren: accountModule, canActivate: [LogoutGuard] },
  { path: 'Salir', component: LogoutComponent },
  {
    path: '',
    component: AdminComponent,
    canActivate: [AuthGuard],
    canActivateChild: [VerificationGuard],
    children: [
      {
        path: '',
        redirectTo: p.home.origin,
        pathMatch: 'full',
        data: { title: 'Agenda | Depilzone' },
      },
      { path: 'account', loadChildren: accountModule },
      {
        path: p.home.origin,
        loadChildren: () =>
          import('./componentes/principal/principal.module').then(
            (m) => m.PrincipalModule
          ),
        data: { title: 'INICIO' },
      },
      {
        path: 'Usuario',
        loadChildren: () =>
          import('./componentes/usuario/usuario.module').then(
            (m) => m.UsuarioModule
          ),
        canActivate: [AuthGuard],
        data: { title: 'USUARIO' },
      },
      {
        path: 'CambiarClave',
        loadChildren: () =>
          import(
            './componentes/usuario/usuario-cambiar-clave/usuario-cambiar-clave.module'
          ).then((m) => m.UsuarioCambiarClaveModule),
        canActivate: [AuthGuard],
        data: { title: 'CAMBIAR CLAVE' },
      },
      {
        path: 'Perfil',
        loadChildren: () =>
          import(
            './componentes/perfil/perfil-listado/perfil-listado.module'
          ).then((m) => m.PerfilListadoModule),
        canActivate: [AuthGuard],
        data: { title: 'PERFIL' },
      },
      {
        path: 'Menu',
        loadChildren: () =>
          import('./componentes/menu/menu-listado/menu-listado.module').then(
            (m) => m.MenuListadoModule
          ),
        data: { title: 'MENU' },
      },
      {
        path: 'MensajeSistema',
        loadChildren: () =>
          import('./componentes/sistema/mensaje/mensaje.module').then(
            (m) => m.MensajeModule
          ),
        data: { title: 'MENSAJE DE SISTEMA' },
      },
      {
        path: 'Eventos',
        loadChildren: () =>
          import('./pagina/eventos/eventos.module').then(
            (m) => m.EventosModule
          ),
        data: { title: 'EVENTOS DEL SISTEMA' },
      },
      {
        path: 'Cerrar',
        loadChildren: () =>
          import('./componentes/account/account.module').then(
            (m) => m.AccountModule
          ),
      },

      {
        path: 'Cliente',
        loadChildren: () =>
          import('./componentes/cliente/cliente.module').then(
            (m) => m.ClienteModule
          ),
        data: { title: 'CLIENTE' },
      },
      {
        path: 'ClientePerfil/:id',
        loadChildren: () =>
          import(
            './componentes/cliente/cliente-perfil/cliente-perfil.module'
          ).then((m) => m.ClientePerfilModule),
      },
      {
        path: 'Cliente/:id',
        loadChildren: () =>
          import('./componentes/cliente/cliente.module').then(
            (m) => m.ClienteModule
          ),
      },
      {
        path: 'Cliente/:id/AgendarCita',
        loadChildren: () =>
          import(
            './pagina/cliente-generar-cita/cliente-generar-cita.module'
          ).then((m) => m.ClienteGenerarCitaModule),
      },
      {
        path: 'ClienteNumero',
        loadChildren: () =>
          import(
            './componentes/cliente/cliente-listado-numero/cliente-listado-numero.module'
          ).then((m) => m.ClienteListadoNumeroModule),
      },

      {
        path: 'Anuncios',
        loadChildren: () =>
          import('./componentes/anuncio/anuncio.module').then(
            (m) => m.AnuncioModule
          ),
        data: { title: 'ANUNCIO' },
      },
      {
        path: 'MaquinaMarca',
        loadChildren: () =>
          import('./pagina/maquina-marca/maquina-marca.module').then(
            (m) => m.MaquinaMarcaModule
          ),
        data: { title: 'MAQUINA MARCA' },
      },
      {
        path: 'Maquinas',
        loadChildren: () =>
          import('./componentes/maquina/maquina.module').then(
            (m) => m.MaquinaModule
          ),
        data: { title: 'MAQUINAS' },
      },
      {
        path: 'MaquinaSede',
        loadChildren: () =>
          import('./componentes/maquina-sede/maquina-sede.module').then(
            (m) => m.MaquinaSedeModule
          ),
        data: { title: 'MAQUINA SEDE' },
      },
      {
        path: 'Zonas',
        loadChildren: () =>
          import(
            './componentes/zona-corporal/zona-corporal-listado/zona-corporal.module'
          ).then((m) => m.ZonaCorporalModule),
        data: { title: 'ZONA CORPORAL' },
      },
      {
        path: 'TipodeCita',
        loadChildren: () =>
          import('./componentes/tipo-cita/tipo-cita.module').then(
            (m) => m.TipoCitaModule
          ),
        data: { title: 'TIPO DE CITA' },
      },
      {
        path: 'Sede',
        loadChildren: () =>
          import('./componentes/sede/sede.module').then((m) => m.SedeModule),
        data: { title: 'SEDE' },
      },
      {
        path: 'Promocion',
        loadChildren: () =>
          import('./componentes/promocion/promocion.module').then(
            (m) => m.PromocionModule
          ),
        data: { title: 'PROMOCION' },
      },
      {
        path: 'PromocionCategoria',
        loadChildren: () =>
          import(
            './pagina/promocion-categoria/promocion-categoria.module'
          ).then((m) => m.PromocionCategoriaModule),
        data: { title: 'PROMOCION CATEGORIA' },
      },
      {
        path: 'Preferente',
        loadChildren: () =>
          import('./componentes/preferente/preferente.module').then(
            (m) => m.PreferenteModule
          ),
        data: { title: 'PREFERENTE' },
      },
      {
        path: 'Encuesta',
        loadChildren: () =>
          import('./componentes/encuesta/encuesta.module').then(
            (m) => m.EncuestaModule
          ),
        data: { title: 'ENCUESTA' },
      },
      {
        path: 'Plantillas',
        loadChildren: () =>
          import('./pagina/plantilla/plantilla.module').then(
            (m) => m.PlantillaModule
          ),
        data: { title: 'PLANTILLA' },
      },
      {
        path: 'Ventas',
        loadChildren: () =>
          import('./pagina/ventas/ventas.module').then((m) => m.VentasModule),
        data: { title: 'Ventas' },
      },
      {
        path: 'SerieFacturacion',
        loadChildren: () =>
          import('./pagina/factura-serie/factura-serie.module').then(
            (m) => m.FacturaSerieModule
          ),
        data: { title: 'FACTURA SERIE' },
      },

      {
        path: 'TipodeDocumento',
        loadChildren: () =>
          import(
            './componentes/tipo-documento/tipo-documento-listado/tipo-documento-listado.module'
          ).then((m) => m.TipoDocumentoListadoModule),
        data: { title: 'TIPO DE DOCUMENTO' },
      },
      {
        path: 'DocumentoListado',
        loadChildren: () =>
          import(
            './componentes/documento/documento/documento-listado/documento-listado.module'
          ).then((m) => m.DocumentoListadoModule),
      },
      {
        path: 'DocumentoPlantilla',
        loadChildren: () =>
          import(
            './componentes/plantilla-documento/plantilla-documento-listado/plantilla-documento-listado.module'
          ).then((m) => m.PlantillaDocumentoListadoModule),
        data: { title: 'PLANTILLA DOCUMENTOS' },
      },
      {
        path: 'DocumentoPlantilla/:id/:accion',
        loadChildren: () =>
          import(
            './componentes/plantilla-documento/plantilla-documento-registro/plantilla-documento-registro.module'
          ).then((m) => m.PlantillaDocumentoRegistroModule),
        data: { title: 'REGISTRO PLANTILLA' },
      },

      {
        path: 'CitaListado',
        redirectTo: p.home.origin,
        pathMatch: 'prefix',
      },
      {
        path: 'CitaComision',
        loadChildren: () =>
          import('./componentes/cita/cita-comision/cita-comision.module').then(
            (m) => m.CitaComisionModule
          ),
        data: { title: 'COMISION' },
      },
      {
        path: 'HistoriaClinica',
        loadChildren: () =>
          import(
            './componentes/cita/historia-clinica/historia-clinica.module'
          ).then((m) => m.HistoriaClinicaModule),
        data: { title: 'HISTORIA' },
      },
      {
        path: 'Cita',
        loadChildren: () =>
          import('./componentes/cita/cita-registro/cita-registro.module').then(
            (m) => m.CitaRegistroModule
          ),
      },
      {
        path: 'Cita/:id/:accion/:idcliente/:idPreferente/:idServicio',
        loadChildren: () =>
          import('./componentes/cita/cita-registro/cita-registro.module').then(
            (m) => m.CitaRegistroModule
          ),
      },
      {
        path: 'CitaAsignacion',
        loadChildren: () =>
          import(
            './componentes/cita/cita-asignacion/cita-asignacion.module'
          ).then((m) => m.CitaAsignacionModule),
      },
      {
        path: 'CitaAbandonadaAsignacion',
        loadChildren: () =>
          import(
            './pagina/citas-abandonadas-asignacion/citas-abandonadas-asignacion.module'
          ).then((m) => m.CitasAbandonadasAsignacionModule),
      },
      {
        path: 'CitaConfirmacion',
        loadChildren: () =>
          import(
            './componentes/cita/cita-confirmacion/cita-confirmacion.module'
          ).then((m) => m.CitaConfirmacionModule),
      },
      {
        path: 'CitaAbandonadaConfirmacion',
        loadChildren: () =>
          import(
            './pagina/citas-abandonadas-confirmacion/citas-abandonadas-confirmacion.module'
          ).then((m) => m.CitasAbandonadasConfirmacionModule),
      },
      {
        path: 'Horarios',
        loadChildren: () =>
          import('./componentes/cita/cita-horario/cita-horario.module').then(
            (m) => m.CitaHorarioModule
          ),
      },
      {
        path: 'ClienteAsignacion',
        loadChildren: () =>
          import(
            './componentes/cita/cliente-asignacion/cliente-asignacion.module'
          ).then((m) => m.ClienteAsignacionModule),
      },
      {
        path: 'ClienteAsignadoConfirmacion',
        loadChildren: () =>
          import(
            './componentes/cita/cliente-asignado-confirmacion/cliente-asignado-confirmacion.module'
          ).then((m) => m.ClienteAsignadoConfirmacionModule),
      },

      {
        path: 'Corporal360/Cita/:id/:accion/:idcliente',
        loadChildren: () =>
          import(
            './pagina/agendar-cita-corporal360/agendar-cita-corporal360.module'
          ).then((m) => m.AgendarCitaCorporal360Module),
      },
      {
        path: 'Corporal360/Cronograma',
        loadChildren: () =>
          import(
            './pagina/agendar-cronograma-corporal360/agendar-cronograma-corporal360.module'
          ).then((m) => m.AgendarCronogramaCorporal360Module),
      },
      {
        path: 'Corporal360/Cronograma/:id/:accion/:idcliente/:idPreferente/:idCita/:accionCita',
        loadChildren: () =>
          import(
            './pagina/agendar-cronograma-corporal360/agendar-cronograma-corporal360.module'
          ).then((m) => m.AgendarCronogramaCorporal360Module),
      },
      {
        path: 'Corporal360/Servicio',
        loadChildren: () =>
          import('./corporal360/pagina/servicio/servicio.module').then(
            (m) => m.ServicioModule
          ),
      },
      {
        path: 'Corporal360/Caso',
        loadChildren: () =>
          import('./corporal360/pagina/caso/caso.module').then(
            (m) => m.CasoModule
          ),
      },
      {
        path: 'Corporal360/Zona',
        loadChildren: () =>
          import('./corporal360/pagina/zona/zona.module').then(
            (m) => m.ZonaModule
          ),
      },
      {
        path: 'Corporal360/TipoCita',
        loadChildren: () =>
          import('./corporal360/pagina/tipo-cita/tipo-cita.module').then(
            (m) => m.TipoCitaModule
          ),
      },
      {
        path: 'Corporal360/TipoCliente',
        loadChildren: () =>
          import('./corporal360/pagina/tipo-cliente/tipo-cliente.module').then(
            (m) => m.TipoClienteModule
          ),
      },
      {
        path: 'Corporal360/Categoria',
        loadChildren: () =>
          import('./corporal360/pagina/categoria/categoria.module').then(
            (m) => m.CategoriaModule
          ),
      },
      {
        path: 'Corporal360/Sala',
        loadChildren: () =>
          import('./corporal360/pagina/sala/sala.module').then(
            (m) => m.SalaModule
          ),
      },

      {
        path: 'Servicio',
        loadChildren: () =>
          import('./pagina/servicio/servicio.module').then(
            (m) => m.ServicioModule
          ),
      },
      {
        path: 'Tecnologia',
        loadChildren: () =>
          import('./pagina/tecnologia/tecnologia.module').then(
            (m) => m.TecnologiaModule
          ),
      },
      {
        path: 'Tratamiento',
        loadChildren: () =>
          import('./pagina/tratamiento/tratamiento.module').then(
            (m) => m.TratamientoModule
          ),
      },
      {
        path: 'ZonaTratamiento',
        loadChildren: () =>
          import('./pagina/zona-tratamiento/zona-tratamiento.module').then(
            (m) => m.ZonaTratamientoModule
          ),
      },

      {
        path: 'Caja',
        loadChildren: () =>
          import('./componentes/caja/caja.module').then((m) => m.CajaModule),
        data: { title: 'CAJA' },
      },
      {
        path: 'EgresoCaja',
        loadChildren: () =>
          import('./componentes/caja/caja-egreso/caja-egreso.module').then(
            (m) => m.CajaEgresoModule
          ),
      },
      {
        path: 'DocumentoFactura',
        loadChildren: () =>
          import('./componentes/tipo-comprobante/tipo-comprobante.module').then(
            (m) => m.TipoComprobanteModule
          ),
        data: { title: 'TIPO COMPROBANTE' },
      },
      {
        path: 'Ticket',
        loadChildren: () =>
          import('./componentes/Ticket/ticket.module').then(
            (m) => m.TicketModule
          ),
        data: { title: 'TICKET' },
      },
      {
        path: 'PromocionVista',
        loadChildren: () =>
          import('./componentes/modulos/promocion/promocion.module').then(
            (m) => m.ModuloPromocionModule
          ),
        data: { title: 'PROMOCION' },
      },
      {
        path: 'PlantillasVista',
        loadChildren: () =>
          import('./pagina/modulo-plantilla/modulo-plantilla.module').then(
            (m) => m.ModuloPlantillaModule
          ),
        data: { title: 'PLANTILLAS' },
      },
      {
        path: 'Marketing',
        loadChildren: () =>
          import('./componentes/marketing/marketing.module').then(
            (m) => m.MarketingModule
          ),
        data: { title: 'MARKETING' },
      },

      {
        path: 'Incidencia',
        loadChildren: () =>
          import('./componentes/soporte/incidencia/incidencia.module').then(
            (m) => m.IncidenciaModule
          ),
        data: { title: 'INCIDENCIA' },
      },

      {
        path: 'EvolucionCitaMensual',
        loadChildren: () =>
          import(
            './componentes/reportes/evolucion-cita-mensual/evolucion-cita-mensual.module'
          ).then((m) => m.EvolucionCitaMensualModule),
        data: { title: 'CITAS MENSUAL' },
      },
      {
        path: 'ReporteCitaModule',
        loadChildren: () =>
          import('./componentes/reportes/Cita/reportecitas.module').then(
            (m) => m.ReporteCitaModule
          ),
      },
      {
        path: 'ClienteRecurrente',
        loadChildren: () =>
          import(
            './componentes/reportes/Cliente/clienterecurrente.module'
          ).then((m) => m.ClienteRecurrenteModule),
      },
      {
        path: 'ReporteZonasMaximo',
        loadChildren: () =>
          import(
            './componentes/reportes/Zona/zonasmasatendidas/reportezonasmaximo.module'
          ).then((m) => m.ZonaMaximoReportesModule),
      },
      {
        path: 'ReporteZonasMinimo',
        loadChildren: () =>
          import(
            './componentes/reportes/Zona/zonasmenosatendidas/reportezonasminimo.module'
          ).then((m) => m.ZonaMinimoReportesModule),
      },
      {
        path: 'Especialistas',
        loadChildren: () =>
          import(
            './componentes/reportes/Especialista/especialistas.module'
          ).then((m) => m.EspecialistasModule),
      },
      {
        path: 'ReporteCitaEstado',
        loadChildren: () =>
          import(
            './componentes/reportes/CitaEstado/reportecitaestado.module'
          ).then((m) => m.ReporteCitaModule),
      },
      {
        path: 'ReporteCitaEncuesta',
        loadChildren: () =>
          import(
            './componentes/reportes/CitaEncuesta/reportecitaencuesta.module'
          ).then((m) => m.ReporteCitaEncuestaModule),
      },
      {
        path: 'ReporteClienteEncuesta',
        loadChildren: () =>
          import(
            './componentes/reportes/ClienteEncuesta/cliente-encuesta.module'
          ).then((m) => m.ClienteEncuestaModule),
      },
      {
        path: 'ReporteVentas',
        loadChildren: () =>
          import('./componentes/reportes/Ventas/ventas.module').then(
            (m) => m.VentasModule
          ),
      },
      {
        path: 'ReportePromocionesRanking',
        loadChildren: () =>
          import(
            './componentes/reportes/PromocionRankingVentas/promocion-ranking-ventas.module'
          ).then((m) => m.PromocionRankingVentasModule),
      },
      {
        path: 'ReporteEncuesta',
        loadChildren: () =>
          import('./componentes/reportes/encuesta/encuesta.module').then(
            (m) => m.EncuestaModule
          ),
      },
      {
        path: 'ReporteEspecialistaAtendidos',
        loadChildren: () =>
          import(
            './componentes/reportes/EspecialistaAtendidos/especialista-atendidos.module'
          ).then((m) => m.EspecialistaAtendidosModule),
      },
      {
        path: 'ReporteCitasAtendidas',
        loadChildren: () =>
          import(
            './componentes/reportes/CitasAtendidas/citas-atendidas.module'
          ).then((m) => m.CitasAtendidasModule),
      },
      {
        path: 'ReporteCitasAtendidasDiarias',
        loadChildren: () =>
          import(
            './componentes/reportes/CitasAtendidasDiarias/citas-atendidas-diarias.module'
          ).then((m) => m.CitasAtendidasDiariasModule),
      },
      {
        path: 'Incidencias',
        loadChildren: () =>
          import('./pagina/incidencia/incidencia.module').then(
            (m) => m.IncidenciaModule
          ),
      },
      {
        path: 'CitaReporte',
        loadChildren: () =>
          import('./componentes/reportes/CitaReporte/cita-reporte.module').then(
            (m) => m.CitaReporteModule
          ),
      },
      {
        path: 'CitaReporteDetallado',
        loadChildren: () =>
          import(
            './componentes/reportes/CitaReporteDetallado/cita-reporte-detallado.module'
          ).then((m) => m.CitaReporteDetalladoModule),
      },
      {
        path: 'ReporteAgendadoOperador',
        loadChildren: () =>
          import(
            './componentes/reportes/CitaDetalleReporteAgendado/cita-detalle-reporte-agendado.module'
          ).then((m) => m.CitaDetalleReporteAgendadoModule),
      },
      {
        path: 'ReporteCitaAsignada',
        loadChildren: () =>
          import(
            './componentes/reportes/reporte-cita-asignacion/reporte-cita-asignacion.module'
          ).then((m) => m.ReporteCitaAsignacionModule),
      },

      {
        path: 'ReporteCumpleanio',
        loadChildren: () =>
          import(
            './pagina/cliente-cumpleanios/cliente-cumpleanios.module'
          ).then((m) => m.ClienteCumpleaniosModule),
      },
      {
        path: 'ReporteNuevoCliente',
        loadChildren: () =>
          import(
            './componentes/reportes/reporte-clientes-nuevos/reporte-clientes-nuevos.module'
          ).then((m) => m.ReporteClientesNuevosModule),
      },
      {
        path: 'ReportePreferenteRedes',
        loadChildren: () =>
          import('./pagina/preferentes-redes/preferentes-redes.module').then(
            (m) => m.PreferentesRedesModule
          ),
      },
      {
        path: 'ReportePreferenteEstado',
        loadChildren: () =>
          import('./pagina/preferentes-estado/preferentes-estado.module').then(
            (m) => m.PreferenteEstadoModule
          ),
      },

      {
        path: 'AnalisisPotencialVenta',
        loadChildren: () =>
          import(
            './pagina/analisis-potencial-venta/analisis-potencial-venta.module'
          ).then((m) => m.AnalisisPotencialVentaModule),
      },

      // Facturación
      {
        path: 'Facturacion/Token',
        loadChildren: () =>
          import('./pagina/factura-token/factura-token.module').then(
            (m) => m.FacturaTokenModule
          ),
        data: { title: 'Factura - Tokens' },
      },
      {
        path: 'Facturacion/TipoDocumento',
        loadChildren: () =>
          import(
            './pagina/factura-tipo-documento/factura-tipo-documento.module'
          ).then((m) => m.FacturaTipoDocumentoModule),
        data: { title: 'Factura - Tipo de Documento' },
      },
      {
        path: 'Facturacion/TipoIgv',
        loadChildren: () =>
          import('./pagina/factura-tipo-igv/factura-tipo-igv.module').then(
            (m) => m.FacturaTipoIgvModule
          ),
        data: { title: 'Factura - Tipo de Igv' },
      },
      {
        path: 'Facturacion/PorcentajeIgv',
        loadChildren: () =>
          import(
            './pagina/factura-porcentaje-igv/factura-porcentaje-igv.module'
          ).then((m) => m.FacturaPorcentajeIgvModule),
        data: { title: 'Factura - Porcentaje Igv' },
      },
      {
        path: 'Facturacion/TipoTransaccion',
        loadChildren: () =>
          import(
            './pagina/factura-transaccion-sunat/factura-transaccion-sunat.module'
          ).then((m) => m.FacturaTransaccionSunatModule),
        data: { title: 'Factura - Tipo de Transacción' },
      },
      {
        path: 'Facturacion/TipoMoneda',
        loadChildren: () =>
          import(
            './pagina/factura-tipo-moneda/factura-tipo-moneda.module'
          ).then((m) => m.FacturaTipoMonedaModule),
        data: { title: 'Factura - Tipo de Transacción' },
      },
      {
        path: 'Facturacion/UnidadMedida',
        loadChildren: () =>
          import(
            './pagina/comprobante-electronico/comprobante-unidad-medida/comprobante-unidad-medida.module'
          ).then((m) => m.ComprobanteUnidadMedidaModule),
        data: { title: 'Comprobante - Unidad de Medida' },
      },
      {
        path: 'Facturacion/Serie',
        loadChildren: () =>
          import(
            './pagina/comprobante-electronico/comprobante-serie/comprobante-serie.module'
          ).then((m) => m.ComprobanteSerieModule),
        data: { title: 'Comprobante - Serie' },
      },
      {
        path: 'Facturacion/ComprobanteElectronico',
        loadChildren: () =>
          import(
            './pagina/comprobante-electronico/comprobante-electronico-listado/comprobante-electronico-listado.module'
          ).then((m) => m.ComprobanteElectronicoListadoModule),
        data: { title: 'Comprobante - Listado' },
      },
      {
        path: 'Facturacion/TipoNotaCredito',
        loadChildren: () =>
          import(
            './pagina/comprobante-electronico/comprobante-tipo-nota-credito/comprobante-tipo-nota-credito.module'
          ).then((m) => m.ComprobanteTipoNotaCreditoModule),
        data: { title: 'Comprobante - Tipo Nota de Crédito' },
      },
      {
        path: 'Facturacion/TipoNotaDebito',
        loadChildren: () =>
          import(
            './pagina/comprobante-electronico/comprobante-tipo-nota-debito/comprobante-tipo-nota-debito.module'
          ).then((m) => m.ComprobanteTipoNotaDebitoModule),
        data: { title: 'Comprobante - Tipo Nota de Débito' },
      },

      {
        path: 'Facturacion/ReporteVenta',
        loadChildren: () =>
          import(
            './pagina/comprobante-electronico/comprobante-electronico-reporte-venta/comprobante-electronico-reporte-venta.module'
          ).then((m) => m.ComprobanteElectronicoReporteVentaModule),
        data: { title: 'Reporte Venta' },
      },
      {
        path: 'Facturacion/ReportePago',
        loadChildren: () =>
          import(
            './pagina/comprobante-electronico/comprobante-electronico-reporte-pago/comprobante-electronico-reporte-pago.module'
          ).then((m) => m.ComprobanteElectronicoReportePagoModule),
        data: { title: 'Reporte Pago' },
      },
      {
        path: 'Facturacion/ReporteVentaCliente',
        loadChildren: () =>
          import(
            './pagina/comprobante-electronico/comprobante-electronico-reporte-venta-cliente/comprobante-electronico-reporte-venta-cliente.module'
          ).then((m) => m.ComprobanteElectronicoReporteVentaClienteModule),
        data: { title: 'Reporte Venta / Cliente' },
      },
      {
        path: 'Facturacion/ReporteVentaProducto',
        loadChildren: () =>
          import(
            './pagina/comprobante-electronico/comprobante-electronico-reporte-venta-producto/comprobante-electronico-reporte-venta-producto.module'
          ).then((m) => m.ComprobanteElectronicoReporteVentaProductoModule),
        data: { title: 'Reporte Venta / Producto' },
      },
      {
        path: 'Facturacion/SeguimientoCaja',
        loadChildren: () =>
          import(
            './pagina/comprobante-electronico/seguimiento-caja/seguimiento-caja.module'
          ).then((m) => m.SeguimientoCajaModule),
        data: { title: 'Seguimiento Caja' },
      },
      {
        path: 'Facturacion/NotaCredito',
        loadChildren: () =>
          import(
            './pagina/comprobante-electronico/comprobante-nota-credito/comprobante-nota-credito.module'
          ).then((m) => m.ComprobanteNotaCreditoModule),
        data: { title: 'Nota de Crédito' },
      },
      {
        path: 'Facturacion/Anulaciones',
        loadChildren: () =>
          import(
            './pagina/comprobante-electronico/comprobante-electronico-anulacion/comprobante-electronico-anulacion.module'
          ).then((m) => m.ComprobanteElectronicoAnulacionModule),
        data: { title: 'Comprobante Electrónico - Solicitudes de anulación' },
      },

      //Nuevas Rutas 16 12 2024
      {
        path: 'ControlDeCitas',
        loadChildren: () =>
          import(
            './componentes/cita/control-de-citas/control-de-citas.module'
          ).then((m) => m.ControlDeCitasModule),
        data: { title: 'Control de Citas' },
      },
      {
        path: 'BoxListado',
        loadChildren: () =>
          import('./componentes/box/box-listado/box-listado.module').then(
            (m) => m.BoxListadoModule
          ),
        data: { title: 'Boxs' },
      },

      {
        path: 'UsuarioSupervisados',
        loadChildren: () =>
          import(
            './componentes/usuario-supervisados/usuario-supervisados.module'
          ).then((m) => m.UsuarioSupervisadosModule),
        canActivate: [AuthGuard],
        data: { title: 'USUARIO SUPERVISADOS' },
      },

      //Marketing
      {
        path: p.marketing.origin,
        loadChildren: () =>
          import('./componentes/marketing/marketing.module').then(
            (m) => m.MarketingModule
          ),
      },

      // Operaciones
      {
        path: 'OperacionHistoriaMasiva',
        loadChildren: () =>
          import(
            './pagina/operacion-historias-masivas/operacion-historias-masivas.module'
          ).then((m) => m.OperacionHistoriasMasivasModule),
      },
      {
        path: 'OperacionSiguientesCitas',
        loadChildren: () =>
          import(
            './pagina/operacion-generar-siguientes-citas/operacion-generar-siguientes-citas.module'
          ).then((m) => m.OperacionGenerarSiguientesCitasModule),
      },
      // UnAuthorized
      {
        path: p.unauthorized.origin,
        loadChildren: () =>
          import('./componentes/unauthorized/unauthorized.module').then(
            (m) => m.UnauthorizedModule
          ),
        canActivate: [],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
