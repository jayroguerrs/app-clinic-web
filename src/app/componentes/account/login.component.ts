import { AfterViewInit, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AlertService } from '../../shared/services/alert.service';
import {AuthService} from "../../shared/services/auth.service";
import {User} from "../../shared/interfaces/usuario";
import {SanitizeService} from "../../shared/services/SanitizeService ";
import { UserSettingsService } from '../../shared/services/user-settings.service';
import { AccountService } from '../../shared/services/account.service';
import { environment } from '../../../environments/environment';
import { IntentosConfirmarSupervisorService } from '../../shared/services/intentos-confirmar-supervisor.service';
import { TimerService } from '../../shared/services/timer.service';
import { sidebar_menu } from '../../theme/shared/sidebar-menu/sidebar-menu';
import { encryptPasswordAES } from '../../shared/services/funciones/data-hash';

@Component({ templateUrl: 'login.component.html', styleUrls: ['./login.component.scss'] })
export class LoginComponent implements OnInit, AfterViewInit {
    captchaToken: string | null = null;

    public version = environment.version;
    public mode = environment.qa ? 'QA' : environment.production ? 'PROD' : 'DEV';
    form: FormGroup;
    loading = false;
    submitted = false;

    failedAttempts = 0;
    isLockedOut = false;
    countdown = 0;

