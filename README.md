# Acampada en Hogwarts ⚡

Lista de camping interactiva con temática de Hogwarts. Mapa SVG artístico con zonas clickeables, checklist de items por zona, persistencia en LocalStorage y dos modos oscuros.

**Demo:** https://test-claude-code-mu.vercel.app

```bash
npm run dev      # localhost:5173
npm run build
npm run preview
```

---

## Stack

- **Vite + TypeScript** — bundler y tipado
- **SVG inline** — mapa ilustrado (viewBox 900×700)
- **CSS Custom Properties** — temas via `data-theme="night"` en `<html>`
- **LocalStorage** — persistencia de checkboxes y modo

---

## Este proyecto como laboratorio de Claude Code

Este repositorio fue construido íntegramente con **Claude Code** y sirve como proyecto de referencia para aprender sus características principales: skills, subagentes y hooks.

### Qué es Claude Code

Claude Code es la CLI oficial de Anthropic para interactuar con Claude en el contexto de un proyecto de código. Entiende la estructura del proyecto, edita archivos, corre comandos y puede orquestar agentes especializados.

---

## Skills (`/commands`)

Las skills son prompts reutilizables que el usuario invoca con `/nombre-skill`. Viven en `.claude/commands/` como archivos Markdown. Claude los ejecuta siguiendo las instrucciones del archivo.

**Ubicación:** `.claude/commands/`

### `/add-zona [nombre]`

Agrega una nueva zona interactiva al mapa. Si se pasa el nombre como argumento, infiere emoji y color temáticos. Internamente:

1. Lee `campingData.ts` y `CampsiteMap.ts` para entender el estado actual
2. Actualiza `campingData.ts` con la nueva zona e items
3. **Lanza el subagente `svg-artist`** para generar el bloque SVG
4. Inserta el SVG, el filtro glow y la entrada en `getFilterForZone()`
5. Verifica compilación con `tsc --noEmit`

### `/add-item [zona] [nombre]`

Agrega un item a una zona existente. Actualiza `campingData.ts` verificando que el ID no colisione.

**Diferencia clave con un subagente:** las skills las invoca el usuario directamente con `/`. Los subagentes los lanza Claude internamente como parte de una tarea más grande.

---

## Subagentes (`.claude/agents/`)

Los subagentes son agentes especializados con su propio system prompt y herramientas restringidas. Viven en `.claude/agents/` como archivos Markdown con frontmatter YAML.

**Ubicación:** `.claude/agents/`

**Cuándo se usan:** en modo autónomo (`claude --agent`). En conversación interactiva, se emulan lanzando `subagent_type: "general-purpose"` con el system prompt del agente embebido en el prompt del Task tool.

### `svg-artist`

Genera markup SVG artístico para zonas nuevas del mapa. Tiene acceso solo a `Read`, `Glob` y `Grep` — puede leer el proyecto para entender el estilo, pero no puede editar archivos. Su único output es el bloque SVG listo para insertar.

**Por qué es un subagente y no una skill:**
- Tiene conocimiento especializado propio (sistema de diseño SVG, paleta, capas)
- Puede correr en paralelo con otras tareas (ej: mientras `/add-zona` edita `campingData.ts`)
- Puede mejorar su system prompt independientemente sin tocar la skill
- Corre en su propio contexto limpio, sin contaminar la conversación principal

**Frontmatter de un agente:**
```yaml
---
name: svg-artist
description: Cuándo y cómo usar este agente (esto es lo que lee Claude para decidir si lanzarlo)
tools: Read, Glob, Grep
---
System prompt del agente...
```

---

## Hooks (`.claude/settings.json`)

Los hooks son comandos shell que se ejecutan automáticamente en respuesta a eventos del ciclo de vida de Claude. Se configuran en `.claude/settings.json` (proyecto) o `~/.claude/settings.json` (global).

Este proyecto no implementa hooks, pero estos serían los más útiles:

### Tipos de hooks disponibles

| Hook | Dispara cuando... |
|---|---|
| `PreToolUse` | Antes de que Claude use una herramienta |
| `PostToolUse` | Después de que Claude usa una herramienta |
| `Notification` | Claude envía una notificación |
| `Stop` | Claude termina de responder |
| `SubagentStop` | Un subagente termina |

### Hooks relevantes para este proyecto

**TypeScript auto-check** — `PostToolUse` sobre Edit/Write en archivos `.ts`:
```json
{
  "hooks": {
    "PostToolUse": [{
      "matcher": "Edit|Write",
      "hooks": [{ "type": "command", "command": "tsc --noEmit" }]
    }]
  }
}
```
Elimina la necesidad de correr `tsc --noEmit` manualmente al final de cada skill.

**Guard de IDs duplicados** — `PostToolUse` sobre ediciones a `campingData.ts`:
Corre un script que verifica que no haya IDs duplicados entre zonas ni entre items. Evita bugs silenciosos difíciles de rastrear.

**Backup automático del SVG** — `PreToolUse` sobre Edit en `CampsiteMap.ts`:
Antes de tocar el archivo SVG principal (el más crítico y difícil de regenerar), guarda una copia en `.claude/backups/`.

**Notificación al terminar** — `Stop`:
Dispara una notificación de sistema (`osascript` en macOS) cuando Claude termina una tarea larga. Útil para saber cuándo volver a mirar sin monitorear constantemente.

---

## Zonas del mapa

| ID | Nombre | Emoji | Items |
|---|---|---|---|
| `carpa` | Tienda Mágica | 🏕️ | 6 |
| `fogon` | El Caldero | 🧪 | 6 |
| `cocina` | Mesa del Festín | 🍖 | 9 |
| `almacenamiento` | Baúl Encantado | 🧳 | 5 |
| `higiene` | Baños Encantados | 🛁 | 7 |
| `senderos` | Bosque Prohibido | 🌲 | 6 |
| `botiquin` | Enfermería de Campo | ⚕️ | 5 |
| `camara` | Cámara Secreta | 🐍 | 6 |
| `quidditch` | Campo de Quidditch | 🧹 | 6 |

Las últimas dos zonas (`camara` y `quidditch`) fueron agregadas durante las sesiones de aprendizaje usando `/add-zona` con el subagente `svg-artist`.

---

## Estructura del proyecto

```
.claude/
├── agents/
│   └── svg-artist.md        # Subagente: genera SVG artístico para zonas
└── commands/
    ├── add-zona.md           # Skill: agrega zona al mapa (usa svg-artist)
    └── add-item.md           # Skill: agrega item a zona existente

src/
├── main.ts
├── style.css
├── types/index.ts
├── data/campingData.ts       # Zonas e items
├── state/StateManager.ts
└── components/
    ├── CampsiteMap.ts        # SVG del mapa + lógica de zonas
    ├── Sidebar.ts
    ├── ProgressBar.ts
    ├── DayNightToggle.ts
    ├── FireAnimation.ts
    └── AmbientAnimations.ts
```
