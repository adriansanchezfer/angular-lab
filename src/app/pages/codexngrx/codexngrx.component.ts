import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES } from '../../shared/primeng.imports';

interface NgrxExample {
  title: string;
  description: string;
  code: string;
}

@Component({
  selector: 'app-codexngrx',
  imports: [CommonModule, PRIMENG_MODULES],
  templateUrl: './codexngrx.component.html',
  styleUrl: './codexngrx.component.scss',
})
export class CodexngrxComponent {
  readonly selectedTitle = signal('Action');

  readonly flow = [
    'Componente despacha una Action',
    'Reducer calcula el nuevo State',
    'Selector lee una parte del State',
    'Effect ejecuta trabajo async y despacha otra Action',
  ];

  readonly examples: NgrxExample[] = [
    {
      title: 'Action',
      description:
        'Una Action es un evento con nombre. No dice como cambiar el estado; solo declara que algo ocurrio: el usuario pulso un boton, empezo una carga, llegaron datos o fallo una peticion.',
      code: `import { createAction, props } from '@ngrx/store';

export const loadPosts = createAction('[Posts] Load');
export const loadPostsSuccess = createAction(
  '[Posts] Load Success',
  props<{ posts: Post[] }>()
);`,
    },
    {
      title: 'State',
      description:
        'El State es la fotografia de una parte de la aplicacion. Conviene que sea serializable, explicito y pequeno: datos, flags de carga, errores y filtros que realmente necesitan compartirse.',
      code: `export interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null
};`,
    },
    {
      title: 'Reducer',
      description:
        'El Reducer es una funcion pura: recibe el estado anterior y una Action, y devuelve el siguiente estado. No llama APIs, no navega, no muta objetos; solo calcula.',
      code: `export const postsReducer = createReducer(
  initialState,
  on(loadPosts, state => ({ ...state, loading: true })),
  on(loadPostsSuccess, (state, { posts }) => ({
    ...state,
    posts,
    loading: false
  }))
);`,
    },
    {
      title: 'Selector',
      description:
        'Los Selectors son consultas reutilizables sobre el Store. Evitan duplicar filtros en componentes y permiten derivar datos, como elementos visibles, totales o estados de pantalla.',
      code: `export const selectPostsState =
  createFeatureSelector<PostsState>('posts');

export const selectPosts = createSelector(
  selectPostsState,
  state => state.posts
);`,
    },
    {
      title: 'Effect',
      description:
        'Los Effects son el lugar para efectos secundarios: HTTP, localStorage, router o analytics. Escuchan Actions, hacen trabajo async y normalmente devuelven nuevas Actions.',
      code: `loadPosts$ = createEffect(() =>
  this.actions$.pipe(
    ofType(loadPosts),
    switchMap(() =>
      this.http.get<Post[]>('/api/posts').pipe(
        map(posts => loadPostsSuccess({ posts }))
      )
    )
  )
);`,
    },
    {
      title: 'Uso en componente',
      description:
        'El componente se mantiene delgado: selecciona datos del Store y despacha eventos. Asi no necesita saber como se cargan los datos ni como se actualiza internamente el estado.',
      code: `readonly posts$ = this.store.select(selectPosts);

ngOnInit(): void {
  this.store.dispatch(loadPosts());
}`,
    },
  ];

  readonly activeExample = computed(() => {
    return this.examples.find(example => example.title === this.selectedTitle()) ?? this.examples[0];
  });

  selectExample(title: string): void {
    this.selectedTitle.set(title);
  }
}
