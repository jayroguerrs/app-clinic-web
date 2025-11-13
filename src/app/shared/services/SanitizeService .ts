export class SanitizeService {
    static sanitizeInput(input: any): any {
      if (typeof input === 'string') {
        return input
          .replace(/\\/g, '\\\\')   // Escapar barra invertida
          .replace(/'/g, "\\'")     // Escapar comillas simples
          .replace(/"/g, '\\"')     // Escapar comillas dobles
          .replace(/--/g, '')       // Eliminar doble guion (evita comentarios SQL)
          .replace(/;/g, '')        // Eliminar punto y coma (evita terminación de consultas)
          .replace(/</g, '&lt;')    // Evita inyección de HTML
          .replace(/>/g, '&gt;')    // Evita inyección de HTML
          .replace(/#/g, '');       // Evita comentarios SQL y XSS
      } else if (typeof input === 'object' && input !== null) {
        Object.keys(input).forEach(key => {
          input[key] = SanitizeService.sanitizeInput(input[key]);
        });
      }
      return input;
    }
  }
  