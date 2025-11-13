import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CUSTOM_ELEMENTS_SCHEMA, NgModule} from '@angular/core';

import es from '@angular/common/locales/es';
import { registerLocaleData, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { Spanish } from "flatpickr/dist/l10n/es.js"


// used to create fake backend
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './theme/shared/shared.module';
import { AppComponent } from './app.component';
import { AdminComponent } from './theme/layout/admin/admin.component';
import { AuthComponent } from './theme/layout/auth/auth.component';
import { NavigationComponent } from './theme/layout/admin/navigation/navigation.component';
import { NavLogoComponent } from './theme/layout/admin/navigation/nav-logo/nav-logo.component';
import { NavContentComponent } from './theme/layout/admin/navigation/nav-content/nav-content.component';
import { NavigationItem} from './theme/layout/admin/navigation/navigation';
import { NavGroupComponent } from './theme/layout/admin/navigation/nav-content/nav-group/nav-group.component';
import { NavCollapseComponent } from './theme/layout/admin/navigation/nav-content/nav-collapse/nav-collapse.component';
import { NavItemComponent } from './theme/layout/admin/navigation/nav-content/nav-item/nav-item.component';
import { NavBarComponent } from './theme/layout/admin/nav-bar/nav-bar.component';
import { ToggleFullScreenDirective} from './theme/shared/full-screen/toggle-full-screen';

import { NavLeftComponent } from './theme/layout/admin/nav-bar/nav-left/nav-left.component';
import { NavSearchComponent } from './theme/layout/admin/nav-bar/nav-left/nav-search/nav-search.component';
import { NavRightComponent } from './theme/layout/admin/nav-bar/nav-right/nav-right.component';
import { ChatUserListComponent} from './theme/layout/admin/nav-bar/nav-right/chat-user-list/chat-user-list.component';
import { FriendComponent } from './theme/layout/admin/nav-bar/nav-right/chat-user-list/friend/friend.component';
import { ChatMsgComponent} from './theme/layout/admin/nav-bar/nav-right/chat-msg/chat-msg.component';
import { ConfigurationComponent } from './theme/layout/admin/configuration/configuration.component';
import { RouteReuseStrategy } from '@angular/router';
import {
  NgbAccordionModule,
  NgbButtonsModule,
  NgbDropdownModule,
  NgbModule,
  NgbTooltipModule
} from '@ng-bootstrap/ng-bootstrap';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgforReversePipe } from './shared/pipe/ngfor-reverse.pipe';
import { DisableDirective } from './shared/directive/disable.directive';
import { HomeComponent } from './componentes/home';

import { NgIdleKeepaliveModule } from '@ng-idle/keepalive'; // this includes the core NgIdleModule but includes keepalive providers for easy wireup
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {ColorPickerModule} from "ngx-color-picker";
import {NavBarTopModule} from "./componentes/nav/nav-bar-top/nav-bar-top.module";
import {NgxMaskModule} from "ngx-mask";
import {NgxSpinnerModule} from "ngx-spinner";
import {NgSelectModule} from "@ng-select/ng-select";
import {FlatpickrModule} from "angularx-flatpickr";
import {AuthInterceptor} from "./shared/interceptors/auth.interceptor";
import { VersionInterceptor } from './shared/interceptors/version.interceptor';
import { MdlClienteAplicativoSettingsModalComponent } from './componentes/modals/mdl-cliente-aplicativo-settings-modal/mdl-cliente-aplicativo-settings-modal.component';
import { MdlTipoDePagoModule } from './componentes/modals/mdl-tipo-de-pago/mdl-tipo-de-pago.module';
import { MdlActualizarDatosUserModule } from './componentes/modals/mdl-actualizar-datos-user/mdl-actualizar-datos-user.module';
import { DatosActualizadosInterceptor } from './shared/interceptors/datos-actualizados.interceptor';
import { MdlConfirmarSupervisorModule } from './componentes/modals/mdl-confirmar-supervisor/mdl-confirmar-supervisor.module';
import { MdlEstadoSolicitudSupervisorComponent } from './componentes/modals/mdl-estado-solicitud-supervisor/mdl-estado-solicitud-supervisor.component';

registerLocaleData(es);

@NgModule({
  declarations: [
    AppComponent,
    AdminComponent,
    AuthComponent,
    NavigationComponent,
    NavLogoComponent,
    NavContentComponent,
    NavGroupComponent,
    NavCollapseComponent,
    NavItemComponent,
    NavBarComponent,
    ToggleFullScreenDirective,
    NavLeftComponent,
    NavSearchComponent,
    NavRightComponent,
    ChatUserListComponent,
    FriendComponent,
    ChatMsgComponent,
    ConfigurationComponent,
    HomeComponent,
    NgforReversePipe,
    DisableDirective,
    MdlClienteAplicativoSettingsModalComponent,
    MdlEstadoSolicitudSupervisorComponent,
  ],
  entryComponents: [],
  imports: [
    BrowserAnimationsModule,
    ColorPickerModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    NgbDropdownModule,
    NgbTooltipModule,
    NgbAccordionModule,
    NgbButtonsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    HttpClientModule,
    NgIdleKeepaliveModule.forRoot(),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    NavBarTopModule,
    NgbModule,
    NgxMaskModule.forRoot(),
    FlatpickrModule.forRoot({
      locale: Spanish
    }),
    NgxSpinnerModule,
    NgSelectModule,
    MdlTipoDePagoModule,
    MdlActualizarDatosUserModule,
    MdlConfirmarSupervisorModule
  ],
  exports: [
  ],
  providers: [NavigationItem,
    StatusBar,
    SplashScreen,
    DatePipe,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: HTTP_INTERCEPTORS, useClass: VersionInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: DatosActualizadosInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
