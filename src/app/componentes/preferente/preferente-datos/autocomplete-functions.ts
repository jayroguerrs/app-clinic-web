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
    this.filteredSourceOptions = this.frmPreferenteDatos.get('utmSourceInput')!.valueChanges.pipe(
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
    this.filteredCampaignOptions = this.frmPreferenteDatos.get('utmCampaignInput')!.valueChanges.pipe(
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
    this.frmPreferenteDatos.get('utmSource')!.setValue(source.id);
  }
  
  /**
   * Maneja la selección de una campaña en el autocomplete
   */
  onCampaignSelected(event: MatAutocompleteSelectedEvent): void {
    const campaign = event.option.value as MapeoUtmCampaign;
    this.frmPreferenteDatos.get('utmCampaign')!.setValue(campaign.name);
  }