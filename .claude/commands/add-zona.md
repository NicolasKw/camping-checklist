Agrega una nueva zona interactiva al mapa de Hogwarts. Argumento opcional: nombre de la zona en español (ej: `/add-zona Herbología`).

## Argumento recibido
$ARGUMENTS

## Instrucciones

Seguí estos pasos en orden:

### 1. Recopilar información

Si no se proporcionó un nombre en `$ARGUMENTS`, pedile al usuario:
- Nombre de la zona (español, ej: "Herbología")
- Emoji representativo
- Lista de 4-7 items a llevar (nombre + emoji cada uno)
- Color hex principal (sugerí uno temático si no sabe)

Si se proporcionó nombre en `$ARGUMENTS`, inferí el emoji y color temáticos y pedí solo los items.

### 2. Leer los archivos clave

Lee estos archivos para entender el estado actual:
- `src/data/campingData.ts` — IDs existentes para no colisionar
- `src/components/CampsiteMap.ts` — posiciones SVG ocupadas y zonas libres

Con la info del SVG, determiná el **bounding box disponible** para la nueva zona:
- Anotá x1, y1, x2, y2 y el centro sugerido cx, cy
- Las posiciones actualmente ocupadas están documentadas en los comentarios del SVG

### 3. Actualizar `src/data/campingData.ts`

Agregá al array `campingZones` un nuevo objeto:

```typescript
{
  id: 'nombre-lowercase-sin-tildes',
  name: 'Nombre visible',
  emoji: '🌿',
  color: '#hexcolor',
  glowColor: 'rgba(r, g, b, 0.7)',
  items: [
    { id: 'prefijo-item1', name: 'Nombre item', emoji: '🌱' },
    // ...
  ],
},
```

**Reglas para IDs:** solo minúsculas, números y guiones. Sin tildes ni ñ. ID de items: `{id-zona}-{palabra-clave}`.

### 4. Generar el SVG con el subagente svg-artist

Usá el Task tool para lanzar el subagente `svg-artist` con este prompt:

```
Generá el SVG para una nueva zona del mapa de Hogwarts con estos datos:

- Nombre: {nombre visible}
- ID: {id}
- Color hex: {color}
- Emoji: {emoji}
- Bounding box disponible: x1={x1}, y1={y1}, x2={x2}, y2={y2}, centro cx={cx}, cy={cy}
- Total de items: {n}

Leé src/components/CampsiteMap.ts para entender el estilo y confirmar que las coordenadas están libres.
```

Esperá el output del subagente. Será el bloque SVG completo.

### 5. Actualizar `src/components/CampsiteMap.ts`

Con el SVG que devolvió svg-artist, realizá 3 ediciones:

**A) Agregar filtro en `<defs>`** (después de los filtros existentes):
```svg
<filter id="glow{NombreCapitalizado}" x="-30%" y="-30%" width="160%" height="160%">
  <feDropShadow dx="0" dy="0" stdDeviation="8" flood-color="{color-hex}" flood-opacity="0.75"/>
</filter>
```

**B) Insertar el bloque SVG** devuelto por svg-artist antes de `<!-- ═══ DECORATIVE DETAILS ═══ -->`.

**C) Agregar al método `getFilterForZone()`:**
```typescript
{id}: 'glow{NombreCapitalizado}',
```

### 6. Verificar que compila

```bash
NODE=/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node
mkdir -p /tmp/node-dir && ln -sf $NODE /tmp/node-dir/node && export PATH="/tmp/node-dir:$PATH"
cd /Users/nicolaskw/Documents/ZalesMachine/Projects/test-claude-code
$NODE ./node_modules/.bin/tsc --noEmit
```

Si hay errores de TypeScript, corregílos antes de continuar.

### 7. Confirmar resultado

Mostrá al usuario:
- Nombre e ID de la zona creada
- Lista de items agregados
- Posición en el mapa (coordenadas aproximadas)
- Recordale que puede iniciar el dev server con `npm run dev` para verla
