import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, map, Observable, of, startWith, Subject, switchMap } from 'rxjs';
import { PRIMENG_MODULES } from '../../shared/primeng.imports';

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  thumbnail: string;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

interface HttpExample {
  title: string;
  method: string;
  endpoint: string;
  body: string;
  description: string;
  code: string;
}

interface HttpNote {
  title: string;
  body: string;
}

@Component({
  selector: 'app-codexhttp',
  imports: [CommonModule, PRIMENG_MODULES],
  templateUrl: './codexhttp.component.html',
  styleUrl: './codexhttp.component.scss',
})
export class CodexhttpComponent {
  private readonly http = inject(HttpClient);
  private readonly refreshProducts = new Subject<void>();

  readonly apiBaseUrl = 'https://dummyjson.com';
  readonly isLoading = signal(false);
  readonly isActionLoading = signal(false);
  readonly errorMessage = signal('');
  readonly selectedMethod = signal('GET');
  readonly actionResponse = signal('Pulsa una accion para ver aqui la respuesta JSON.');
  readonly fallbackProducts: Product[] = [
    {
      id: 1,
      title: 'Essence Mascara Lash Princess',
      description: 'Producto de ejemplo local para que la pantalla siga funcionando si la API no responde.',
      category: 'beauty',
      price: 9.99,
      rating: 4.94,
      thumbnail: '',
    },
    {
      id: 2,
      title: 'Eyeshadow Palette',
      description: 'Otro producto simulado. La app intenta cargar datos reales primero y usa esto como fallback.',
      category: 'beauty',
      price: 19.99,
      rating: 3.28,
      thumbnail: '',
    },
    {
      id: 3,
      title: 'Powder Canister',
      description: 'Fallback pensado para practicar estados de error sin romper la interfaz.',
      category: 'beauty',
      price: 14.99,
      rating: 3.82,
      thumbnail: '',
    },
  ];

  readonly requestLifecycle: HttpNote[] = [
    {
      title: '1. Preparar la peticion',
      body:
        'El frontend decide metodo, URL, parametros, cabeceras y body. En Angular conviene tipar la respuesta esperada para que el resto de la pantalla sepa que estructura va a recibir.',
    },
    {
      title: '2. Mostrar estado de carga',
      body:
        'Mientras la red responde, la UI debe comunicar que esta trabajando. Un loading claro evita dobles clicks, dudas del usuario y pantallas que parecen congeladas.',
    },
    {
      title: '3. Transformar datos',
      body:
        'La respuesta de una API rara vez es exactamente el modelo de la vista. Puedes usar map para extraer arrays, normalizar nombres, calcular campos o descartar datos que no necesitas.',
    },
    {
      title: '4. Gestionar errores',
      body:
        'Una peticion puede fallar por red, CORS, permisos, timeout o un error 500. La pantalla debe mostrar mensaje, permitir reintento y, si tiene sentido, usar un fallback.',
    },
  ];

  readonly methodGuide: HttpNote[] = [
    {
      title: 'GET',
      body:
        'Lee informacion. Debe ser seguro e idempotente: pedir el mismo recurso varias veces no deberia modificar nada.',
    },
    {
      title: 'POST',
      body:
        'Crea algo nuevo o ejecuta una accion que no encaja en una actualizacion simple. Normalmente envia body y la API devuelve el recurso creado.',
    },
    {
      title: 'PUT / PATCH',
      body:
        'PUT suele reemplazar un recurso completo. PATCH modifica solo algunos campos. En frontend, PATCH es habitual para ediciones parciales.',
    },
    {
      title: 'DELETE',
      body:
        'Solicita borrar un recurso. Muchas APIs devuelven 204 sin cuerpo; otras devuelven el objeto borrado o una confirmacion.',
    },
  ];

  readonly statusGuide: HttpNote[] = [
    {
      title: '2xx',
      body: 'Exito. 200 suele traer datos, 201 indica creado y 204 significa correcto pero sin contenido.',
    },
    {
      title: '4xx',
      body:
        'Error del cliente: datos invalidos, falta autenticacion, permisos insuficientes o recurso inexistente.',
    },
    {
      title: '5xx',
      body:
        'Error del servidor. El frontend no puede arreglarlo, pero si puede mostrar un mensaje claro y permitir reintentar.',
    },
  ];

  readonly products$: Observable<Product[]> = this.refreshProducts.pipe(
    startWith(undefined),
    switchMap(() => {
      this.isLoading.set(true);
      this.errorMessage.set('');

      return this.http
        .get<ProductsResponse>(`${this.apiBaseUrl}/products?limit=6&select=title,description,category,price,rating,thumbnail`)
        .pipe(
          map(response => response.products),
          catchError(() => {
            this.errorMessage.set(
              'No se pudo conectar con DummyJSON. Mostrando datos locales de respaldo.',
            );
            return of(this.fallbackProducts);
          }),
          finalize(() => this.isLoading.set(false)),
        );
    }),
  );

