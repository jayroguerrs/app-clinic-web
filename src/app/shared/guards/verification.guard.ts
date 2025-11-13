import { Injectable } from '@angular/core';
import {
  CanActivate,
  CanActivateChild,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { paths } from '../../../commons/routes';
import { UsuarioService, IGetPrivilegio } from '../services/usuario.service';
import { Observable, of } from 'rxjs';
import { map, catchError, first, shareReplay } from 'rxjs/operators';

const path = paths;

@Injectable({ providedIn: 'root' })
export class VerificationGuard implements CanActivate, CanActivateChild {
  private privilegioCache: { [userId: number]: boolean } = {};

  constructor(private router: Router, private usuarioService: UsuarioService) {}

  private getUserId(): number | null {
    // Intentar primero desde el servicio
    let userId = this.usuarioService.UsuarioActual?.idUsuario;
    if (userId) return userId;

    // Luego intentar desde el localStorage
    try {
      const userKeyStr = localStorage.getItem('usersKey');
      if (userKeyStr) {
        const userKey = JSON.parse(userKeyStr);
        userId = userKey?.idUsuario;
      }
    } catch (_) {}
    return userId || null;
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    const isUnauthorizedRoute = state.url.startsWith('/' + path.unauthorized.origin);
    if (isUnauthorizedRoute) return of(true);

    const userId = this.getUserId();
    if (!userId) {
      return of(this.router.createUrlTree(['/account']));
    }

    // Cache rápido para no repetir llamadas
    if (this.privilegioCache[userId] !== undefined) {
      return of(this.privilegioCache[userId]);
    }

    return this.usuarioService.obtenerPrivilegioUsuario(userId).pipe(
      first(),
      map((privilegio: IGetPrivilegio) => {
        const isAuthorized = privilegio.estadoAprobacion === 1;
        this.privilegioCache[userId] = isAuthorized;

        if (!isAuthorized) {
          return this.router.createUrlTree([
            path.unauthorized.origin,
            path.unauthorized.userVerification,
          ]);
        }

        return true;
      }),
      catchError((error) => {
        console.error('VerificationGuard error:', error);
        return of(
          this.router.createUrlTree([
            path.unauthorized.origin,
            path.unauthorized.userVerification,
          ])
        );
      }),
      shareReplay(1) // evita múltiples subscripciones duplicadas
    );
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.canActivate(childRoute, state);
  }
}
