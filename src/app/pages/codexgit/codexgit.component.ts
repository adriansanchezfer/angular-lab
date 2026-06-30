import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PRIMENG_MODULES } from '../../shared/primeng.imports';

interface GitCommand {
  title: string;
  category: string;
  description: string;
  command: string;
  example: string;
  teamTip: string;
}

interface GitFlowStep {
  title: string;
  description: string;
  command: string;
}

interface VsCodeConflictStep {
  title: string;
  description: string;
  action: string;
}

interface SecondaryGitCommand {
  title: string;
  when: string;
  command: string;
  caution: string;
}

@Component({
  selector: 'app-codexgit',
  imports: [CommonModule, PRIMENG_MODULES],
  templateUrl: './codexgit.component.html',
  styleUrl: './codexgit.component.scss',
})
export class CodexgitComponent {
  readonly selectedCategory = signal('Todos');

  readonly teamFlow: GitFlowStep[] = [
    {
      title: '1. Actualiza tu rama bassee',
      description:
        'Antes de empezar, actualiza main y comprueba que tu rama parte del mismo punto que el resto del equipo.',
      command: `git checkout main
git pull origin main`,
    },
    {
      title: '2. Crea una rama pequena',
      description:
        'Una rama debe representar una tarea concreta: bugfix, feature o refactor. Ramas pequenas se revisan mejor y se integran antes.',
      command: `git checkout -b feature/login-form`,
    },
    {
      title: '3. Haz commits con intencion',
      description:
        'Agrupa cambios relacionados. Un commit debe poder leerse como una decision: que cambia y por que.',
      command: `git add src/app/login
git commit -m "feat: add login form validation"`,
    },
    {
      title: '4. Sincroniza antes de abrir PR',
      description:
        'Mezcla main en tu rama para revisar conflictos localmente y trabajar con el mismo flujo que usa el equipo.',
      command: `git fetch origin
git merge origin/main`,
    },
    {
      title: '5. Sube y abre Pull Request',
      description:
        'El PR es el punto de conversacion: explica contexto, pruebas realizadas y riesgos. No lo uses solo como tramite.',
      command: `git push -u origin feature/login-form`,
    },
  ];

  readonly vsCodeConflictSteps: VsCodeConflictStep[] = [
    {
      title: '1. Provoca o detecta el conflicto',
      description:
        'Normalmente aparece al hacer merge o pull. Git se detiene y VS Code marca los archivos conflictivos en Source Control.',
      action: `git fetch origin
git merge origin/main`,
    },
    {
      title: '2. Abre el archivo en conflicto',
      description:
        'En VS Code veras bloques con cambios enfrentados. Current Change suele ser tu version local; Incoming Change suele ser la version que viene de la rama que estas integrando.',
      action: 'Source Control -> Merge Changes -> abrir archivo',
    },
    {
      title: '3. Elige una opcion',
      description:
        'Puedes aceptar Current, Incoming o Both. Si ninguna opcion sirve, edita manualmente el resultado final y deja el archivo como debe quedar realmente.',
      action: 'Accept Current | Accept Incoming | Accept Both | Compare Changes',
    },
    {
      title: '4. Comprueba que no quedan marcas',
      description:
        'Antes de continuar, elimina los marcadores <<<<<<<, ======= y >>>>>>>. Si quedan, el archivo sigue roto aunque visualmente parezca casi resuelto.',
      action: 'Buscar en el archivo: <<<<<<<',
    },
    {
      title: '5. Marca como resuelto',
      description:
        'Cuando el archivo ya compila y representa la decision correcta, preparalo con git add. Eso le dice a Git que el conflicto esta resuelto.',
      action: 'git add src/app/products/product.service.ts',
    },
    {
      title: '6. Continua la operacion',
      description:
        'En un merge, despues de resolver y hacer git add, confirma el commit de merge. Despues ejecuta tests o build antes de subir.',
      action: `git commit
npm run build -- --configuration development`,
    },
  ];

