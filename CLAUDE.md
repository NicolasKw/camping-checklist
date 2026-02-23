# Acampada en Hogwarts ⚡

Lista de camping interactiva con temática de Hogwarts para adultos. Mapa SVG artístico con castillo, Lago Negro y Bosque Prohibido. El usuario hace hover/click sobre las zonas mágicas para ver y checkear items a llevar.

## Stack

- **Vite + TypeScript** — bundler y tipado
- **SVG inline** — mapa ilustrado (viewBox 900×700)
- **CSS Custom Properties** — dos modos oscuros via `data-theme="night"` en `<html>`
- **LocalStorage** — persistencia de checkboxes y modo
- **Google Fonts** — Cinzel / Cinzel Decorative (cargadas en `index.html`)

## Comandos

```bash
npm run dev      # servidor local en localhost:5173
npm run build    # compilación de producción en dist/
npm run preview  # previsualizar el build
```

> Node.js no está en PATH global. Usar el binario de Cursor:
> ```bash
> NODE=/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node
> ln -sf $NODE /tmp/node-dir/node && export PATH="/tmp/node-dir:$PATH"
> cd /Users/nicolaskw/Documents/ZalesMachine/Projects/test-claude-code
> $NODE /tmp/npm-bootstrap/bin/npm-cli.js run dev
> ```

## Estructura

```
src/
├── main.ts                  # Bootstrap: instancia componentes, maneja reset/print
├── style.css                # Paleta oscura dorada, fuentes Cinzel, animaciones llamas mágicas
├── types/index.ts           # Interfaces: CampingItem, CampingZone, AppState, StateListener
├── data/campingData.ts      # 7 zonas con nombres HP y items prácticos para adultos
├── state/StateManager.ts    # Fuente de verdad + LocalStorage + pub/sub
└── components/
    ├── CampsiteMap.ts       # SVG Hogwarts completo + hover/click + badges de progreso
    ├── Sidebar.ts           # Panel deslizante + checklist + barra de progreso por zona
    ├── ProgressBar.ts       # Barra de progreso general en el header (dorada)
    ├── DayNightToggle.ts    # Toggle 🕯️/🌑 velas vs medianoche mágica
    ├── FireAnimation.ts     # Glow púrpura del caldero en modo noche
    └── AmbientAnimations.ts # Búhos/pájaros animados con <animateMotion> SVG
```

## Zonas del mapa

| ID | Nombre | Emoji | Items | Color acento |
|---|---|---|---|---|
| `carpa` | Tienda Mágica | 🏕️ | 6 | Rojo Gryffindor + oro |
| `fogon` | El Caldero | 🧪 | 6 | Púrpura mágico |
| `cocina` | Mesa del Festín | 🍖 | 9 | Ámbar dorado |
| `almacenamiento` | Baúl Encantado | 🧳 | 5 | Oro con herrajes |
| `higiene` | Baños Encantados | 🛁 | 7 | Azul Ravenclaw |
| `senderos` | Bosque Prohibido | 🌲 | 6 | Verde oscuro |
| `botiquin` | Enfermería de Campo | ⚕️ | 5 | Verde esmeralda |

## Paleta visual

- **Fondo**: `#09061a` (modo velas) / `#040108` (medianoche)
- **Acento oro**: `#c9a84c` — bordes, badges completos, título shimmer
- **Texto**: `#e8d5a0` (pergamino)
- **Llamas del caldero**: púrpura `#7b00ff`, teal `#4ecdc4`, verde `#00cc66`
- **Toggle**: 🕯️ (velas encendidas) / 🌑 (medianoche mágica)
- **Badge completo**: se pone dorado `#c9a84c`

## Elementos SVG del mapa

- **Castillo de Hogwarts** — silueta con 5 torres, almenas, ventanas ámbar, estandarte de Gryffindor
- **Lago Negro** — elipse oscura con reflejo de luna y texto "Lago Negro"
- **Bosque Prohibido** — árboles retorcidos, hongos fosforescentes, ojos brillando en la oscuridad
- **Caminos de adoquines** — trazos con dasharray + marcadores rúnicos (ᚱ ᚹ ᚠ)
- **Orbes mágicos** — 3 círculos flotantes animados alrededor del caldero (púrpura, teal, verde)
- **Estrellas** — 30 estrellas con animación twinkle individual (CSS `--tw-dur` / `--tw-delay`)

## Flujo de datos

```
Acción del usuario → Componente → StateManager.mutate() → LocalStorage
                                                        → notify() → todos los suscriptores
```

## Deploy

- **GitHub**: https://github.com/NicolasKw/camping-checklist
- **Vercel**: https://test-claude-code-mu.vercel.app
- CI/CD: cada `git push` a `main` redespliega automáticamente en Vercel
