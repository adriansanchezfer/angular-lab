import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  catchError,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  forkJoin,
  from,
  map,
  mergeMap,
  Observable,
  of,
  pairwise,
  reduce,
  scan,
  shareReplay,
  startWith,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError,
  withLatestFrom,
} from 'rxjs';
import { PRIMENG_MODULES } from '../../shared/primeng.imports';

interface OperatorExample {
  title: string;
  category: string;
  description: string;
  code: string;
  output: string[];
}

@Component({
  selector: 'app-codexrxjs',
  imports: [CommonModule, PRIMENG_MODULES],
  templateUrl: './codexrxjs.component.html',
  styleUrl: './codexrxjs.component.scss',
})
export class CodexrxjsComponent {
  readonly selectedCategory = signal('Todos');

  readonly examples: OperatorExample[] = [
    {
      title: 'map',
      category: 'Transformacion',
      description:
        'Convierte cada emision en otro valor sin cambiar la cantidad de emisiones. Es el operador de transformacion mas habitual: sirve para adaptar respuestas HTTP, preparar datos para la vista o calcular propiedades derivadas.',
      code: `of(1, 2, 3).pipe(
  map(value => value * 10)
);`,
      output: this.collect(of(1, 2, 3).pipe(map(value => value * 10))),
    },
    {
      title: 'filter',
      category: 'Filtrado',
      description:
        'Deja pasar solo las emisiones que cumplen una condicion booleana. Es util cuando un stream trae demasiado ruido: clicks no validos, valores vacios, usuarios sin permisos o elementos que no deben llegar a la UI.',
      code: `from([1, 2, 3, 4, 5]).pipe(
  filter(value => value % 2 === 0)
);`,
      output: this.collect(from([1, 2, 3, 4, 5]).pipe(filter(value => value % 2 === 0))),
    },
    {
      title: 'tap',
      category: 'Efectos laterales',
      description:
        'Ejecuta una accion secundaria sin transformar el dato. Suele usarse para logging, metricas, depuracion o disparar un efecto puntual, pero conviene no meter aqui logica de negocio pesada.',
      code: `of('guardar').pipe(
  tap(action => console.log(action))
);`,
      output: this.collect(of('guardar').pipe(tap(() => undefined))),
    },
    {
      title: 'mergeMap',
      category: 'Flattening',
      description:
        'Convierte cada emision en un Observable interno y permite que todos corran en paralelo. Encaja cuando varias operaciones pueden convivir, como guardar varios elementos o lanzar cargas independientes.',
      code: `of('A', 'B').pipe(
  mergeMap(letter => of(\`\${letter}1\`, \`\${letter}2\`))
);`,
      output: this.collect(
        of('A', 'B').pipe(mergeMap(letter => of(`${letter}1`, `${letter}2`))),
      ),
    },
    {
      title: 'switchMap',
      category: 'Flattening',
      description:
        'Cancela la peticion o stream anterior cuando llega un nuevo valor. Es la opcion favorita para buscadores, autocompletados y pantallas donde solo importa la ultima intencion del usuario.',
      code: `of('angular', 'rxjs').pipe(
  switchMap(term => of(\`buscando: \${term}\`))
);`,
      output: this.collect(
        of('angular', 'rxjs').pipe(switchMap(term => of(`buscando: ${term}`))),
      ),
    },
    {
      title: 'combineLatest',
      category: 'Combinacion',
      description:
        'Combina varios streams y emite usando el ultimo valor conocido de cada uno. Va muy bien para construir modelos de vista desde filtros, usuario actual, permisos y datos remotos.',
      code: `combineLatest([
  of('usuario'),
  of('online')
]).pipe(
  map(([name, state]) => \`\${name}: \${state}\`)
);`,
      output: this.collect(
        combineLatest([of('usuario'), of('online')]).pipe(
          map(([name, state]) => `${name}: ${state}`),
        ),
      ),
    },
    {
      title: 'forkJoin',
      category: 'Combinacion',
      description:
        'Espera a que todos los Observables completen y emite una unica vez con el ultimo valor de cada uno. Encaja muy bien para cargar varios endpoints iniciales en paralelo, como usuario, permisos y configuracion. A diferencia de combineLatest, no emite cada vez que cambia uno: solo al final.',
      code: `forkJoin({
  user: of('Ada'),
  permissions: of('admin'),
  theme: of('dark')
}).pipe(
  map(result => \`\${result.user} - \${result.permissions} - \${result.theme}\`)
);`,
      output: this.collect(
        forkJoin({
          user: of('Ada'),
          permissions: of('admin'),
          theme: of('dark'),
        }).pipe(map(result => `${result.user} - ${result.permissions} - ${result.theme}`)),
      ),
    },
    {
      title: 'withLatestFrom',
      category: 'Combinacion',
      description:
        'Combina una emision principal con el ultimo valor de otro stream. Es util cuando una accion manda el ritmo, por ejemplo un click que necesita leer el usuario actual o los filtros activos.',
      code: `of('guardar').pipe(
  withLatestFrom(of('usuario-42')),
  map(([action, user]) => \`\${action} por \${user}\`)
);`,
      output: this.collect(
        of('guardar').pipe(
          withLatestFrom(of('usuario-42')),
          map(([action, user]) => `${action} por ${user}`),
        ),
      ),
    },
    {
      title: 'debounceTime + distinctUntilChanged',
      category: 'Busqueda',
      description:
        'debounceTime espera una pausa antes de emitir y distinctUntilChanged evita repetir el mismo valor seguido. Juntos reducen peticiones innecesarias en inputs de busqueda.',
      code: `from(['a', 'an', 'ang', 'ang']).pipe(
  debounceTime(300),
  distinctUntilChanged()
);`,
      output: ['ang'],
    },
    {
      title: 'startWith',
      category: 'Creacion',
      description:
        'Hace que un stream arranque con un valor inicial antes de emitir los valores reales. Viene muy bien para pintar estado inicial, filtros por defecto o lanzar una primera carga sin duplicar codigo.',
      code: `from(['datos cargados']).pipe(
  startWith('cargando...')
);`,
      output: this.collect(from(['datos cargados']).pipe(startWith('cargando...'))),
    },
    {
      title: 'catchError',
      category: 'Errores',
      description:
        'Intercepta errores y devuelve un Observable alternativo. Sin catchError, un error completa la cadena y la UI puede quedarse sin nuevas emisiones.',
      code: `throwError(() => new Error('Sin conexion')).pipe(
  catchError(() => of('Mostrando datos cacheados'))
);`,
      output: this.collect(
        throwError(() => new Error('Sin conexion')).pipe(
          catchError(() => of('Mostrando datos cacheados')),
        ),
      ),
    },
    {
      title: 'pairwise',
      category: 'Transformacion',
      description:
        'Agrupa cada valor con el anterior. Sirve para comparar cambios: ruta anterior contra ruta actual, valor previo de un formulario o diferencias entre estados.',
      code: `from([10, 15, 12]).pipe(
  pairwise(),
  map(([previous, current]) => current - previous)
);`,
      output: this.collect(
        from([10, 15, 12]).pipe(
          pairwise(),
          map(([previous, current]) => current - previous),
        ),
      ),
    },
    {
      title: 'scan',
      category: 'Estado',
      description:
        'Acumula estado a medida que llegan valores y emite cada paso intermedio. Es parecido a un reducer pequeno dentro de un stream.',
      code: `of(1, 2, 3).pipe(
  scan((total, value) => total + value, 0)
);`,
      output: this.collect(of(1, 2, 3).pipe(scan((total, value) => total + value, 0))),
    },
    {
      title: 'take',
      category: 'Control',
      description:
        'Toma un numero limitado de emisiones y completa. Es practico para leer un valor puntual, cerrar flujos cortos o evitar suscripciones largas.',
      code: `from(['primero', 'segundo', 'tercero']).pipe(
  take(2)
);`,
      output: this.collect(from(['primero', 'segundo', 'tercero']).pipe(take(2))),
    },
    {
      title: 'takeUntil',
      category: 'Control',
      description:
        'Mantiene una suscripcion viva hasta que otro Observable emite. Es comun para cancelar streams cuando se destruye un componente o cuando el usuario pulsa cancelar.',
      code: `from(['tick 1', 'tick 2', 'tick 3']).pipe(
  takeUntil(of('cancelar'))
);`,
      output: ['completa sin emitir porque cancelar llega primero'],
    },
    {
      title: 'reduce',
      category: 'Acumulacion',
      description:
        'Acumula todos los valores y emite un unico resultado al final. A diferencia de scan, no muestra estados intermedios: espera a que el stream complete.',
      code: `of(2, 4, 6).pipe(
  reduce((total, value) => total + value, 0)
);`,
      output: this.collect(of(2, 4, 6).pipe(reduce((total, value) => total + value, 0))),
    },
    {
      title: 'shareReplay',
      category: 'Utilidad',
      description:
        'Comparte una misma ejecucion del Observable y recuerda la ultima emision para nuevos suscriptores. Es muy usado para cachear una peticion HTTP y evitar repetirla por cada async pipe o componente.',
      code: `const user$ = of('Ada').pipe(
  tap(() => console.log('HTTP una sola vez')),
  shareReplay({ bufferSize: 1, refCount: true })
);`,
      output: this.collect(
        of('Ada').pipe(
          tap(() => undefined),
          shareReplay({ bufferSize: 1, refCount: true }),
        ),
      ),
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

  private collect(source$: Observable<unknown>): string[] {
    const values: string[] = [];

    source$.subscribe({
      next: value => values.push(String(value)),
      error: error => values.push(`Error: ${error.message}`),
    });

    return values;
  }
}
