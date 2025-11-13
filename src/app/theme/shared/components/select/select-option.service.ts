import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
// import {IOption} from 'ng-select';
import { environment } from '../../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { PerfilService} from '../../../../shared/services/perfil.service';
@Injectable()

export class SelectOptionService {
//   public static readonly PLAYER_ONE: Array<IOption> = [
//     {value: '0', label: 'Listado Clientes'},
//     {value: '1', label: 'Clientes'},
//     {value: '2', label: 'Firma de Clientes'}
//   ];
//   public static readonly MODULOS: Array<IOption> = [
//     {value: '0', label: 'Clientes'},
//     {value: '1', label: 'Citas'},
//     {value: '2', label: 'Preferentes'}
    
//   ];
//   public static readonly USUARIOS: Array<IOption> = [
//     {value: "0", label: "JOSE"},
//     {value: "1", label: "LUIS"},
//     {value: "2", label: "JESUS"}
//   ];

//   private static readonly COUNTRIES: Array<IOption> = [

//   ];
  constructor(
    private http: HttpClient
) { }


    // getCharacters(): Array<IOption> {
    //     return this.cloneOptions(SelectOptionService.PLAYER_ONE);
    // }
    // getModulos(): Array<IOption> {
    //     return this.cloneOptions(SelectOptionService.MODULOS);
    // }
    // getUsuarios(): Array<IOption> {
    //     return this.cloneOptions(SelectOptionService.USUARIOS);
    // }

    // loadCharacters(): Observable<Array<IOption>> {
    //     return this.loadOptions(SelectOptionService.PLAYER_ONE);
    // }

    // getCharactersWithDisabled(): Array<IOption> {
    //     const characters: Array<IOption> = this.cloneOptions(SelectOptionService.PLAYER_ONE);
    //     characters[1].disabled = true;
    //     characters[4].disabled = true;
    //     return characters;
    // }

    // getCountries(): Array<IOption> {
    //     return this.cloneOptions(SelectOptionService.COUNTRIES);
    // }

    // loadCountries(): Observable<Array<IOption>> {
    //     return this.loadOptions(SelectOptionService.COUNTRIES);
    // }

    // private loadOptions(options: Array<IOption>): Observable<Array<IOption>> {
    //     return new Observable((obs) => {
    //         setTimeout(() => {
    //             obs.next(this.cloneOptions(options));
    //             obs.complete();
    //         }, 5000);
    //     });
    // }

    // private cloneOptions(options: Array<IOption>): Array<IOption> {
    //     return options.map(option => ({ value: option.value, label: option.label }));
    // }
}
