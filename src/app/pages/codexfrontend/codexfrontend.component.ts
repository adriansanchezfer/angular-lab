import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES } from '../../shared/primeng.imports';

interface PracticeExample {
  title: string;
  category: string;
  important?: boolean;
  description: string;
  avoid: string;
  recommended: string;
}

@Component({
  selector: 'app-codexfrontend',
  imports: [CommonModule, PRIMENG_MODULES],
  templateUrl: './codexfrontend.component.html',
  styleUrl: './codexfrontend.component.scss',
})
export class CodexfrontendComponent {
  readonly selectedCategory = signal('Todas');

  readonly checklist = [
    'Componentes pequenos, con una responsabilidad clara',
    'Templates legibles y logica pesada fuera del HTML',
    'Datos tipados desde servicios y APIs',
    'Estados de carga, error y vacio siempre contemplados',
    'Accesibilidad en botones, formularios e interacciones',
    'CSS responsive con dimensiones estables',
    'Convenciones de nombres consistentes',
    'Rendimiento cuidado desde el diseno',
    'Seguridad basica en formularios y renderizado',
  ];

  readonly examples: PracticeExample[] = [
    {
      title: 'Componentes enfocados',
      category: 'Arquitectura',
      important: true,
      description:
        'Un componente sano tiene una responsabilidad principal: mostrar una tabla, editar un formulario, representar una tarjeta o coordinar una pagina. Cuando mezcla carga de datos, validacion, layout, exportaciones y reglas de negocio, cualquier cambio pequeno se vuelve caro. La senal de alarma es que lo tenga que tocar quien cambia el diseno, quien cambia la API y quien cambia una regla de negocio.',
      avoid: `export class DashboardComponent {
  users = [];
  invoices = [];
  charts = [];
  form = new FormGroup(...);
  exportPdf() {}
  saveUser() {}
  loadEverything() {}
}`,
      recommended: `// dashboard-page.component.ts coordina
// users-table.component.ts muestra usuarios
// invoice-summary.component.ts resume facturas
// revenue-chart.component.ts dibuja la grafica`,
    },
    {
      title: 'Templates simples',
      category: 'Angular',
      important: true,
      description:
        'El template debe contar la historia visual de la pantalla. Si metes filtros, calculos largos o condiciones repetidas dentro del HTML, cuesta depurar y se recalcula mas de lo necesario. Mejor preparar datos en TypeScript con computed, getters simples o modelos de vista. Asi el HTML queda para estructura, estados y eventos, no para esconder logica.',
      avoid: `<p>
  {{ users.filter(user => user.active && user.role === 'admin').length }}
</p>`,
      recommended: `readonly activeAdmins = computed(() =>
  this.users().filter(user => user.active && user.role === 'admin')
);`,
    },
    {
      title: 'Estados completos',
      category: 'UX',
      important: true,
      description:
        'Una pantalla real no tiene solo estado feliz. Tambien hay espera, errores de red, respuestas vacias, permisos insuficientes y acciones que tardan. Modelar esos estados evita interfaces congeladas y ayuda al usuario a entender que esta pasando. Una buena pantalla no solo muestra datos: tambien explica que ocurre cuando aun no hay datos o cuando algo falla.',
      avoid: `<app-user-list [users]="users"></app-user-list>`,
      recommended: `@if (loading()) {
  <p>Cargando...</p>
} @else if (error()) {
  <p>No se pudieron cargar los datos.</p>
} @else if (users().length === 0) {
  <p>No hay usuarios todavia.</p>
} @else {
  <app-user-list [users]="users()"></app-user-list>
}`,
    },
    {
      title: 'Track en listas',
      category: 'Rendimiento',
      description:
        'Cuando Angular renderiza listas necesita saber que elemento es cual. Usar un id estable permite conservar DOM, foco, animaciones y estado interno; usar el indice puede romperse al ordenar, insertar o eliminar.',
      avoid: `@for (product of products; track $index) {
  <app-product-card [product]="product" />
}`,
      recommended: `@for (product of products; track product.id) {
  <app-product-card [product]="product" />
}`,
    },
    {
      title: 'Accesibilidad real',
      category: 'Accesibilidad',
      important: true,
      description:
        'Accesibilidad no es solo lectores de pantalla. Tambien significa poder usar teclado, entender los controles por su nombre, ver el foco y no depender solo del color o de un icono ambiguo. Muchas mejoras de accesibilidad mejoran la experiencia de todo el mundo: formularios mas claros, botones con nombres reales y errores faciles de encontrar.',
      avoid: `<div class="icon" (click)="deleteItem(item)">x</div>`,
      recommended: `<button
  type="button"
  aria-label="Eliminar producto"
  (click)="deleteItem(item)"
>
  <i class="pi pi-trash"></i>
</button>`,
    },
    {
      title: 'Formularios tipados',
      category: 'Formularios',
      description:
        'Los formularios son una frontera de datos muy sensible porque convierten intenciones del usuario en payloads reales. Tiparlos ayuda a saber que campos existen, que puede ser null, que validaciones se aplican y que se envia al backend. Tambien reduce bugs silenciosos cuando se renombra un campo o cambia una validacion.',
      avoid: `form = new FormGroup({
  email: new FormControl()
});`,
      recommended: `form = new FormGroup({
  email: new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email]
  })
});`,
    },
    {
      title: 'Servicios para datos',
      category: 'HTTP',
      description:
        'Los servicios separan la pantalla de los detalles de red. Asi puedes cambiar una URL, transformar una respuesta o reutilizar un endpoint sin rastrear llamadas duplicadas por toda la app. La pantalla deberia pedir datos con una intencion clara, no construir rutas, query params y transformaciones profundas en medio del componente.',
      avoid: `this.http.get('/api/users').subscribe(users => {
  this.users = users;
});`,
      recommended: `readonly users$ = this.userService.getUsers();

getUsers(): Observable<User[]> {
  return this.http.get<User[]>(this.apiUrl);
}`,
    },
    {
      title: 'CSS con limites',
      category: 'Responsive',
      description:
        'El CSS mantenible piensa en contenido real: titulos largos, pantallas pequenas, zoom del navegador, traducciones mas largas y datos variables. Usar grids fluidos, min/max, aspect-ratio y overflow controlado evita saltos visuales. Una UI robusta no depende de que el texto de demo mida justo lo que esperabas.',
      avoid: `.card {
  width: 400px;
}`,
      recommended: `.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
  gap: 1rem;
}`,
    },
    {
      title: 'Nombres consistentes',
      category: 'Mantenibilidad',
      description:
        'Los nombres deben decir que papel cumple cada archivo. Una convencion sencilla reduce friccion: page para rutas, component para UI, service para integraciones, model para tipos y facade para coordinacion.',
      avoid: `products/
  data.ts
  thing.component.ts
  helper.service.ts`,
      recommended: `products/
  pages/products-page/
  components/product-card/
  services/products-api.service.ts
  facades/products.facade.ts
  models/product.model.ts`,
    },
    {
      title: 'Evita acoplar UI y API',
      category: 'HTTP',
      description:
        'El template no deberia depender de nombres raros del backend ni de estructuras profundas. Transforma la respuesta en un modelo de vista antes de pintarla.',
      avoid: `<h2>{{ product.product_data.product_name }}</h2>
<p>{{ product.prices[0].amount }}</p>`,
      recommended: `const productVm = {
  title: dto.product_data.product_name,
  price: formatCurrency(dto.prices[0].amount)
};`,
    },
    {
      title: 'Diseno tolerante a contenido real',
      category: 'UX',
      description:
        'Los datos reales llegan con nombres largos, imagenes que fallan, campos opcionales, listas vacias y traducciones mas grandes que el texto original. La interfaz debe tener placeholders, truncados razonables y fallback visual. Disenar solo con datos perfectos suele crear pantallas bonitas en local y fragiles en produccion.',
      avoid: `.title {
  white-space: nowrap;
}`,
      recommended: `.title {
  overflow-wrap: anywhere;
  line-height: 1.3;
}

.image {
  aspect-ratio: 4 / 3;
  object-fit: cover;
}`,
    },
    {
      title: 'Botones con estados',
      category: 'UX',
      description:
        'Un boton que dispara una accion async necesita feedback: deshabilitado durante envio, texto o icono de carga y resultado claro. Esto evita dobles envios y hace que la interfaz parezca fiable.',
      avoid: `<button (click)="save()">Guardar</button>`,
      recommended: `<button
  type="button"
  [disabled]="saving()"
  (click)="save()"
>
  {{ saving() ? 'Guardando...' : 'Guardar' }}
</button>`,
    },
    {
      title: 'Validacion visible',
      category: 'Formularios',
      description:
        'No basta con bloquear el submit. El usuario necesita saber que campo falla, por que falla y como corregirlo. Los mensajes deben aparecer cerca del campo y no solo en un toast global.',
      avoid: `<input formControlName="email">
<button [disabled]="form.invalid">Enviar</button>`,
      recommended: `<input formControlName="email" aria-describedby="email-error">
@if (email.invalid && email.touched) {
  <small id="email-error">Introduce un email valido.</small>
}`,
    },
    {
      title: 'Cancelacion de peticiones',
      category: 'HTTP',
      important: true,
      description:
        'En buscadores y filtros, cada cambio puede disparar una peticion. Si no cancelas las anteriores, una respuesta lenta puede pisar el resultado mas reciente. Este bug es especialmente traicionero porque no aparece siempre: depende de latencia, orden de respuestas y velocidad del usuario.',
      avoid: `search(term: string) {
  this.http.get('/api?q=' + term).subscribe();
}`,
      recommended: `this.searchTerm.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(term => this.api.search(term))
);`,
    },
    {
      title: 'Carga progresiva',
      category: 'Rendimiento',
      description:
        'No todo tiene que estar listo para pintar la primera pantalla. Carga lo critico primero y retrasa modales pesados, graficas, editores o secciones secundarias.',
      avoid: `imports: [
  HeavyChartComponent,
  RichTextEditorComponent,
  AdminDialogComponent
]`,
      recommended: `const AdminDialog = await import('./admin-dialog.component');
this.dialog.open(AdminDialog.AdminDialogComponent);`,
    },
    {
      title: 'Sanitiza contenido externo',
      category: 'Seguridad',
      important: true,
      description:
        'Nunca trates HTML externo como si fuera seguro. Si renderizas contenido de CMS, markdown o usuarios, controla que etiquetas permites y evita bypassSecurityTrustHtml salvo casos muy revisados.',
      avoid: `<section [innerHTML]="commentFromApi"></section>`,
      recommended: `// Preferible: renderizar texto o contenido sanitizado
<p>{{ commentFromApi }}</p>`,
    },
    {
      title: 'Preferencias del usuario',
      category: 'Accesibilidad',
      description:
        'Respeta usuarios con sensibilidad al movimiento, alto zoom o navegacion por teclado. Las animaciones deben aportar, no impedir usar la app.',
      avoid: `.panel {
  animation: slide 400ms infinite;
}`,
      recommended: `@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms;
    transition-duration: 0.01ms;
  }
}`,
    },
    {
      title: 'Errores recuperables',
      category: 'UX',
      description:
        'Un error no deberia ser una pared. Ofrece reintentar, volver atras, contactar o mantener datos cacheados si es posible.',
      avoid: `<p>Error</p>`,
      recommended: `<p>No se pudieron cargar los productos.</p>
<button type="button" (click)="reload()">Reintentar</button>`,
    },
    {
      title: 'Formato centralizado',
      category: 'Mantenibilidad',
      description:
        'Fechas, monedas y estados deben formatearse siempre igual. Centralizar formato evita pantallas con criterios distintos y facilita cambios de idioma.',
      avoid: `{{ price }} EUR
{{ date.split('T')[0] }}`,
      recommended: `{{ price | currency:'EUR' }}
{{ createdAt | date:'shortDate' }}`,
    },
    {
      title: 'No bloquear el hilo principal',
      category: 'Rendimiento',
      important: true,
      description:
        'Operaciones pesadas en el navegador congelan scroll, clicks y escritura. Divide trabajo, pagina resultados, delega al backend o usa Web Workers para tareas realmente costosas.',
      avoid: `const result = hugeArray
  .map(expensiveTransform)
  .filter(expensivePredicate);`,
      recommended: `const visibleItems = computed(() =>
  items().slice(0, pageSize())
);

// Para calculos grandes: backend, worker o paginacion`,
    },
    {
      title: 'Skeletons mejor que pantallas vacias',
      category: 'UX',
      description:
        'Un skeleton o placeholder mantiene la estructura de la pantalla durante la carga. Ayuda a percibir velocidad y evita saltos bruscos cuando llegan los datos.',
      avoid: `@if (loading()) {
  <p>Cargando...</p>
}`,
      recommended: `@if (loading()) {
  <app-product-card-skeleton />
} @else {
  <app-product-card [product]="product()" />
}`,
    },
    {
      title: 'Inputs y outputs con contratos claros',
      category: 'Angular',
      description:
        'Un componente reutilizable debe dejar claro que recibe y que emite. Evita pasar objetos enormes si solo necesita dos campos.',
      avoid: `<app-card [dashboard]="dashboard"></app-card>`,
      recommended: `<app-card
  [title]="product.title"
  [price]="product.price"
  (selected)="selectProduct(product.id)"
/>`,
    },
    {
      title: 'Evita subscribes anidados',
      category: 'RxJS',
      important: true,
      description:
        'Los subscribes dentro de subscribes complican errores, cancelacion y mantenimiento. Tambien suelen esconder fugas de memoria o respuestas que llegan fuera de orden. Compone streams con operadores como switchMap, concatMap, mergeMap o forkJoin para que la relacion entre operaciones sea explicita.',
      avoid: `this.user$.subscribe(user => {
  this.http.get('/orders/' + user.id).subscribe();
});`,
      recommended: `this.user$.pipe(
  switchMap(user => this.http.get('/orders/' + user.id))
);`,
    },
    {
      title: 'Permisos tambien en la UI',
      category: 'Seguridad',
      description:
        'El backend decide de verdad, pero el frontend debe ocultar o deshabilitar acciones no permitidas para evitar frustracion y flujos imposibles.',
      avoid: `<button (click)="deleteUser()">Eliminar</button>`,
      recommended: `@if (canDeleteUser()) {
  <button type="button" (click)="deleteUser()">Eliminar</button>
}`,
    },
    {
      title: 'Logs y errores con contexto',
      category: 'Mantenibilidad',
      description:
        'Cuando algo falla en produccion necesitas contexto: accion, entidad, usuario anonimo o request id. Un console.log suelto rara vez ayuda.',
      avoid: `catchError(error => {
  console.log(error);
  return of([]);
})`,
      recommended: `catchError(error => {
  this.logger.error('Products load failed', { error, filters });
  return of([]);
})`,
    },
    {
      title: 'Disena componentes vacios',
      category: 'UX',
      description:
        'Una tabla sin datos, una busqueda sin resultados o una cuenta nueva necesitan una pantalla vacia con accion siguiente, no un hueco blanco. Los empty states son parte del producto: explican por que no hay contenido y ayudan a empezar, limpiar filtros o crear el primer recurso.',
      avoid: `@if (items().length) {
  <app-table [items]="items()" />
}`,
      recommended: `@if (items().length === 0) {
  <app-empty-state title="No hay productos" action="Crear producto" />
} @else {
  <app-table [items]="items()" />
}`,
    },
    {
      title: 'Tablas pensadas para trabajar',
      category: 'UX',
      important: true,
      description:
        'Las tablas de una app operativa no son decoracion: son herramientas de decision. Deben permitir escanear, ordenar, filtrar, paginar y entender que fila esta seleccionada. Una tabla sin estados, sin densidad adecuada o sin acciones claras obliga al usuario a leer demasiado y trabajar de memoria.',
      avoid: `<table>
  <tr *ngFor="let order of orders">
    <td>{{ order }}</td>
  </tr>
</table>`,
      recommended: `<p-table
  [value]="orders()"
  [paginator]="true"
  [rows]="25"
  sortMode="multiple"
>
  <!-- columnas con formato, acciones y estado vacio -->
</p-table>`,
    },
    {
      title: 'Filtros persistentes',
      category: 'UX',
      description:
        'Si una pantalla se usa muchas veces al dia, perder filtros al recargar o volver atras es frustrante. Guardar filtros en query params o estado local persistido permite compartir enlaces, volver al mismo contexto y reducir trabajo repetido.',
      avoid: `filters = signal({ status: 'open' });`,
      recommended: `this.router.navigate([], {
  queryParams: this.filters(),
  queryParamsHandling: 'merge'
});`,
    },
    {
      title: 'Mensajes de error accionables',
      category: 'UX',
      important: true,
      description:
        'Un mensaje de error debe ayudar a decidir el siguiente paso. No basta con decir que algo fallo: explica si puede reintentarse, si faltan permisos, si hay que corregir un campo o si el problema es temporal.',
      avoid: `<p>Unexpected error</p>`,
      recommended: `<p>No se pudo guardar el pedido.</p>
<p>Revisa la conexion y vuelve a intentarlo.</p>
<button type="button" (click)="save()">Reintentar</button>`,
    },
    {
      title: 'Cache con invalidacion clara',
      category: 'HTTP',
      description:
        'Cachear datos mejora rendimiento, pero una cache sin invalidacion crea pantallas mentirosas. Define cuando se reutilizan datos, cuando se refrescan y que acciones invalidan la cache.',
      avoid: `products$ = this.http.get('/api/products').pipe(
  shareReplay(1)
);`,
      recommended: `reloadProducts(): void {
  this.productsCache.clear();
  this.loadProducts();
}`,
    },
    {
      title: 'Optimistic UI con rollback',
      category: 'UX',
      description:
        'Actualizar la UI antes de que responda el servidor puede hacer la app mas rapida, pero debe tener rollback si falla. Es util en likes, toggles o acciones reversibles; no tanto en operaciones destructivas o criticas.',
      avoid: `deleteItem(id);
this.items.update(items => items.filter(item => item.id !== id));`,
      recommended: `const snapshot = this.items();
this.removeLocally(id);

this.api.delete(id).pipe(
  catchError(() => {
    this.items.set(snapshot);
    return EMPTY;
  })
);`,
    },
    {
      title: 'Diseno para internacionalizacion',
      category: 'Mantenibilidad',
      description:
        'Aunque hoy solo haya un idioma, evita concatenar textos con variables de forma rigida. Otros idiomas cambian orden, genero, pluralizacion y longitud. Preparar la UI para i18n evita redisenos cuando el producto crece.',
      avoid: `{{ count }} productos encontrados`,
      recommended: `i18n.productsFound({ count })

// La traduccion decide plural y orden`,
    },
    {
      title: 'No escondas focus outlines',
      category: 'Accesibilidad',
      important: true,
      description:
        'Quitar el outline porque "queda feo" rompe la navegacion por teclado. Si el foco por defecto no encaja visualmente, disena uno mejor, pero no lo elimines.',
      avoid: `button:focus {
  outline: none;
}`,
      recommended: `button:focus-visible {
  outline: 3px solid #2563eb;
  outline-offset: 2px;
}`,
    },
    {
      title: 'Evita magic numbers en CSS',
      category: 'Responsive',
      description:
        'Los valores sueltos repetidos hacen dificil mantener espaciados, alturas y breakpoints. Usa variables/tokens cuando el proyecto crece para que la interfaz mantenga ritmo visual.',
      avoid: `.card { padding: 13px; }
.panel { margin: 17px; }`,
      recommended: `:root {
  --space-3: 0.75rem;
  --space-4: 1rem;
}

.card { padding: var(--space-4); }`,
    },
    {
      title: 'Mide antes de optimizar',
      category: 'Rendimiento',
      description:
        'Optimizar sin medir suele cambiar codigo sin mejorar experiencia. Usa DevTools, Lighthouse o metricas reales para saber si el problema es bundle, red, renderizado, imagenes o JavaScript pesado.',
      avoid: `// Reescribir toda la pantalla porque "parece lenta"`,
      recommended: `// 1. Medir
// 2. Identificar cuello de botella
// 3. Cambiar una cosa
// 4. Volver a medir`,
    },
    {
      title: 'Confirmaciones proporcionales',
      category: 'UX',
      description:
        'No todas las acciones necesitan modal. Un delete irreversible si; cambiar un filtro no. Demasiadas confirmaciones entrenan al usuario a aceptar sin leer.',
      avoid: `openConfirmDialog('Quieres aplicar este filtro?');`,
      recommended: `if (action.isDestructive) {
  openConfirmDialog('Eliminar usuario');
}`,
    },
  ];

  readonly categories = computed(() => [
    'Todas',
    ...Array.from(new Set(this.examples.map(example => example.category))),
  ]);

  readonly filteredExamples = computed(() => {
    const selected = this.selectedCategory();

    return selected === 'Todas'
      ? this.examples
      : this.examples.filter(example => example.category === selected);
  });

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
