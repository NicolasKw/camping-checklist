# Lista de Camping Interactiva

Aplicación web con mapa SVG interactivo de un campamento. El usuario hace hover/click sobre zonas para ver y checkear items a llevar.

## Stack

- **Vite + TypeScript** — bundler y tipado
- **SVG inline** — mapa interactivo top-down (viewBox 900×700)
- **CSS Custom Properties** — theming día/noche via `data-theme="night"` en `<html>`
- **LocalStorage** — persistencia de checkboxes y modo noche

## Comandos

```bash
npm run dev      # servidor local en localhost:5173
npm run build    # compilación de producción en dist/
npm run preview  # previsualizar el build
```

> Node.js no está en PATH global. Usar el binario de Cursor:
> `NODE=/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node`
> `export PATH="/tmp/node-dir:$PATH"` (crear symlink: `ln -sf $NODE /tmp/node-dir/node`)

## Estructura

```
src/
├── main.ts                  # Bootstrap: instancia todos los componentes y maneja reset/print
├── style.css                # Variables CSS (día/noche), layout, animaciones de llamas, print
├── types/index.ts           # Interfaces: CampingItem, CampingZone, AppState, StateListener
├── data/campingData.ts      # 7 zonas con sus items (datos estáticos)
├── state/StateManager.ts    # Fuente de verdad + LocalStorage + pub/sub
└── components/
    ├── CampsiteMap.ts       # SVG completo + hover/click + badges de progreso por zona
    ├── Sidebar.ts           # Panel deslizante + checklist + barra de progreso por zona
    ├── ProgressBar.ts       # Barra de progreso general en el header
    ├── DayNightToggle.ts    # Toggle modo día/noche (escribe data-theme en <html>)
    ├── FireAnimation.ts     # Control del glow del fogón en modo noche
    └── AmbientAnimations.ts # Pájaros animados con <animateMotion> SVG
```

## Zonas del campamento

| ID | Nombre | Items |
|---|---|---|
| `carpa` | Carpa | 6 items |
| `fogon` | Fogón | 6 items |
| `cocina` | Cocina / Mesa | 9 items |
| `almacenamiento` | Almacenamiento | 5 items |
| `higiene` | Higiene / Baño | 7 items |
| `senderos` | Senderos | 6 items |
| `botiquin` | Botiquín | 5 items |

## Flujo de datos

```
Acción del usuario → Componente → StateManager.mutate() → LocalStorage
                                                        → notify() → todos los suscriptores se actualizan
```

## Deploy

- **GitHub**: https://github.com/NicolasKw/camping-checklist
- **Vercel**: https://test-claude-code-mu.vercel.app
- CI/CD: cada `git push` a `main` redespliega automáticamente en Vercel
