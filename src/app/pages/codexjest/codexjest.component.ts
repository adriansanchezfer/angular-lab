import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES } from '../../shared/primeng.imports';

interface JestExample {
  title: string;
  category: string;
  important?: boolean;
  description: string;
  code: string;
}

@Component({
  selector: 'app-codexjest',
  imports: [CommonModule, PRIMENG_MODULES],
  templateUrl: './codexjest.component.html',
  styleUrl: './codexjest.component.scss',
})
export class CodexjestComponent {
  readonly selectedCategory = signal('Todos');

  readonly basics = [
    'describe agrupa casos relacionados.',
    'it/test define un comportamiento verificable.',
    'expect expresa el resultado esperado.',
    'Mocks sustituyen dependencias externas.',
    'Los tests buenos comprueban comportamiento, no detalles internos.',
  ];

  readonly examples: JestExample[] = [
    {
      title: 'Estructura basica',
      category: 'Basicos',
      important: true,
      description:
        'Un test debe leerse como una pequena especificacion. Prepara datos, ejecuta la accion y comprueba el resultado.',
      code: `describe('sum', () => {
  it('adds two numbers', () => {
    const result = sum(2, 3);

    expect(result).toBe(5);
  });
});`,
    },
    {
      title: 'Matchers comunes',
      category: 'Basicos',
      description:
        'Los matchers comparan valores. Usa el matcher que expresa mejor la intencion: igualdad exacta, contenido, null, booleanos o estructura parcial.',
      code: `expect(total).toBe(10);
expect(user).toEqual({ id: 1, name: 'Ada' });
expect(items).toContain('Angular');
expect(value).toBeTruthy();
expect(response).toMatchObject({ ok: true });`,
    },
    {
      title: 'Arrange, Act, Assert',
      category: 'Metodo',
      important: true,
      description:
        'Ordenar el test en preparacion, accion y verificacion hace que sea mas facil entender que se esta probando y donde falla.',
      code: `it('marks a task as done', () => {
  // Arrange
  const task = { id: 1, done: false };

  // Act
  const result = markAsDone(task);

  // Assert
  expect(result.done).toBe(true);
});`,
    },
    {
      title: 'Mocks con jest.fn',
      category: 'Mocks',
      important: true,
      description:
        'Un mock permite comprobar que una dependencia fue llamada sin ejecutar su implementacion real. Es ideal para servicios, callbacks, analytics o navegacion.',
      code: `it('calls save service', () => {
  const save = jest.fn();

  submitForm({ name: 'Ada' }, save);

  expect(save).toHaveBeenCalledWith({ name: 'Ada' });
  expect(save).toHaveBeenCalledTimes(1);
});`,
    },
    {
      title: 'Mock de retorno',
      category: 'Mocks',
      description:
        'Puedes controlar que devuelve una dependencia para probar ramas de exito, error o estados vacios.',
      code: `const productsApi = {
  getProducts: jest.fn().mockReturnValue([
    { id: 1, title: 'Keyboard' },
  ]),
};

expect(productsApi.getProducts()).toHaveLength(1);`,
    },
    {
      title: 'Promesas async',
      category: 'Async',
      important: true,
      description:
        'Cuando una funcion devuelve Promise, usa async/await. Si no esperas la promesa, el test puede pasar antes de que ocurra lo importante.',
      code: `it('loads user', async () => {
  api.getUser.mockResolvedValue({ id: 1, name: 'Ada' });

  const user = await service.loadUser(1);

  expect(user.name).toBe('Ada');
});`,
    },
    {
      title: 'Errores async',
      category: 'Async',
      description:
        'Los fallos tambien se prueban. Esto evita que la UI quede sin mensaje o que una excepcion rompa el flujo.',
      code: `it('returns fallback when API fails', async () => {
  api.getProducts.mockRejectedValue(new Error('Network'));

  await expect(service.loadProducts()).resolves.toEqual([]);
});`,
    },
    {
      title: 'Componentes Angular',
      category: 'Angular',
      important: true,
      description:
        'En Angular, TestBed crea el componente y fixture.detectChanges ejecuta el ciclo de deteccion para renderizar template.',
      code: `beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [ProductCardComponent],
  }).compileComponents();
});

it('renders product title', () => {
  const fixture = TestBed.createComponent(ProductCardComponent);
  fixture.componentRef.setInput('product', { title: 'Keyboard' });
  fixture.detectChanges();

  expect(fixture.nativeElement.textContent).toContain('Keyboard');
});`,
    },
    {
      title: 'Servicios Angular',
      category: 'Angular',
      description:
        'Para servicios, TestBed permite inyectar dependencias falsas. Asi pruebas la logica sin tocar red, router o storage real.',
      code: `await TestBed.configureTestingModule({
  providers: [
    ProductsFacade,
    { provide: ProductsApi, useValue: apiMock },
  ],
});

const facade = TestBed.inject(ProductsFacade);`,
    },
    {
      title: 'HTTP con mock',
      category: 'HTTP',
      description:
        'No pruebes contra APIs reales en unit tests. Mockea HttpClient o usa controladores de testing para responder con datos previsibles.',
      code: `apiMock.getProducts.mockReturnValue(
  of([{ id: 1, title: 'Keyboard' }])
);

facade.load();

expect(facade.products()).toEqual([
  { id: 1, title: 'Keyboard' },
]);`,
    },
    {
      title: 'Timers falsos',
      category: 'Async',
      description:
        'Para debounce, timeouts o intervalos, fake timers evitan tests lentos y hacen el tiempo controlable.',
      code: `jest.useFakeTimers();

search('angular');
jest.advanceTimersByTime(300);

expect(api.search).toHaveBeenCalledWith('angular');`,
    },
    {
      title: 'Que no testear',
      category: 'Metodo',
      description:
        'Evita tests que solo duplican la implementacion. Testea salidas, texto visible, llamadas importantes y cambios de estado observables.',
      code: `// Poco util
expect(component.loading()).toBe(false);

// Mejor
expect(screen.getByText('No hay productos')).toBeTruthy();`,
    },
  ];

  readonly categories = computed(() => [
    'Todos',
    ...Array.from(new Set(this.examples.map(example => example.category))),
  ]);

  readonly filteredExamples = computed(() => {
    const selected = this.selectedCategory();

    return selected === 'Todos'
      ? this.examples
      : this.examples.filter(example => example.category === selected);
  });

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
