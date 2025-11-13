import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { MarketingService, MapeoUtmSource, MapeoUtmCampaign } from '../../../../app/shared/services/marketing.service';

@Component({
  selector: 'app-mapeo-rrss',
  templateUrl: './mapeo-rrss.component.html',
  styleUrls: ['./mapeo-rrss.component.scss']
})
export class MapeoRrssComponent implements OnInit {
  utmForm: FormGroup;
  generatedUrl: string = '';
  utmSourceOptions: MapeoUtmSource[] = [];
  selectedCampaigns: MapeoUtmCampaign[] = [];
  filteredSourceOptions!: Observable<MapeoUtmSource[]>;
  filteredCampaignOptions!: Observable<MapeoUtmCampaign[]>;
  urlCopied: boolean = false;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private marketingService: MarketingService
  ) {
    this.utmForm = this.fb.group({
      baseUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      utmSource: [''],
      utmSourceInput: [''],
      utmCampaign: [''],
      utmCampaignInput: [''],
      utmMedium: [''],
      utmTerm: [''],
      utmContent: ['']
    });
  }

  ngOnInit(): void {
    // Cargar las fuentes UTM disponibles
    this.loadUtmSources();

    // Configurar filtrado de autocompletado para sources
    this.setupSourceAutocomplete();

    // Configurar filtrado de autocompletado para campañas
    this.setupCampaignAutocomplete();

    // Cuando cambie el utm_source, actualizamos las opciones de utm_campaign
    this.utmForm.get('utmSource')?.valueChanges.subscribe(sourceId => {
      if (sourceId) {
        this.loadUtmCampaigns(sourceId);
      } else {
        this.selectedCampaigns = [];
      }
      this.utmForm.get('utmCampaign')?.setValue('');
      this.utmForm.get('utmCampaignInput')?.setValue('');
      this.generateUrl();
    });

    // Cada vez que cambie el formulario, regenerar URL
    this.utmForm.valueChanges.subscribe(() => {
      this.generateUrl();
    });
  }

  /**
   * Carga las fuentes UTM disponibles desde la API
   */
  loadUtmSources(): void {
    this.isLoading = true;
    this.marketingService.getMapeoUtmSources().subscribe({
      next: (sources) => {
        this.utmSourceOptions = sources;
        this.setupSourceAutocomplete();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las fuentes UTM:', error);
        this.isLoading = false;
      }
    });
  }
  
  /**
   * Configura el filtrado de autocomplete para los sources
   */
  setupSourceAutocomplete(): void {
    // Inicializar el autocomplete con todos los sources
    this.filteredSourceOptions = this.utmForm.get('utmSourceInput')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterSources(name as string) : this.utmSourceOptions.slice();
      })
    );
  }
  
  /**
   * Filtra los sources por nombre para el autocomplete
   */
  private _filterSources(value: string): MapeoUtmSource[] {
    const filterValue = value.toLowerCase();
    return this.utmSourceOptions.filter(source => source.name.toLowerCase().includes(filterValue));
  }

  /**
   * Carga las campañas UTM basadas en el sourceId seleccionado
   * @param sourceId ID de la fuente UTM seleccionada
   */
  loadUtmCampaigns(sourceId: number): void {
    this.isLoading = true;
    this.marketingService.getMapeoUtmCampaignsBySourceId(sourceId).subscribe({
      next: (campaigns) => {
        this.selectedCampaigns = campaigns;
        this.setupCampaignAutocomplete();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar las campañas UTM:', error);
        this.selectedCampaigns = [];
        this.isLoading = false;
      }
    });
  }
  
  /**
   * Configura el filtrado de autocomplete para las campañas
   */
  setupCampaignAutocomplete(): void {
    // Inicializar el autocomplete con las campañas seleccionadas
    this.filteredCampaignOptions = this.utmForm.get('utmCampaignInput')!.valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this._filterCampaigns(name as string) : this.selectedCampaigns.slice();
      })
    );
  }
  
  /**
   * Filtra las campañas por nombre para el autocomplete
   */
  private _filterCampaigns(value: string): MapeoUtmCampaign[] {
    const filterValue = value.toLowerCase();
    return this.selectedCampaigns.filter(campaign => campaign.name.toLowerCase().includes(filterValue));
  }

  generateUrl(): void {
    // Verificamos que al menos tengamos una URL base válida
    const baseUrlControl = this.utmForm.get('baseUrl');
    if (!baseUrlControl || !baseUrlControl.valid) {
      this.generatedUrl = '';
      return;
    }

    const formValues = this.utmForm.value;
    let url = formValues.baseUrl;
    let hasParams = false;

    // Añadir parámetros UTM, solo si existen
    if (formValues.utmSource) {
      // Buscar el nombre de la fuente basado en el ID
      const sourceObj = this.utmSourceOptions.find(s => s.id === parseInt(formValues.utmSource));
      const sourceName = sourceObj ? sourceObj.name : formValues.utmSource;
      
      url += '?utm_source=' + encodeURIComponent(sourceName);
      hasParams = true;
    }
    
    if (formValues.utmCampaign) {
      url += hasParams ? '&' : '?';
      url += 'utm_campaign=' + encodeURIComponent(formValues.utmCampaign);
      hasParams = true;
    }
    
    if (formValues.utmMedium) {
      url += hasParams ? '&' : '?';
      url += 'utm_medium=' + encodeURIComponent(formValues.utmMedium);
      hasParams = true;
    }
    
    if (formValues.utmTerm) {
      url += hasParams ? '&' : '?';
      url += 'utm_term=' + encodeURIComponent(formValues.utmTerm);
      hasParams = true;
    }
    
    if (formValues.utmContent) {
      url += hasParams ? '&' : '?';
      url += 'utm_content=' + encodeURIComponent(formValues.utmContent);
    }

    this.generatedUrl = url;
  }

  copyToClipboard(): void {
    if (this.generatedUrl) {
      navigator.clipboard.writeText(this.generatedUrl).then(() => {
        this.urlCopied = true;
        setTimeout(() => {
          this.urlCopied = false;
        }, 2000);
      });
    }
  }
  
  /**
   * Retorna la clase del icono de Font Awesome según la fuente UTM
   * Nota: Los iconos están ocultos en la vista de badge neutro,
   * pero mantenemos esta función por si se necesita en el futuro
   */
  getSourceIcon(sourceId: number): string {
    // Buscar el nombre de la fuente basado en el ID
    const sourceObj = this.utmSourceOptions.find(s => s.id === sourceId);
    if (!sourceObj) return 'fa-link';
    
    const sourceName = sourceObj.name.toLowerCase();
    const iconMap: {[key: string]: string} = {
      'facebook': 'fa-facebook',
      'instagram': 'fa-instagram',
      'tiktok': 'fa-tiktok',
      'youtube': 'fa-youtube',
      'twitter': 'fa-twitter',
      'email': 'fa-envelope',
      'google': 'fa-google',
      'whatsapp': 'fa-whatsapp'
    };
    
    return iconMap[sourceName] || 'fa-link';
  }
  
  /**
   * Obtiene el nombre de la fuente UTM a partir de su ID
   */
  getSourceName(sourceId: any): string {
    if (!sourceId) return '';
    
    const source = this.utmSourceOptions.find(s => s.id === parseInt(sourceId));
    return source ? source.name : '';
  }
  
  /**
   * Función para mostrar el nombre del source en el autocomplete
   */
  displaySourceFn(source: MapeoUtmSource): string {
    return source && source.name ? source.name : '';
  }
  
  /**
   * Función para mostrar el nombre de la campaña en el autocomplete
   */
  displayCampaignFn(campaign: MapeoUtmCampaign): string {
    return campaign && campaign.name ? campaign.name : '';
  }
  
  /**
   * Maneja la selección de un source en el autocomplete
   */
  onSourceSelected(event: MatAutocompleteSelectedEvent): void {
    const source = event.option.value as MapeoUtmSource;
    this.utmForm.get('utmSource')!.setValue(source.id);
  }
  
  /**
   * Maneja la selección de una campaña en el autocomplete
   */
  onCampaignSelected(event: MatAutocompleteSelectedEvent): void {
    const campaign = event.option.value as MapeoUtmCampaign;
    this.utmForm.get('utmCampaign')!.setValue(campaign.name);
  }
  
  /**
   * Verifica si la URL base es válida
   */
  isUrlBaseValid(): boolean {
    const baseUrlControl = this.utmForm.get('baseUrl');
    return baseUrlControl && baseUrlControl.valid && baseUrlControl.value;
  }
  
  /**
   * Resetea el formulario a su estado inicial
   */
  resetForm(): void {
    this.utmForm.reset();
    this.selectedCampaigns = [];
    this.generatedUrl = '';
    this.urlCopied = false;
    
    // Muestra una animación de "limpiado" 
    const formElement = document.querySelector('.utm-form');
    if (formElement) {
      formElement.classList.add('form-reset-animation');
      setTimeout(() => {
        formElement.classList.remove('form-reset-animation');
      }, 500);
    }
  }
}
