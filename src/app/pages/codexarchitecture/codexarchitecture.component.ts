import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES } from '../../shared/primeng.imports';

interface ArchitectureBlock {
  title: string;
  category: string;
  important?: boolean;
  description: string;
  example: string;
}

@Component({
  selector: 'app-codexarchitecture',
  imports: [CommonModule, PRIMENG_MODULES],
  templateUrl: './codexarchitecture.component.html',
  styleUrl: './codexarchitecture.component.scss',
})
export class CodexarchitectureComponent {
  readonly selectedCategory = signal('Todas');

  readonly principles = [
    'La arquitectura debe hacer facil cambiar una feature sin tocar medio proyecto.',
    'Las dependencias deben ir de lo especifico hacia lo reutilizable, no al reves.',
    'El dominio debe vivir cerca de sus pantallas, servicios, modelos y pruebas.',
    'Shared no debe convertirse en un cajon desastre.',
    'Una buena estructura debe poder explicarse a alguien nuevo en cinco minutos.',
  ];

  readonly blocks: ArchitectureBlock[] = [
    {
      title: 'Organiza por dominio',
      category: 'Estructura',
      important: true,
      description:
        'Prefiere carpetas por area funcional antes que carpetas gigantes por tipo tecnico. Si trabajas en productos, deberias encontrar pagina, componentes, servicios, modelos y pruebas de productos en una zona cercana. Esto reduce saltos mentales y hace que borrar, mover o evolucionar una feature sea mucho menos arriesgado.',
      example: `src/app/features/products/
  pages/products-page/
  components/product-card/
  components/product-filters/
  services/products-api.service.ts
  models/product.model.ts`,
    },
    {
      title: 'Core para infraestructura',
      category: 'Capas',
      description:
        'Core guarda piezas singleton y transversales: autenticacion, interceptores, guards, configuracion, logging o servicios de sesion. No deberia contener componentes visuales de negocio. Si core empieza a conocer productos, facturas o pantallas concretas, deja de ser infraestructura y empieza a acoplar toda la app.',
      example: `src/app/core/
  auth/auth.service.ts
  interceptors/auth.interceptor.ts
  guards/auth.guard.ts
  config/app-config.ts`,
    },
    {
      title: 'Shared para UI reutilizable',
      category: 'Capas',
      description:
        'Shared debe tener componentes, pipes y directivas reutilizables sin dependencia de una feature concreta. Si un componente shared conoce ProductsService, probablemente no es shared. La pregunta util es: podria usar esta pieza en otra feature sin traer reglas de negocio detras?',
      example: `src/app/shared/ui/
  empty-state/
  confirm-dialog/
  page-header/

src/app/shared/pipes/
  money.pipe.ts`,
    },
    {
      title: 'Reglas de dependencia',
      category: 'Dependencias',
      important: true,
      description:
        'Una regla simple mantiene el proyecto sano: features pueden usar shared y core; shared no conoce features; core no depende de pantallas. Asi evitas ciclos y acoplamientos invisibles. Cuando esta direccion se rompe, los cambios pequenos empiezan a tener efectos colaterales en zonas que no deberian enterarse.',
      example: `features/products -> shared/ui
features/products -> core/auth
shared/ui -> Angular/PrimeNG
core/auth -> HttpClient
shared/ui -X-> features/products`,
    },
    {
      title: 'Facades para pantallas complejas',
      category: 'Estado',
      important: true,
      description:
        'Una facade coordina servicios, estado, filtros y acciones. La pagina consume una API limpia y no necesita saber si debajo hay signals, RxJS, NgRx o cache. Es especialmente util cuando una pantalla empieza a tener varias cargas, permisos, acciones de usuario y estados de error relacionados.',
      example: `export class ProductsFacade {
  readonly products = signal<ProductVm[]>([]);
  readonly loading = signal(false);

  load(): void {
    // coordina API, estado y errores
  }
}`,
    },
    {
      title: 'DTO, dominio y view model',
      category: 'Datos',
      important: true,
      description:
        'No dejes que el contrato del backend domine tu template. Convierte DTOs a modelos que la UI entienda: nombres claros, campos opcionales resueltos y valores formateados cuando proceda. Esto crea una frontera sana: el backend puede cambiar nombres o estructura y tu UI solo ajusta el mapper.',
      example: `interface ProductDto {
  product_name: string;
  price_cents: number;
}

interface ProductVm {
  title: string;
  priceLabel: string;
}`,
    },
    {
      title: 'Lazy loading por feature',
      category: 'Rendimiento',
      description:
        'Cada seccion importante deberia cargarse cuando se necesita. Esto mejora el arranque y fuerza limites claros entre areas. Lazy loading tambien ayuda a pensar en features como modulos de producto: si una seccion no puede cargarse sola, probablemente depende demasiado de otras zonas.',
      example: `{
  path: 'products',
  loadComponent: () =>
    import('./features/products/pages/products-page/products-page.component')
      .then(m => m.ProductsPageComponent)
}`,
    },
    {
      title: 'Componentes contenedor y presentacionales',
      category: 'Componentes',
      description:
        'El contenedor coordina datos y acciones. El presentacional recibe inputs y emite outputs. Esta separacion reduce complejidad y hace los componentes visuales mas reutilizables. No hace falta aplicarlo de forma dogmatica en cada boton, pero si en pantallas con datos, permisos y varias acciones.',
      example: `products-page.component.ts
  carga datos y llama a la facade

product-card.component.ts
  @Input() product
  @Output() selected`,
    },
    {
      title: 'Anti patron: shared gigante',
      category: 'Antipatrones',
      important: true,
      description:
        'Cuando todo va a shared, shared deja de significar reutilizable. Acaba lleno de dependencias cruzadas, componentes demasiado concretos y miedo a cambiar cualquier cosa. Un shared gigante suele parecer ordenado al principio, pero con el tiempo se convierte en el sitio donde nadie sabe si puede borrar algo.',
      example: `shared/
  products-table/
  admin-user-form/
  invoice-business-rules.ts

// Mejor: cada cosa en su feature`,
    },
    {
      title: 'Anti patron: servicios dios',
      category: 'Antipatrones',
      important: true,
      description:
        'Un servicio con HTTP, estado, validaciones, navegacion, permisos y formateo se vuelve dificil de probar y de reutilizar. Divide responsabilidades: API service para red, facade para coordinar estado, mapper para transformar datos y helpers puros para reglas aisladas.',
      example: `products-api.service.ts  // HTTP
products.facade.ts       // estado y acciones
product.mapper.ts        // DTO -> VM
product-rules.ts         // funciones puras`,
    },
    {
      title: 'Convenciones documentadas',
      category: 'Equipo',
      description:
        'Una arquitectura solo funciona si el equipo la comparte. Documenta donde va cada cosa, como se nombran archivos, cuando usar facade y que no debe entrar en shared. La documentacion no tiene que ser enorme: una guia corta, mantenida y aplicada en reviews vale mas que un documento perfecto que nadie lee.',
      example: `docs/frontend-architecture.md
docs/naming.md
docs/testing-strategy.md`,
    },
    {
      title: 'Separacion entre lectura y escritura',
      category: 'Estado',
      description:
        'Las pantallas suelen leer modelos preparados y disparar comandos. Separar queries de commands reduce componentes que saben demasiado y facilita controlar loading, errores y permisos. Tambien hace mas claro que partes son lectura pasiva y que partes producen cambios reales en el sistema.',
      example: `readonly products = this.facade.products;
readonly loading = this.facade.loading;

createProduct(payload: ProductForm): void {
  this.facade.create(payload);
}`,
    },
    {
      title: 'Mappers como frontera',
      category: 'Datos',
      description:
        'Coloca la traduccion API -> UI en un mapper explicito. Asi si cambia el backend, no tienes que modificar veinte templates. Los mappers tambien son un buen sitio para resolver campos opcionales, normalizar enums o construir textos de visualizacion.',
      example: `export function toProductVm(dto: ProductDto): ProductVm {
  return {
    title: dto.product_name,
    priceLabel: formatMoney(dto.price_cents),
  };
}`,
    },
    {
      title: 'Rutas como contrato de producto',
      category: 'Rutas',
      description:
        'La estructura de rutas debe expresar la navegacion real del producto. Usa nombres predecibles, parametros claros y guards/resolvers solo cuando aporten valor. Una ruta es parte del contrato de la app: se comparte, se guarda en favoritos y suele aparecer en soporte o analitica.',
      example: `products
products/:productId
products/:productId/edit
orders/:orderId/summary`,
    },
    {
      title: 'Interceptors transversales',
      category: 'HTTP',
      description:
        'Autenticacion, request id, manejo comun de errores o headers de idioma pertenecen a interceptors. Evita repetir esa logica en cada servicio API. Si todos los endpoints necesitan el mismo header o la misma reaccion ante 401, centralizarlo reduce errores y mejora consistencia.',
      example: `export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cloned = req.clone({
    setHeaders: { Authorization: 'Bearer token' },
  });

  return next(cloned);
};`,
    },
    {
      title: 'Feature API minima',
      category: 'Equipo',
      description:
        'Cada feature deberia exponer lo justo. Si otras zonas importan archivos internos profundos, has perdido encapsulacion y cualquier refactor sera doloroso. Una API publica pequena permite reorganizar internamente una feature sin romper a consumidores externos.',
      example: `features/products/index.ts
  export * from './models/product.model';
  export * from './facades/products.facade';

// Evitar imports desde components internos`,
    },
    {
      title: 'Disena para borrar codigo',
      category: 'Mantenibilidad',
      description:
        'Una buena arquitectura permite eliminar una feature vieja sin perseguir referencias por toda la app. Si borrar una pantalla rompe shared, core y otras features, hay acoplamiento excesivo. Pensar en borrado es una prueba muy honesta de modularidad: lo bien separado se puede retirar con poco drama.',
      example: `Eliminar features/legacy-reports/
  no deberia tocar:
  - features/products
  - shared/ui
  - core/auth`,
    },
    {
      title: 'Estado local antes que global',
      category: 'Estado',
      important: true,
      description:
        'No todo merece store global. Si un dato solo vive en una pantalla, usa estado local con signals o RxJS. Eleva a global cuando hay comparticion real, persistencia o flujos cruzados. El estado global tiene coste: mas convenciones, mas indirecciones y mas superficie para bugs si se usa sin necesidad.',
      example: `// Local
readonly filters = signal(defaultFilters);

// Global solo si varias features dependen de ello
readonly currentUser = this.authStore.user;`,
    },
    {
      title: 'Arquitectura evolutiva',
      category: 'Equipo',
      description:
        'No intentes meter todos los patrones el dia uno. Empieza simple y sube de nivel cuando aparecen senales: duplicacion, flujos async repetidos, pantallas enormes o cambios lentos. La arquitectura sana no es la mas sofisticada, sino la que acompana el tamano real del producto sin bloquear al equipo.',
      example: `1. Component + service
2. Mapper cuando la API ensucia la UI
3. Facade cuando hay estado y acciones
4. Store global cuando hay estado compartido real`,
    },
    {
      title: 'Bounded contexts en frontend',
      category: 'Estructura',
      important: true,
      description:
        'No todos los dominios significan lo mismo en todas las pantallas. Un usuario en administracion, un usuario en facturacion y un usuario en soporte pueden necesitar modelos distintos. Separar contextos evita modelos gigantes que intentan servir a todo el mundo y no encajan bien en ningun sitio.',
      example: `features/admin-users/
  models/admin-user.model.ts

features/support-users/
  models/support-user.model.ts`,
    },
    {
      title: 'Contratos entre capas',
      category: 'Dependencias',
      description:
        'Cada capa deberia hablar con la siguiente mediante contratos claros. La pagina no necesita conocer el DTO crudo, y el servicio HTTP no necesita saber como se pinta una tarjeta. Esto permite cambiar implementaciones sin arrastrar cambios por toda la pila.',
      example: `Page -> Facade -> API Service -> HttpClient
Page recibe ProductVm
API Service recibe/devuelve DTO
Mapper traduce DTO -> VM`,
    },
    {
      title: 'Feature shell',
      category: 'Rutas',
      description:
        'Cuando una seccion tiene varias subrutas, un shell de feature ayuda a concentrar navegacion secundaria, permisos, breadcrumbs y layout propio sin contaminar el layout global.',
      example: `features/products/
  products-shell.component.ts
  pages/list/
  pages/detail/
  pages/edit/`,
    },
    {
      title: 'Feature flags',
      category: 'Equipo',
      description:
        'Las feature flags permiten integrar codigo sin exponerlo a todos los usuarios. Son utiles para despliegues graduales, pruebas internas y apagado rapido de funcionalidades problematicas.',
      example: `@if (featureFlags.newCheckout()) {
  <app-new-checkout />
} @else {
  <app-legacy-checkout />
}`,
    },
    {
      title: 'Errores transversales',
      category: 'HTTP',
      important: true,
      description:
        'No todos los errores deben resolverse en cada componente. Un 401 puede cerrar sesion, un 403 puede redirigir o mostrar permiso denegado, y un 500 puede registrar contexto comun. Centralizar lo transversal reduce duplicacion.',
      example: `errorInterceptor:
  401 -> logout
  403 -> forbidden page
  500 -> log + toast generico`,
    },
    {
      title: 'Capa de permisos',
      category: 'Seguridad',
      description:
        'Los permisos no deberian estar repartidos como ifs sueltos por toda la UI. Una capa de permisos permite consultar intenciones: canEditOrder, canDeleteUser, canSeeAdminMenu. El backend sigue siendo autoridad, pero la UI queda coherente.',
      example: `@if (permissions.canEditOrder(order())) {
  <button type="button">Editar</button>
}`,
    },
    {
      title: 'Eventos de dominio',
      category: 'Estado',
      description:
        'En flujos complejos, pensar en eventos de dominio ayuda a desacoplar. En vez de que una pantalla sepa todo lo que debe actualizar, emite que algo ha pasado y deja que la capa coordinadora refresque lo necesario.',
      example: `orderCreated
orderCancelled
profileUpdated

// La facade decide que recargar`,
    },
    {
      title: 'Evita barrel files enormes',
      category: 'Antipatrones',
      description:
        'Los index.ts pueden ayudar a exponer una API publica, pero si exportan todo por comodidad pueden ocultar dependencias, empeorar tree-shaking y facilitar imports internos que no deberian usarse.',
      example: `// Bien
export * from './models/product.model';
export * from './facades/products.facade';

// Mal
export * from './components/internal-debug-panel';`,
    },
    {
      title: 'Monorepo con limites',
      category: 'Equipo',
      description:
        'Si el proyecto crece a varias apps o librerias, un monorepo puede ayudar. Pero debe tener limites: librerias por dominio o capacidad, reglas de importacion y ownership claro.',
      example: `libs/
  ui/
  auth/
  products/domain/
  products/data-access/
  products/feature-list/`,
    },
    {
      title: 'Design system como contrato',
      category: 'Componentes',
      important: true,
      description:
        'Un design system no es solo una coleccion de botones bonitos. Es un contrato entre producto, diseno y desarrollo: tokens, estados, accesibilidad, variantes y reglas de uso. Evita que cada pantalla reinvente patrones.',
      example: `shared/ui/button
shared/ui/form-field
shared/ui/empty-state
tokens/colors.scss
tokens/spacing.scss`,
    },
  ];

  readonly categories = computed(() => [
    'Todas',
    ...Array.from(new Set(this.blocks.map(block => block.category))),
  ]);

  readonly filteredBlocks = computed(() => {
    const selected = this.selectedCategory();

    return selected === 'Todas'
      ? this.blocks
      : this.blocks.filter(block => block.category === selected);
  });

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