    // Añade esta propiedad a tu clase
    mostrarCaptcha: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private accountService: AccountService,
        private authService: AuthService,
        private alertService: AlertService,
        private userSettingsService: UserSettingsService,
        private intentosConfirmarSupervisorService: IntentosConfirmarSupervisorService,
        private timer: TimerService
    ) { }

    ngOnInit(): void{
        this.form = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        const status$ = this.timer.getStatus('login_failed');
        if (status$) {
            this.startCountdown();
            status$.subscribe(running => {
                this.isLockedOut = running;
                if (!running) this.failedAttempts = 0;
            });
        }

    }

    get f(): any { return this.form.controls; }
    datosUsuario: any;
    async onSubmit(): Promise<void> {
        const attempts = await this.intentosConfirmarSupervisorService.getAttempts('', '123456');
        this.failedAttempts = this.failedAttempts;

        // Solo verificar el captcha si ya se mostró (después de 2 intentos fallidos)
        if (this.mostrarCaptcha && !this.captchaToken) {
            Swal.fire({
            title: 'Verificación requerida',
            text: 'Por favor complete el captcha de seguridad',
            icon: 'warning',
            confirmButtonText: 'Entendido'
            });
            return;
        }

        console.log(`Intentos fallidos: ${this.failedAttempts}`);
        if (this.failedAttempts > 3) {
            this.lockOut();
            return;
        }

        this.submitted = true;
        this.alertService.clear();
        if (this.form.invalid) {
            return;
        }
        this.loading = true;

        let sanitizedUser = SanitizeService.sanitizeInput(this.f.username.value);
        let sanitizedPassword = SanitizeService.sanitizeInput(this.f.password.value);

        const secret = environment.hashKey; 
        const salt = environment.saltBase64; 

        const encryptedUser = await encryptPasswordAES(sanitizedUser, secret, salt);
        const encryptedPassword = await encryptPasswordAES(sanitizedPassword, secret, salt);

        const model = {
            usuario: encryptedUser,
            password: encryptedPassword,
            captchaToken: this.captchaToken
        };

        this.accountService.login(model).subscribe(
            resultado => {
                const result = resultado

                this.datosUsuario = result;
                if (this.datosUsuario.succeeded){
                        const data = this.datosUsuario.result.data;

                        data.menu[0].children = this.modificarNuevoMenu(data.menu[0].children, data.idPerfil);
                    
                        const users = {
                            idUsuario: data.idUsuario,
                            nombre: data.nombre,
                            usuario: data.usuario,
                            perfil: data.perfil,
                            idPerfil: data.idPerfil,
                            genero: data.genero,
                            foto: data.foto,
                            menu: data.menu,
                            idSede: data.idSede,
                            sede: data.sede,
                            token: this.datosUsuario.token,
                            new_menu: data.menuUsuario,
                            datosActualizados: data.datosActualizados,
                            privilegio: data.privilegio,
                            aprobado: data.aprobado,
                            idSupervisor: data.idSupervisor,

                            claveGenerica: data.claveGenerica
                        };

                        const usuario : User = {
                            id: data.idUsuario,
                            name: data.nombre,
                            username: data.usuario,
                            rol: {
                            id: data.idPerfil,
                            name: data.perfil
                            },
                            photo: data.foto,
                            menu: data.menu,
                            sede: {
                            id: data.idSede,
                            name: data.sede
                            },
                            fechaRegistra: new Date(data.fechaRegistra),
                            new_menu: data.menuUsuario,
                            datosActualizados: data.datosActualizados,
                            privilegio: data.privilegio,
                            aprobado: data.aprobado,
                            idSupervisor: data.idSupervisor,

                            claveGenerica: data.claveGenerica
                        };

                        localStorage.setItem('usersKey', JSON.stringify(users));
                        if(data.colorSidebarDeFondo){
                            this.userSettingsService.actualizarColorFondo(data.colorSidebarDeFondo);
                        }

                        if(data.colorSidebarDeTexto){
                            this.userSettingsService.actualizarColorTexto(data.colorSidebarDeTexto);
                        }

                        if(data.imagenDeFondo){
                            this.userSettingsService.actualizarFondoPantalla(data.imagenDeFondo);
                        }
                        
                        Swal.fire({
                            title: `Bienvenid@ ${data.nombre}`,
                            icon: 'success',
                            buttonsStyling: false,
                            timer: 1500,
                            showCancelButton: false,
                            showConfirmButton: false,
                        }).then(async () => {
                            this.authService.login(usuario);
                        });

                }else{
                    // (async () => {
                    //     this.failedAttempts = await this.intentosConfirmarSupervisorService.incrementAttempts('123456');
                    // })();
                    this.failedAttempts++;
     
                    localStorage.clear();
                    Swal.fire('Error al iniciar sesion', "Problemas con el usuario" , 'error');
                    this.loading = false;

                    // this.resetTurnstile();
                }

            },
            error => {
                // (async () => {
                //     this.failedAttempts = await this.intentosConfirmarSupervisorService.incrementAttempts('123456');
                // })();
                this.failedAttempts++;
                
                // Mostrar el captcha después del segundo intento fallido
                if (this.failedAttempts === 3 && !this.mostrarCaptcha) {
                    this.mostrarCaptcha = true;
                    setTimeout(() => this.renderTurnstile(), 100);
                } else if (this.mostrarCaptcha) {
                    // Reset captcha si ya estaba visible
                    this.resetTurnstile();
                }
                // this.resetTurnstile();

                console.log(error.error);
                Swal.fire('Error al iniciar sesion' , 'Problemas con el usuario', 'error');
                this.loading = false;

                if(error?.status === 400){
                    Swal.fire('Error al iniciar sesion', error.error.message , 'error');
                }
                else{
                    Swal.fire('Ocurrio un error con el servidor', error.error.status , 'error');
                }
                this.loading = false;

            },
            () => {
                console.log('The POST observable is now completed.');
            }
        ).add(async () => {

        });
    }

    ngAfterViewInit(){
        // No renderizar captcha automáticamente
        // Verificar si ya hay intentos fallidos previos
        this.intentosConfirmarSupervisorService.getAttempts('', '123456').then(attempts => {
            if (attempts && attempts >= 2) {
            this.mostrarCaptcha = true;
            setTimeout(() => this.renderTurnstile(), 100);
            }
        });
    }

    renderTurnstile() {
        // Asegurarse de que el objeto turnstile esté disponible
        if (typeof (window as any).turnstile !== 'undefined') {
            this.initTurnstile();
        } else {
            // Esperar a que el script se cargue completamente
            const checkInterval = setInterval(() => {
                if (typeof (window as any).turnstile !== 'undefined') {
                    clearInterval(checkInterval);
                    this.initTurnstile();
                }
            }, 100);
            
            // Establecer un tiempo límite por si acaso
            setTimeout(() => clearInterval(checkInterval), 5000);
        }
    }

    initTurnstile() {
        try {
        (window as any).turnstile.render('#turnstile-container', {
            sitekey: '0x4AAAAAAB4MQM9IvaC6ETUB',
            callback: (token: string) => {
                console.log('✅ Captcha verificado:', token);
                this.captchaToken = token;
            },
            'expired-callback': () => {
                this.captchaToken = null;
                console.log('El captcha ha expirado');
            },
            'error-callback': (error: any) => {
                console.error('Error en captcha:', error);
            },
            'language': 'es',
            'theme': 'light',
            'timeout': 10000, // Aumentar timeout a 10 segundos
            'retry': 'auto',  // Auto reintento
            'refresh-expired': 'auto' // Auto actualización
        });
        } catch (error) {
            console.error('Error al inicializar Turnstile:', error);
        }
    }

    private lockOut() {
        this.isLockedOut = true;
        this.timer.start('login_failed', 3 * 60).subscribe(running => {
        this.isLockedOut = running;

        this.intentosConfirmarSupervisorService.resetAttempts();

        if (!running){
            this.failedAttempts = 0;
        } 
        });
        this.startCountdown();
    }

    private startCountdown() {
        const intervalId = setInterval(() => {
        const active = this.timer.getStatus('login_failed');
            if (active) {
                const data = localStorage.getItem('activeTimers');
                if (data) {
                const endTime = JSON.parse(data)['login_failed'];
                if (endTime) {
                    this.countdown = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
                }
                }
            } else {
                clearInterval(intervalId);
                this.countdown = 0;
            }
        }, 1000);
    }

    // Añade esta función a tu clase LoginComponent
    resetTurnstile() {
    // Limpiar el token actual
    this.captchaToken = null;
        try {
            if (typeof (window as any).turnstile !== 'undefined') {
            (window as any).turnstile.reset();
            }
        } catch (error) {
            console.error('Error al resetear captcha:', error);
        }
    }

    modificarNuevoMenu(menu: any[], idPerfil: number): any[] {
        // Filtramos los menús del sidebar que contienen el idPerfil en idPerfilRoles
        const menusFiltrados = sidebar_menu.filter(item => {
            // Verifica si el item o alguno de sus hijos tiene idPerfilRoles que incluya el idPerfil
            const tienePermisoDirecto = Array.isArray((item as any).idPerfilRoles) && (item as any).idPerfilRoles.includes(idPerfil);

            // También revisa los hijos
            const tienePermisoEnHijos = item.children?.some(
            (child: any) => Array.isArray(child.idPerfilRoles) && child.idPerfilRoles.includes(idPerfil)
            );

            return tienePermisoDirecto || tienePermisoEnHijos;
        });

        // Retornamos el menú original con los nuevos agregados
        return [...menu, ...menusFiltrados];
    }
}