  readonly secondaryCommands: SecondaryGitCommand[] = [
    {
      title: 'git commit --amend',
      when:
        'Para corregir el ultimo commit: cambiar el mensaje o anadir un archivo que se te olvido incluir.',
      command: `git add src/app/products/product.service.ts
git commit --amend`,
      caution:
        'Usalo sobre commits locales. Si el commit ya esta compartido, estas reescribiendo historial y puede afectar a otras personas.',
    },
    {
      title: 'git squash',
      when:
        'Para juntar varios commits pequenos en uno mas claro antes de abrir una PR o dejar una historia mas facil de revisar.',
      command: `git rebase -i HEAD~3
# marcar commits como squash o fixup`,
      caution:
        'Aunque tu flujo diario sea con merge, el squash se usa para limpiar tu propia rama local antes de compartirla o cuando la plataforma hace squash merge.',
    },
    {
      title: 'git cherry-pick',
      when:
        'Para traer un commit concreto de otra rama sin mezclar toda la rama completa.',
      command: `git cherry-pick a1b2c3d`,
      caution:
        'Usalo con cuidado: duplica el cambio en otro punto del historial y puede generar conflictos si despues se integra la rama original.',
    },
    {
      title: 'git tag',
      when:
        'Para marcar una version concreta, por ejemplo una release o un punto estable antes de desplegar.',
      command: `git tag v1.4.0
git push origin v1.4.0`,
      caution:
        'No lo confundas con una rama: un tag apunta a un commit fijo y normalmente no se mueve.',
    },
    {
      title: 'git blame',
      when:
        'Para investigar que commit modifico una linea y encontrar contexto antes de tocar codigo delicado.',
      command: `git blame src/app/products/product.service.ts`,
      caution:
        'No es para buscar culpables. Es para encontrar historia, PRs y decisiones previas.',
    },
    {
      title: 'git revert',
      when:
        'Para deshacer un commit que ya esta compartido creando otro commit inverso.',
      command: `git revert a1b2c3d`,
      caution:
        'En ramas compartidas suele ser mas seguro que borrar historial, porque deja trazabilidad.',
    },
  ];

