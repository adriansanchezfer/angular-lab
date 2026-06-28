import { Component, computed, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PRIMENG_MODULES } from '../../shared/primeng.imports';

interface SignalExample {
  title: string;
  description: string;
  code: string;
}

interface SignalConcept {
  name: string;
  useCase: string;
}

interface LearningNote {
  title: string;
  body: string;
}

interface Task {
  id: number;
  title: string;
  done: boolean;
}

@Component({
  selector: 'app-codexsignals',
  imports: [CommonModule, FormsModule, PRIMENG_MODULES],
  templateUrl: './codexsignals.component.html',
  styleUrl: './codexsignals.component.scss',
})
export class CodexsignalsComponent {
  readonly counter = signal(0);
  readonly doubleCounter = computed(() => this.counter() * 2);
  readonly isEven = computed(() => this.counter() % 2 === 0);
  readonly effectMessages = signal<string[]>([]);

  readonly tasks = signal<Task[]>([
    { id: 1, title: 'Leer un signal con count()', done: true },
    { id: 2, title: 'Crear un computed derivado', done: false },
    { id: 3, title: 'Actualizar estado con update()', done: false },
  ]);

  readonly pendingTasks = computed(() => this.tasks().filter(task => !task.done));
  readonly completedTasks = computed(() => this.tasks().filter(task => task.done));
  readonly progress = computed(() => {
    const total = this.tasks().length;

    return total === 0 ? 0 : Math.round((this.completedTasks().length / total) * 100);
  });

  readonly examples: SignalExample[] = [
    {
      title: 'signal',
      description:
        'Guarda estado reactivo local. Para leerlo se llama como funcion y para modificarlo se usa set o update. Es ideal para estado de componente que cambia por interaccion del usuario.',
      code: `const count = signal(0);

count.set(3);
count.update(value => value + 1);
console.log(count());`,
    },
    {
      title: 'computed',
      description:
        'Deriva un valor a partir de otros signals. Angular memoriza el resultado y solo lo recalcula cuando cambian sus dependencias, evitando calculos repetidos en el template.',
      code: `const count = signal(2);
const double = computed(() => count() * 2);

console.log(double());`,
    },
    {
      title: 'effect',
      description:
        'Ejecuta una reaccion cuando cambian los signals que se leen dentro del callback. Conviene usarlo para sincronizar con APIs externas, logs o almacenamiento, no para encadenar reglas de negocio complejas.',
      code: `effect(() => {
  console.log('El contador vale', count());
});`,
    },
    {
      title: 'update con arrays',
      description:
        'Cuando el signal contiene arrays u objetos, update ayuda a crear una nueva referencia. Eso mantiene el cambio explicito y evita mutaciones silenciosas dificiles de rastrear.',
      code: `tasks.update(items =>
  items.map(task =>
    task.id === id ? { ...task, done: !task.done } : task
  )
);`,
    },
  ];

  readonly concepts: SignalConcept[] = [
    {
      name: 'signal()',
      useCase:
        'Estado editable: contador, formulario ligero, filtros, panel abierto o seleccion actual. Si el valor cambia por una accion del usuario o por una respuesta puntual, suele encajar bien aqui.',
    },
    {
      name: 'computed()',
      useCase:
        'Estado derivado: totales, progreso, listas filtradas o textos que dependen de otros valores. No deberias guardarlo a mano si puede calcularse desde signals existentes.',
    },
    {
      name: 'effect()',
      useCase:
        'Puente con el exterior: guardar en localStorage, registrar cambios o llamar codigo no reactivo. Usalo con moderacion; si estas calculando datos para la vista, probablemente necesitas computed.',
    },
  ];

  readonly mentalModel: LearningNote[] = [
    {
      title: 'Un signal es una celda observable',
      body:
        'Piensa en un signal como una celda de una hoja de calculo. Cuando lees counter(), Angular registra que esa parte de la vista depende de counter. Cuando haces counter.set(...) o counter.update(...), Angular sabe exactamente que dependencias deben recalcularse.',
    },
    {
      title: 'Las dependencias se descubren al leer',
      body:
        'No declaras manualmente de que depende un computed. Angular lo descubre ejecutando la funcion y observando que signals se leen dentro. Si un computed lee counter() y tasks(), se recalcula cuando cambia cualquiera de los dos.',
    },
    {
      title: 'Menos suscripciones manuales',
      body:
        'Signals no sustituyen todo RxJS, pero si reducen mucho el estado local con subscribe/unsubscribe. Para eventos continuos o HTTP complejo RxJS sigue siendo excelente; para pintar estado de componente, signals suelen ser mas directos.',
    },
  ];

  readonly commonMistakes: LearningNote[] = [
    {
      title: 'Mutar arrays u objetos directamente',
      body:
        'Evita tasks().push(...). Aunque el array cambie internamente, el signal conserva la misma referencia y el cambio queda poco claro. Prefiere update con map, filter o spread para devolver una nueva referencia.',
    },
    {
      title: 'Usar effect para derivar estado',
      body:
        'Si quieres calcular total, filtrados o textos para la UI, usa computed. effect es para salir del sistema reactivo, por ejemplo guardar en storage o informar a una libreria externa.',
    },
    {
      title: 'Guardar estado duplicado',
      body:
        'Si tienes tasks y tambien pendingTasks como signal editable, puedes acabar con datos incoherentes. Mejor guarda la fuente de verdad y deriva el resto con computed.',
    },
  ];

  constructor() {
    effect(() => {
      const message = `effect ejecutado con contador ${this.counter()}`;
      this.effectMessages.update(messages => [message, ...messages].slice(0, 4));
    });
  }

  increment(): void {
    this.counter.update(value => value + 1);
  }

  decrement(): void {
    this.counter.update(value => value - 1);
  }

  reset(): void {
    this.counter.set(0);
  }

  toggleTask(id: number): void {
    this.tasks.update(tasks =>
      tasks.map(task => (task.id === id ? { ...task, done: !task.done } : task)),
    );
  }
}
