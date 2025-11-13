import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class NestjsUploadFilesService {
  private apiHexaUrl: string = environment.apiHexagonal;
  private urlUploadFiles: string = `${this.apiHexaUrl}/docs/send`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = sessionStorage.getItem('access_token') || '';
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': 'Sat, 21 May 2000 00:00:00 GMT',
    });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Algo salió mal. Intenta más tarde.'));
  }

  async sendDocumentFile(data: ISendDocument): Promise<any> {
    try {
      return await this.http
        .post<any>(this.urlUploadFiles, data, { headers: this.getAuthHeaders() })
        .toPromise();
    } catch (error) {
      this.handleError(error as HttpErrorResponse);
      throw error;
    }
  }

  uploadImage(data: FormData): Observable<any> {
    try {
      return this.http.post<any>(`${this.apiHexaUrl}/appointment/images/upload`, data, { headers: this.getAuthHeaders() });
    } catch (error) {
      this.handleError(error as HttpErrorResponse);
      throw error;
    }
  }

  saveImageParametrosGroup(data: ImageParametros): Observable<any>{
    try {
      return this.http.post<any>(`${this.apiHexaUrl}/appointment/images/save`, data, { headers: this.getAuthHeaders() });
    } catch (error) {
      this.handleError(error as HttpErrorResponse);
      throw error;
    }
  }

  getImageParametros(customerId: number, serviceId: number, zoneId: number, session: number): Observable<any>{
    try {
      return this.http.get<any>(`${this.apiHexaUrl}/appointment/images/${customerId}/${serviceId}/${zoneId}/${session}`, { headers: this.getAuthHeaders() });
    } catch (error) {
      this.handleError(error as HttpErrorResponse);
      throw error;
    }
  }

  deleteImageParametro(idImg: string): Observable<any>{
    try {
      return this.http.delete<any>(`${this.apiHexaUrl}/appointment/images/${idImg}`, { headers: this.getAuthHeaders() });
    } catch (error) {
      this.handleError(error as HttpErrorResponse);
      throw error;
    }
  }
}

export interface ISendDocument {
  documentosRenderizados: DocumentosRenderizado[];
  id_resumen_contratos: number;
  idEstado: number;
  idCliente: number;
  correo_cliente: string;
  type_document: ETypeDocument;
}

export interface DocumentosRenderizado {
  id_contrato: number;
  titulo: string;
  contenidoBase64?: string;
  parametros?: any;
}

export enum ETypeDocument {
  General = "general_document",
  Contract = "contract_document"
}

export interface ImageParametros {
  customerId: number;
  serviceId: number;
  zoneId: number;
  images: string[];
  session: number;
}