  readonly commands: GitCommand[] = [
    {
      title: 'git status',
      category: 'Diario',
      description:
        'Muestra en que rama estas, que archivos han cambiado y que hay preparado para commit. Es el comando que conviene ejecutar antes de casi cualquier decision.',
      command: 'git status',
      example: `git status --short`,
      teamTip: 'Usalo antes de cambiar de rama, antes de commitear y antes de pedir ayuda.',
    },
    {
      title: 'git branch',
      category: 'Ramas',
      description:
        'Lista ramas locales y ayuda a saber donde estas trabajando. En equipo, cada tarea suele vivir en una rama separada.',
      command: 'git branch',
      example: `git branch
git branch -a`,
      teamTip: 'Nombra ramas por intencion: feature/cart, fix/login-error, chore/update-deps.',
    },
    {
      title: 'git checkout / switch',
      category: 'Ramas',
      description:
        'Cambia de rama o crea una nueva. switch es mas moderno y explicito; checkout sigue siendo comun en muchos equipos.',
      command: 'git switch',
      example: `git switch main
git switch -c feature/product-filter`,
      teamTip: 'Cambia de rama con el working tree limpio para no arrastrar cambios sin querer.',
    },
    {
      title: 'git add',
      category: 'Commits',
      description:
        'Prepara archivos para el proximo commit. No tienes que meter todo: puedes seleccionar solo lo que pertenece a una misma idea.',
      command: 'git add',
      example: `git add src/app/products
git add -p`,
      teamTip: 'git add -p permite construir commits limpios por partes, muy util en revisiones.',
    },
    {
      title: 'git commit',
      category: 'Commits',
      description:
        'Guarda una instantanea local de los cambios preparados. Un buen mensaje ayuda al equipo a entender el historial sin abrir todos los diffs.',
      command: 'git commit',
      example: `git commit -m "fix: handle empty products response"`,
      teamTip: 'Prefiere mensajes concretos: feat, fix, refactor, test, docs, chore.',
    },
    {
      title: 'git diff',
      category: 'Revision',
      description:
        'Permite revisar exactamente que has cambiado antes de commitear. Es tu primera code review personal.',
      command: 'git diff',
      example: `git diff
git diff --staged`,
      teamTip: 'Ejecutalo antes del commit para evitar logs, cambios accidentales o archivos de prueba.',
    },
    {
      title: 'git fetch',
      category: 'Sincronizacion',
      description:
        'Descarga informacion del remoto sin mezclarla en tu rama. Es seguro para inspeccionar que ha cambiado fuera.',
      command: 'git fetch',
      example: `git fetch origin
git log --oneline HEAD..origin/main`,
      teamTip: 'fetch es ideal antes de merge o comparar tu rama con main.',
    },
    {
      title: 'git pull',
      category: 'Sincronizacion',
      description:
        'Trae cambios remotos y los integra en tu rama. En un equipo que trabaja con merge, es la forma habitual de actualizar la rama base.',
      command: 'git pull',
      example: `git switch main
git pull origin main`,
      teamTip: 'Haz pull con el working tree limpio para separar cambios del equipo de tus cambios locales.',
    },
    {
      title: 'git merge',
      category: 'Integracion',
      description:
        'Integra otra rama creando un commit de merge si hace falta. Es util cuando el equipo quiere preservar el punto exacto de integracion.',
      command: 'git merge',
      example: `git switch main
git merge feature/product-filter`,
      teamTip: 'En muchos equipos el merge final ocurre desde la plataforma de PR, no en local.',
    },
    {
      title: 'git push',
      category: 'Remoto',
      description:
        'Sube tus commits al remoto para compartirlos, abrir PR o actualizar una rama existente.',
      command: 'git push',
      example: `git push -u origin feature/product-filter
git push`,
      teamTip: 'Evita forzar pushes en ramas compartidas. Si algo no sube, primero revisa que ha cambiado en remoto.',
    },
    {
      title: 'git log',
      category: 'Revision',
      description:
        'Muestra el historial de commits. Ayuda a entender que entro, cuando y en que orden.',
      command: 'git log',
      example: `git log --oneline --graph --decorate --all`,
      teamTip: 'Muy util para explicar ramas, revisar PRs largos o detectar divergencias.',
    },
    {
      title: 'git stash',
      category: 'Rescate',
      description:
        'Guarda temporalmente cambios sin commitear. Sirve para cambiar de rama o actualizar main sin perder trabajo local.',
      command: 'git stash',
      example: `git stash push -m "wip product filters"
git stash pop`,
      teamTip: 'No uses stash como almacen permanente; si importa, haz una rama o un commit WIP.',
    },
    {
      title: 'git restore',
      category: 'Rescate',
      description:
        'Descarta cambios locales o saca archivos del staging. Es potente, asi que conviene revisar status y diff antes.',
      command: 'git restore',
      example: `git restore src/app/app.component.ts
git restore --staged src/app/app.component.ts`,
      teamTip: 'Antes de descartar, confirma que no estas borrando trabajo de otra persona.',
    },
    {
      title: 'Resolver conflictos',
      category: 'Conflictos',
      description:
        'Un conflicto aparece cuando Git no puede combinar cambios automaticamente. Hay que abrir el archivo, entender ambas versiones, construir el resultado correcto y marcarlo como resuelto.',
      command: 'git status',
      example: `git status
# editar archivos con <<<<<<< ======= >>>>>>>
git add archivo-resuelto.ts
git commit`,
      teamTip: 'En conflictos de negocio, habla con quien toco la otra parte antes de elegir a ciegas. Resolver no es elegir tu cambio: es dejar el codigo correcto.',
    },
  ];

  readonly categories = computed(() => [
    'Todos',
    ...Array.from(new Set(this.commands.map(command => command.category))),
  ]);

  readonly filteredCommands = computed(() => {
    const category = this.selectedCategory();

    return category === 'Todos'
      ? this.commands
      : this.commands.filter(command => command.category === category);
  });

  selectCategory(category: string): void {
    this.selectedCategory.set(category);
  }
}