  readonly examples: HttpExample[] = [
    {
      title: 'Que es HttpClient',
      method: 'SETUP',
      endpoint: 'app.config.ts',
      body: 'No aplica. Es configuracion global de providers.',
      description:
        'HttpClient es el servicio de Angular para hablar con APIs HTTP. Devuelve Observables frios: la peticion no se ejecuta hasta que alguien se suscribe, por ejemplo el async pipe o un subscribe controlado. Eso permite componer transformaciones, cancelaciones y errores con RxJS.',
      code: `import { provideHttpClient } from '@angular/common/http';

export const appConfig = {
  providers: [provideHttpClient()]
};`,
    },
    {
      title: 'GET',
      method: 'GET',
      endpoint: 'https://dummyjson.com/products?limit=6&select=title,description,category,price,rating,thumbnail',
      body: 'No lleva body. Los filtros viajan en query params: limit y select.',
      description:
        'GET se usa para leer informacion. No deberia modificar datos en el servidor y normalmente se combina con parametros como limit, skip, search o select. En componentes, es buena practica contemplar loading, error y lista vacia.',
      code: `this.http.get<ProductsResponse>(
  'https://dummyjson.com/products?limit=6'
);`,
    },
    {
      title: 'POST',
      method: 'POST',
      endpoint: 'https://dummyjson.com/products/add',
      body: `{
  "title": "Producto Angular",
  "price": 99
}`,
      description:
        'POST crea un recurso nuevo o dispara una accion. Suele llevar un body JSON y cabeceras como Content-Type. DummyJSON lo simula y devuelve un objeto con id, perfecto para practicar sin backend propio.',
      code: `this.http.post<Product>(
  'https://dummyjson.com/products/add',
  { title: 'Producto Angular', price: 99 }
);`,
    },
    {
      title: 'PATCH',
      method: 'PATCH',
      endpoint: 'https://dummyjson.com/products/1',
      body: `{
  "price": 79
}`,
      description:
        'PATCH actualiza parcialmente un recurso. Es ideal cuando solo cambia un campo, por ejemplo precio, titulo o estado. Reduce payload y expresa que no quieres reemplazar todo el objeto.',
      code: `this.http.patch<Product>(
  'https://dummyjson.com/products/1',
  { price: 79 }
);`,
    },
    {
      title: 'DELETE',
      method: 'DELETE',
      endpoint: 'https://dummyjson.com/products/1',
      body: 'Normalmente no lleva body. La URL identifica el recurso que quieres borrar.',
      description:
        'DELETE solicita borrar un recurso. Antes de actualizar la UI conviene decidir si haras borrado optimista, esperaras confirmacion del servidor o mostraras un dialogo de confirmacion.',
      code: `this.http.delete(
  'https://dummyjson.com/products/1'
);`,
    },
    {
      title: 'Errores y fallback',
      method: 'GET + catchError',
      endpoint: 'Cualquier endpoint remoto que pueda fallar',
      body: 'No depende del body; depende del estado de red, permisos, CORS o respuesta del servidor.',
      description:
        'Una UI robusta no se queda en blanco si falla la red. catchError permite devolver un valor seguro, registrar el error y mostrar un mensaje claro. finalize es util para apagar loading tanto en exito como en error.',
      code: `this.http.get<ProductsResponse>(url).pipe(
  map(response => response.products),
  catchError(() => of([]))
);`,
    },
  ];

  reload(): void {
       console.log('tercera rama')
    this.refreshProducts.next();
    console.log('blabalbal')
  }

  runGet(): void {
    console.log('tercera rama')
    this.runRequest('GET', this.http.get<Product>(`${this.apiBaseUrl}/products/1`));
  }

  runPost(): void {
    this.runRequest(
      'POST',
      this.http.post<Product>(`${this.apiBaseUrl}/products/add`, {
        title: 'Producto creado desde Angular',
        price: 129,
      }),
    );
  }

  runPatch(): void {
    this.runRequest(
      'PATCH',
      this.http.patch<Product>(`${this.apiBaseUrl}/products/1`, {
        price: 79,
      }),
    );
  }

  runDelete(): void {
    this.runRequest('DELETE', this.http.delete(`${this.apiBaseUrl}/products/1`));
  }

  private runRequest(method: string, request$: Observable<unknown>): void {
    this.selectedMethod.set(method);
    this.isActionLoading.set(true);
    this.actionResponse.set('Ejecutando peticion...');

    request$
      .pipe(
        catchError(error =>
          of({
            offlineFallback: true,
            method,
            status: error.status,
            message:
              'La peticion no pudo completarse desde este entorno. Esta respuesta simula la forma que devolveria la API.',
            sample: this.getFallbackResponse(method),
          }),
        ),
        finalize(() => this.isActionLoading.set(false)),
      )
      .subscribe(response => {
        this.actionResponse.set(JSON.stringify(response, null, 2));
      });
  }

  private getFallbackResponse(method: string): unknown {
    const baseProduct = this.fallbackProducts[0];

    if (method === 'POST') {
      return { ...baseProduct, id: 195, title: 'Producto creado desde Angular' };
    }

    if (method === 'PATCH') {
      return { ...baseProduct, price: 79 };
    }

    if (method === 'DELETE') {
      return { ...baseProduct, isDeleted: true, deletedOn: new Date().toISOString() };
    }

    return baseProduct;
  }
}
