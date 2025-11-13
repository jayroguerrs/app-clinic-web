# Copilot Instructions for `frontend-beta`

## Project Overview
This project is an Angular 10 application designed for managing clinic operations. It uses Docker for deployment and serves the frontend with Nginx. The application integrates with various APIs and services, and supports multiple environments (QA and Production).

### Key Directories
- **`src/app/componentes`**: Contains modular components for the application, such as `modals`, `tables`, and `widgets`.
- **`src/app/shared`**: Includes shared services, models, and utility functions.
- **`src/assets`**: Stores static assets like images, fonts, and mock data.
- **`src/environments`**: Environment-specific configurations.

### Build and Deployment
- **Build Command**:
  ```bash
  docker build --no-cache --build-arg BUILD_CONFIG=<env> -t <image-name> .
  ```
  Replace `<env>` with `qa` or `prod`.
- **Run Locally**:
  ```bash
  docker run -d -p 3002:80 --name <container-name> <image-name>
  ```
- **Push to Azure Container Registry**:
  ```bash
  docker push <image-name>
  ```

## Development Guidelines

### Code Conventions
- Follow Angular best practices for component-based architecture.
- Use `Reactive Forms` for form handling.
- Use `TypeScript` for strict typing and maintainability.
- Place shared logic in `src/app/shared`.

### Component Patterns
- **Modular Components**: Components are organized by feature in `src/app/componentes`.
- **Shared Components**: Reusable components like `autocomplete-select` are in `src/app/shared/components`.
- **Styling**: Use SCSS for styles. Shared styles are in `src/scss`.

### Example: Autocomplete Component
The `autocomplete-select` component is a reusable, configurable component for dropdowns with search functionality.

#### Usage:
```html
<app-autocomplete-select
  [options]="opciones"
  [config]="{
    placeholder: 'Seleccionar usuario...',
    label: 'Usuario',
    searchable: true
  }"
  (selectionChange)="onUsuarioSelected($event)">
</app-autocomplete-select>
```

#### Configuration:
- `options`: Array of options to display.
- `config`: Object for customizing placeholder, label, and search behavior.
- `selectionChange`: Event emitted on selection.

## Testing
- **Unit Tests**: Use `Karma` and `Jasmine`.
- **E2E Tests**: Use `Protractor`. Configuration is in `e2e/protractor.conf.js`.

## External Dependencies
- **`ngx-spinner`**: For loading indicators.
- **`ng-bootstrap`**: For Bootstrap components.
- **`@angular/router`**: For routing.

## Debugging Tips
- Use `console.log` for quick debugging.
- Check API responses in `src/api.response.json`.
- Use browser developer tools for inspecting elements and network requests.

## Contribution Workflow
1. Create a new branch for your feature or bugfix.
2. Write clean, modular code and follow the conventions above.
3. Test your changes locally.
4. Submit a pull request for review.

---

For more details, refer to the [README.md](../README.md).