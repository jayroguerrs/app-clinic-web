export interface OCategorias {
    codResponse: number;
    message: string;
    data: oDatos[];
  }

  export interface oDatos {
    id: string;
    title: oTitle;
    ordering: number;
    resource_imagen: string;
    imagen_url: string;
  }

  export interface oTitle {
    translations: oTranslations;
  }

  export interface oTranslations {
    en_us: string;
    es_es: string;
  }
