Agrega una nueva zona interactiva al mapa de Hogwarts. Argumento opcional: nombre de la zona en español (ej: `/add-zona Herbología`).

## Argumento recibido
$ARGUMENTS

## Instrucciones

Sos un asistente especializado en este proyecto. Seguí estos pasos en orden:

### 1. Recopilar información

Si no se proporcionó un nombre en `$ARGUMENTS`, pedile al usuario:
- Nombre de la zona (español, ej: "Herbología")
- Emoji representativo
- Lista de 4-7 items a llevar (nombre + emoji cada uno)
- Color hex principal (sugerí uno temático si no sabe)

Si se proporcionó nombre en `$ARGUMENTS`, inferí el emoji y color temáticos y pedí solo los items.

### 2. Leer los archivos clave antes de editar

Lee estos archivos para entender el estado actual:
- `src/data/campingData.ts` — para ver IDs existentes y no colisionar
- `src/components/CampsiteMap.ts` — para ver posiciones SVG ocupadas y el patrón de cada zona

### 3. Actualizar `src/data/campingData.ts`

Agregá al array `campingZones` un nuevo objeto siguiendo exactamente esta estructura:

```typescript
{
  id: 'nombre-lowercase-sin-tildes',  // ej: 'herbologia'
  name: 'Nombre visible',
  emoji: '🌿',
  color: '#hexcolor',
  glowColor: 'rgba(r, g, b, 0.7)',    // versión semitransparente del color
  items: [
    { id: 'prefijo-item1', name: 'Nombre item', emoji: '🌱' },
    // ...
  ],
},
```

**Reglas para IDs:**
- El ID de zona: solo letras minúsculas, números y guiones. Sin tildes ni ñ.
- El ID de cada item: `{id-zona}-{palabra-clave}`, ej: `herbologia-guantes`
- Verificá que no existan IDs duplicados en el archivo

### 4. Actualizar `src/components/CampsiteMap.ts`

Necesitás modificar 3 partes del archivo:

**A) Agregar filtro SVG en `<defs>`** (dentro de `buildSVG()`, en el bloque de filtros existente):
```svg
<filter id="glow{NombreCapitalizado}" x="-30%" y="-30%" width="160%" height="160%">
  <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="{color-hex}" flood-opacity="0.75"/>
</filter>
```

**B) Agregar el grupo SVG de la zona** (dentro de `buildSVG()`, después de las otras zonas):

Elegí una posición libre en el viewBox 900×700. Las posiciones ya ocupadas aproximadamente son:
- Tienda Mágica: centro-superior (440, 120-290)
- El Caldero: centro (408-492, 360-440)
- Mesa del Festín: derecha-centro (592-760, 355-445)
- Baúl Encantado: izquierda-centro (155-290, 358-445)
- Baños Encantados: abajo-izquierda (128-250, 492-580)
- Bosque Prohibido: derecha (720-848, 285-480)
- Enfermería: abajo-derecha (594-710, 492-580)

Zonas disponibles: abajo-centro (380-520, 510-600) o arriba-izquierda (60-200, 320-430).

Seguí el patrón exacto de las zonas existentes:
```svg
<g id="zone-{id}" class="zone-area" tabindex="0" role="button"
   aria-label="{Nombre} — click para ver items" data-zone="{id}" data-filter="glow{NombreCapitalizado}">
  <g class="zone-fill-group">
    <!-- diseño SVG temático de la zona -->
    <!-- incluí class="zone-fill" en los elementos principales -->
  </g>
  <text x="{cx}" y="{y-label}" text-anchor="middle" class="zone-label"
        fill="{color}" font-size="13" font-weight="700" font-family="'Cinzel', serif"
        letter-spacing="0.04em">{emoji} {Nombre}</text>
  <g id="badge-{id}" transform="translate({x-badge}, {y-badge})">
    <circle r="16" class="zone-badge-circle" fill="{color}"/>
    <text text-anchor="middle" dy="4" class="zone-badge-text">0/{total-items}</text>
  </g>
</g>
```

**C) Agregar al método `getFilterForZone()`:**
```typescript
{id}: 'glow{NombreCapitalizado}',
```

### 5. Verificar que compila

Ejecutá:
```bash
NODE=/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node
export PATH="/tmp/node-dir:$PATH"  # (crear symlink si no existe: mkdir -p /tmp/node-dir && ln -sf $NODE /tmp/node-dir/node)
cd /Users/nicolaskw/Documents/ZalesMachine/Projects/test-claude-code
$NODE ./node_modules/.bin/tsc --noEmit
```

Si hay errores de TypeScript, corregílos antes de continuar.

### 6. Confirmar resultado

Mostrá al usuario:
- El nombre y ID de la zona creada
- La lista de items agregados
- La posición en el mapa (coordenadas aproximadas)
- Recordale que puede iniciar el dev server con `npm run dev` para verla
