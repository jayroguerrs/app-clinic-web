import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError, Subject, forkJoin } from 'rxjs';
import { catchError, map, tap, debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { filterActiveIdAndTitle } from './funciones/data-cleaner';

/**
 * Interface para UTM Source
 */
export interface UtmSource {
  id?: number;
  titulo: string;
  estado: boolean;
  createdAt?: string;
  updatedAt?: string;
  campaigns?: UtmCampaign[];
}

export interface ShortUtmSource{
  id?: number;
  titulo: string;
}

/**
 * Interface para UTM Source mapeo-rrss
 */
export interface MapeoUtmSource {
  id: number;
  name: string;
}

/**
 * Interface para UTM Campaign mapeo-rrss
 */
export interface MapeoUtmCampaign {
  id: number;
  name: string;
}

/**
 * Interface para UTM Campaign
 */
export interface UtmCampaign {
  id?: number;
  titulo: string;
  estado: boolean;
  fk_id_utm: number;
  createdAt?: string;
  updatedAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MarketingService {
  // URL base para la API
  private apiUrl = `${environment.apiHexagonal}`;
  
  // Endpoint para UTM Sources
  private utmSourcesUrl = `${this.apiUrl}/utm-sources`;
  
  // Endpoint para UTM Campaigns
  private utmCampaignsUrl = `${this.apiUrl}/utm-campaigns`;
  
  // Subject para controlar el debounce de la búsqueda de campañas
  private campaignSearchSubject = new Subject<string>();
  
  // Observable para exponer el resultado de la búsqueda de campañas
  public campaignSearchResults$: Observable<UtmCampaign[]>;
  
  // Subject para controlar el debounce de la búsqueda de sources
  private sourceSearchSubject = new Subject<string>();
  
  // Observable para exponer el resultado de la búsqueda de sources
  public sourceSearchResults$: Observable<UtmSource[]>;
  
  // Almacenamiento en caché para sources
  private cachedSources: UtmSource[] = [];
  private hasCachedSources = false;
  
  // Almacenamiento en caché para campañas
  private cachedCampaigns: UtmCampaign[] = [];
  private hasCachedCampaigns = false;
  
  constructor(private http: HttpClient) { 
    // Configuración del debounce para las búsquedas de campañas (500ms)
    this.campaignSearchResults$ = this.campaignSearchSubject.pipe(
      debounceTime(500), // Esperar 500ms después de la última entrada
      distinctUntilChanged(), // Solo emitir si el valor ha cambiado
      map(term => this.filterCachedCampaigns(term))
    );
    
    // Configuración del debounce para las búsquedas de sources (500ms)
    this.sourceSearchResults$ = this.sourceSearchSubject.pipe(
      debounceTime(500), // Esperar 500ms después de la última entrada
      distinctUntilChanged(), // Solo emitir si el valor ha cambiado
      map(term => this.filterCachedSources(term))
    );
  }

  // ---------------------- UTM Sources Methods ----------------------

  /**
   * Obtiene todas las fuentes UTM
   */
  getUtmSources(): Observable<UtmSource[]> {
    // Si ya tenemos los datos en caché, devolverlos directamente
    if (this.hasCachedSources) {
      return of(this.cachedSources);
    }
    
    // Si no, hacer la petición y guardar en caché
    return this.http.get<UtmSource[]>(this.utmSourcesUrl)
      .pipe(
        tap(sources => {
          this.cachedSources = sources;
          this.hasCachedSources = true;
        }),
        catchError(this.handleError<UtmSource[]>('getUtmSources', []))
      );
  }

  getShortUtmSources(): Observable<ShortUtmSource[]> {
    return this.http.get<UtmSource[]>(this.utmSourcesUrl)
      .pipe(
        map(response => filterActiveIdAndTitle(response))
      );
  }

  /**
   * Obtiene una fuente UTM por ID
   * @param id ID de la fuente UTM
   */
  getUtmSourceById(id: number): Observable<UtmSource> {
    const url = `${this.utmSourcesUrl}/${id}`;
    return this.http.get<UtmSource>(url)
      .pipe(
        tap(source => console.log(`Fuente UTM obtenida con id=${id}`)),
        catchError(this.handleError<UtmSource>(`getUtmSourceById id=${id}`))
      );
  }

  /**
   * Crea una nueva fuente UTM
   * @param source Fuente UTM a crear
   */
  createUtmSource(source: UtmSource): Observable<UtmSource> {
    return this.http.post<UtmSource>(this.utmSourcesUrl, source)
      .pipe(
        tap(newSource => {
          console.log('Fuente UTM creada:', newSource);
          // Actualizar caché
          if (this.hasCachedSources) {
            this.cachedSources = [...this.cachedSources, newSource];
          }
        }),
        catchError(this.handleError<UtmSource>('createUtmSource'))
      );
  }

  /**
   * Actualiza una fuente UTM existente
   * @param id ID de la fuente UTM a actualizar
   * @param source Datos actualizados de la fuente UTM
   */
  updateUtmSource(id: number, source: Partial<UtmSource>): Observable<UtmSource> {
    const url = `${this.utmSourcesUrl}/${id}`;
    return this.http.put<UtmSource>(url, source)
      .pipe(
        tap(updatedSource => {
          console.log(`Fuente UTM actualizada con id=${id}`);
          // Actualizar caché
          if (this.hasCachedSources) {
            const index = this.cachedSources.findIndex(s => s.id === id);
            if (index !== -1) {
              this.cachedSources = [
                ...this.cachedSources.slice(0, index),
                updatedSource,
                ...this.cachedSources.slice(index + 1)
              ];
            }
          }
        }),
        catchError(this.handleError<UtmSource>(`updateUtmSource id=${id}`))
      );
  }

  /**
   * Busca fuentes UTM por término de búsqueda
   * @param searchTerm Término de búsqueda
   */
  searchUtmSources(searchTerm: string): Observable<UtmSource[]> {
    if (!searchTerm.trim()) {
      return this.getUtmSources();
    }
    
    // Nota: Si el backend no soporta búsqueda, podemos filtrar en el cliente
    return this.getUtmSources().pipe(
      map(sources => sources.filter(source => 
        source.titulo.toLowerCase().includes(searchTerm.toLowerCase())
      ))
    );
  }

  // ---------------------- UTM Campaigns Methods ----------------------

  /**
   * Obtiene todas las campañas UTM
   */
  getUtmCampaigns(): Observable<UtmCampaign[]> {
    // Si ya tenemos los datos en caché, devolverlos directamente
    if (this.hasCachedCampaigns) {
      return of(this.cachedCampaigns);
    }
    
    // Si no, hacer la petición y guardar en caché
    return this.http.get<UtmCampaign[]>(this.utmCampaignsUrl)
      .pipe(
        tap(campaigns => {
          console.log('Campañas UTM obtenidas:', campaigns.length);
          this.cachedCampaigns = campaigns;
          this.hasCachedCampaigns = true;
          
          // También aseguramos tener los sources cargados para el filtrado combinado
          if (!this.hasCachedSources) {
            this.getUtmSources().subscribe();
          }
        }),
        catchError(this.handleError<UtmCampaign[]>('getUtmCampaigns', []))
      );
  }

  /**
   * Obtiene una campaña UTM por ID
   * @param id ID de la campaña UTM
   */
  getUtmCampaignById(id: number): Observable<UtmCampaign> {
    const url = `${this.utmCampaignsUrl}/${id}`;
    return this.http.get<UtmCampaign>(url)
      .pipe(
        tap(campaign => console.log(`Campaña UTM obtenida con id=${id}`)),
        catchError(this.handleError<UtmCampaign>(`getUtmCampaignById id=${id}`))
      );
  }

  /**
   * Obtiene campañas UTM por ID de fuente UTM
   * @param utmId ID de la fuente UTM
   */
  getUtmCampaignsByUtmId(utmId: number): Observable<UtmCampaign[]> {
    const url = `${this.utmCampaignsUrl}/by-utm/${utmId}`;
    return this.http.get<UtmCampaign[]>(url)
      .pipe(
        tap(campaigns => console.log(`Campañas UTM obtenidas para la fuente utmId=${utmId}`)),
        catchError(this.handleError<UtmCampaign[]>(`getUtmCampaignsByUtmId utmId=${utmId}`, []))
      );
  }

  /**
   * Crea una nueva campaña UTM
   * @param campaign Campaña UTM a crear
   */
  createUtmCampaign(campaign: UtmCampaign): Observable<UtmCampaign> {
    return this.http.post<UtmCampaign>(this.utmCampaignsUrl, campaign)
      .pipe(
        tap(newCampaign => {
          console.log('Campaña UTM creada:', newCampaign);
          // Actualizar caché
          if (this.hasCachedCampaigns) {
            this.cachedCampaigns = [...this.cachedCampaigns, newCampaign];
          }
        }),
        catchError(this.handleError<UtmCampaign>('createUtmCampaign'))
      );
  }

  /**
   * Actualiza una campaña UTM existente
   * @param id ID de la campaña UTM a actualizar
   * @param campaign Datos actualizados de la campaña UTM
   */
  updateUtmCampaign(id: number, campaign: Partial<UtmCampaign>): Observable<UtmCampaign> {
    const url = `${this.utmCampaignsUrl}/${id}`;
    return this.http.put<UtmCampaign>(url, campaign)
      .pipe(
        tap(updatedCampaign => {
          console.log(`Campaña UTM actualizada con id=${id}`);
          // Actualizar caché
          if (this.hasCachedCampaigns) {
            const index = this.cachedCampaigns.findIndex(c => c.id === id);
            if (index !== -1) {
              this.cachedCampaigns = [
                ...this.cachedCampaigns.slice(0, index),
                updatedCampaign,
                ...this.cachedCampaigns.slice(index + 1)
              ];
            }
          }
        }),
        catchError(this.handleError<UtmCampaign>(`updateUtmCampaign id=${id}`))
      );
  }

  /**
   * Busca campañas UTM por término de búsqueda
   * @param searchTerm Término de búsqueda
   */
  searchUtmCampaigns(searchTerm: string): Observable<UtmCampaign[]> {
    if (!searchTerm.trim()) {
      return this.getUtmCampaigns();
    }
    
    // Usa forkJoin para buscar en campañas y sources simultáneamente
    return forkJoin([
      this.getUtmCampaigns(),
      this.getUtmSources()
    ]).pipe(
      map(([campaigns, sources]) => {
        return campaigns.filter(campaign => {
          // Buscar el source correspondiente
          const source = sources.find(s => s.id === campaign.fk_id_utm);
          const sourceName = source ? source.titulo.toLowerCase() : '';
          
          // Filtrar por título de campaña o por nombre de source
          return campaign.titulo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                 sourceName.includes(searchTerm.toLowerCase());
        });
      })
    );
  }

  // ---------------------- Mapeo RRSS Methods ----------------------
  
  /**
   * Obtiene todas las fuentes UTM en formato para el componente mapeo-rrss
   */
  getMapeoUtmSources(): Observable<MapeoUtmSource[]> {
    return this.http.get<UtmSource[]>(this.utmSourcesUrl)
      .pipe(
        map(sources => sources
          .filter(source => source.estado) // Solo fuentes activas
          .map(source => ({
            id: source.id!,
            name: source.titulo
          }))
        ),
        catchError(this.handleError<MapeoUtmSource[]>('getMapeoUtmSources', []))
      );
  }
  
  /**
   * Obtiene las campañas UTM por ID de fuente para el componente mapeo-rrss
   * @param sourceId ID de la fuente UTM
   */
  getMapeoUtmCampaignsBySourceId(sourceId: number): Observable<MapeoUtmCampaign[]> {
    return this.getUtmCampaignsByUtmId(sourceId).pipe(
      map(campaigns => campaigns
        .filter(campaign => campaign.estado) // Solo campañas activas
        .map(campaign => ({
          id: campaign.id!,
          name: campaign.titulo
        }))
      ),
      catchError(this.handleError<MapeoUtmCampaign[]>(`getMapeoUtmCampaignsBySourceId sourceId=${sourceId}`, []))
    );
  }

  /**
   * Filtra campañas de la caché local
   * @param searchTerm Término de búsqueda
   */
  private filterCachedCampaigns(searchTerm: string): UtmCampaign[] {
    if (!searchTerm.trim() || this.cachedCampaigns.length === 0) {
      return this.cachedCampaigns;
    }
    
    const term = searchTerm.toLowerCase();
    
    return this.cachedCampaigns.filter(campaign => {
      // Buscar el source correspondiente
      const source = this.cachedSources.find(s => s.id === campaign.fk_id_utm);
      const sourceName = source ? source.titulo.toLowerCase() : '';
      
      // Filtrar por título de campaña o por nombre de source
      return campaign.titulo.toLowerCase().includes(term) || 
             sourceName.includes(term);
    });
  }
  
  /**
   * Filtra sources de la caché local
   * @param searchTerm Término de búsqueda
   */
  private filterCachedSources(searchTerm: string): UtmSource[] {
    if (!searchTerm.trim() || this.cachedSources.length === 0) {
      return this.cachedSources;
    }
    
    const term = searchTerm.toLowerCase();
    
    return this.cachedSources.filter(source => 
      source.titulo.toLowerCase().includes(term)
    );
  }
  
  /**
   * Busca campañas UTM con debounce usando la caché local
   * @param searchTerm Término de búsqueda
   */
  searchCampaignsWithDebounce(searchTerm: string): void {
    // Asegurar que tengamos datos cargados primero
    if (!this.hasCachedCampaigns) {
      this.getUtmCampaigns().subscribe(campaigns => {
        this.cachedCampaigns = campaigns;
        this.hasCachedCampaigns = true;
        this.campaignSearchSubject.next(searchTerm);
      });
    } else {
      this.campaignSearchSubject.next(searchTerm);
    }
  }
  
  /**
   * Busca sources UTM con debounce usando la caché local
   * @param searchTerm Término de búsqueda
   */
  searchSourcesWithDebounce(searchTerm: string): void {
    // Asegurar que tengamos datos cargados primero
    if (!this.hasCachedSources) {
      this.getUtmSources().subscribe(sources => {
        this.cachedSources = sources;
        this.hasCachedSources = true;
        this.sourceSearchSubject.next(searchTerm);
      });
    } else {
      this.sourceSearchSubject.next(searchTerm);
    }
  }
  
  /**
   * Limpia la caché de sources y campañas
   * Útil cuando necesitamos forzar una recarga de los datos
   */
  refreshCache(): void {
    this.cachedSources = [];
    this.hasCachedSources = false;
    this.cachedCampaigns = [];
    this.hasCachedCampaigns = false;
  }
  
  /**
   * Manejador de errores para operaciones HTTP
   * @param operation Nombre de la operación que falló
   * @param result Valor opcional a devolver como observable
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`${operation} error:`, error);
      
      // Enviar el error a un servicio de registro remoto
      // this.logService.error(`${operation} failed: ${error.message}`);
      
      // Devolver un resultado vacío o predeterminado para que la app siga funcionando
      return of(result as T);
    };
  }
}
