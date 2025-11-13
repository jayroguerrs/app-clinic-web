# Eros Frontend (Angular 10) - Docker Build Guide

Este proyecto se compila con Node 14 y sirve el build con Nginx.

## Requisitos
- Docker Desktop (Windows)
- Acceso a Azure Container Registry (ACR)
- No necesitas Node ni Angular CLI en la máquina host

## Configuraciones Disponibles

### QA Environment
- API: `https://back-sheronx.agreeablerock-452a0002.eastus.azurecontainerapps.io`
- Frontend: `https://qa-clinic.depilzone.net`
- Background: `#f4f7fa` (gris claro)
- Logo: `bg-logo_qa.png`

### Production Environment
- API: URL de producción
- Background: `#225f9c` (azul)
- Logo: `bg-logo_prod.png`

## Build y Deploy - QA

### 1. Crear Contenedor QA
```bash
docker build --no-cache --build-arg BUILD_CONFIG=qa -t clialphav.azurecr.io/clinic:qa .
```

### 2. Probar Localmente
```bash
docker run -d -p 3002:80 --name clinic-qa-test clialphav.azurecr.io/clinic:qa
```
- Abre: `http://localhost:3002`
- **Importante**: Usa modo incógnito o `Ctrl + Shift + R` para evitar cache

### 3. Verificar Logs
```bash
docker logs -f clinic-qa-test
```

### 4. Push a Azure Container Registry
```bash
docker push clialphav.azurecr.io/clinic:qa
```

### 5. Limpiar Después de Probar
```bash
docker stop clinic-qa-test && docker rm clinic-qa-test
```

## Build y Deploy - Production

### 1. Crear Contenedor Production
```bash
docker build --no-cache --build-arg BUILD_CONFIG=production -t clialphav.azurecr.io/clinic:prod .
```
### 1.2 Crear Contenedor QA
```bash
sudo docker build --no-cache --build-arg BUILD_CONFIG=qa -t depilzoneyy/clinic-qa:3.1.1 .
docker push depilzoneyy/clinic-qa:3.1.1
```

### 2. Probar Localmente
```bash
docker run -d -p 3003:80 --name clinic-prod-test clialphav.azurecr.io/clinic:prod
```

### 3. Push a ACR
```bash
docker push clialphav.azurecr.io/clinic:prod
```

## Comandos Útiles

### Ver Contenedores Activos
```bash
docker ps
```

### Ver Imágenes
```bash
docker images | grep clinic
```

### Limpiar Cache de Docker
```bash
docker builder prune -f
```

### Detener Todos los Contenedores Clinic
```bash
docker stop $(docker ps -q --filter ancestor=clialphav.azurecr.io/clinic:qa)
docker stop $(docker ps -q --filter ancestor=clialphav.azurecr.io/clinic:prod)
```

## Verificación de Environment

### Indicadores QA Correctos:
- ✅ Background gris claro (`#f4f7fa`)
- ✅ Logo QA visible
- ✅ API calls a `qa.depilzone.com.pe:5036`
- ✅ Version: `2.3.2`

### Indicadores Production Correctos:
- ✅ Background azul (`#225f9c`)
- ✅ Logo production
- ✅ API calls a endpoints de producción
- ✅ `production: true`

## Troubleshooting

### La aplicación no refleja cambios
1. Usar `--no-cache` en el build
2. Limpiar cache del navegador (`Ctrl + Shift + R`)
3. Verificar que usaste el `BUILD_CONFIG` correcto

### Error de puerto ocupado
```bash
# Ver qué está usando el puerto
docker ps

# Detener contenedor que ocupa el puerto
docker stop [CONTAINER_NAME]
```

### Verificar configuración dentro del contenedor
```bash
# Ver archivos compilados
docker exec -it clinic-qa-test ls -la /usr/share/nginx/html

# Buscar configuración en el bundle
docker exec -it clinic-qa-test cat /usr/share/nginx/html/main.*.js | grep -i "qa.depilzone"
```

## Notas Importantes
- **Multi-stage build**: Node 14 para compilar + Nginx Alpine para servir
- **Configuraciones**: Se inyectan en tiempo de compilación vía `fileReplacements`
- **Service Worker**: Activo en production, limpia cache si no ves cambios
- **CORS**: Asegúrate de que el backend permita requests desde el frontend

## Estructura del Proyecto
```
├── dockerfile                 # Multi-stage build
├── nginx.conf                # Configuración Nginx para SPA
├── src/environments/
│   ├── environment.ts        # Development
│   ├── environment.qa.ts     # QA
│   └── environment.prod.ts   # Production
└── angular.json              # Configuraciones de build
```

---

## Development (Local)

### Servidor de desarrollo
```bash
ng serve
```
Navega a `http://localhost:4200/`

### Build local
```bash
# Development
ng build

# QA
ng build --configuration=qa

# Production
ng build --configuration=production
```

### Tests
```bash
# Unit tests
ng test

# E2E tests
ng e2e
```

### Generar componentes
```bash
# Módulo con routing
ng generate module componentes/proforma --routing

# Componente
ng generate component componentes/proforma/proforma
```

## Angular Info
- **Angular CLI**: 10.0.8
- **Node**: 14.21.3
- **Nginx**: 1.24-alpine


# NgDattaAble

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.1.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## DOC

´´´bash
# Generate a module
ng generate module componentes/proforma --routing
# Generate a Component
ng generate component componentes/proforma/proforma

´´´


## Angular 
Angular CLI: 10.0.8
Node: 14.21.3

# Eros Frontend (Angular 10) - Docker

Este proyecto se compila con Node 14 y sirve el build con Nginx.

## Requisitos
- Docker Desktop (Windows)
- No necesitas Node ni Angular CLI en la máquina host

## Build
En la raíz del proyecto:
```powershell
0. docker builder prune -f

docker build -t eros-frontend:10 .
```

## Run
Publica el contenedor en el puerto 8080:
```powershell
docker run -d -p 8080:80 --name eros eros-frontend:10
```
Abre: http://localhost:8080

Para ver logs:
```powershell
docker logs -f eros
```

Para detener y eliminar:
```powershell
docker stop eros
docker rm eros
```

## Notas importantes
- Compilación en producción: el Dockerfile fuerza `--configuration production` y `--output-path=dist/clinic`, así evitamos la ruta absoluta configurada en angular.json.
- Service Worker: en producción (`environment.production=true`) se activa el PWA. Si no ves cambios tras desplegar, limpia el cache del navegador o incrementa `environment.version`.
- Endpoints backend desde contenedor: si tu `environment.apiUrl` apunta a `https://localhost:44361`, desde el contenedor “localhost” es el contenedor mismo. Usa `host.docker.internal` para llegar al host:
  - Ejemplo: `https://host.docker.internal:44361`
- Variables de entorno: este build inyecta los `environment.*` en tiempo de compilación. Cambiar endpoints requiere recompilar la imagen.

## Estructura
- Dockerfile: multi-stage (build Node 14 + runtime Nginx)
- nginx.conf: fallback a `index.html` para SPA
- .dockerignore: reduce el contexto de build

## Troubleshooting
- La imagen no construye: verifica conexión a npm y que `npm ci` o `npm install` completen.
- Ruta de copia del build: si cambiaste `--output-path`, ajusta la línea `COPY --from=build /app/dist/clinic /usr/share/nginx/html`.
- Certificados HTTPS backend locales: si usas `https` contra el host, asegúrate de que el backend permita CORS y que el certificado sea confiable desde el navegador.

