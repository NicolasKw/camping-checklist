Agrega un nuevo item a una zona existente del mapa. Uso: `/add-item [zona] [nombre del item]`

Ejemplos:
- `/add-item cocina Servilletas de tela 🧻`
- `/add-item botiquin Pinzas para garrapatas`
- `/add-item` (sin argumentos — preguntará interactivamente)

## Argumento recibido
$ARGUMENTS

## Instrucciones

### 1. Parsear argumentos

Del texto en `$ARGUMENTS` intentá extraer:
- **Zona**: primera palabra (ej: `cocina`, `carpa`, `botiquin`). También aceptá nombres completos como "El Caldero", "Tienda Mágica", etc.
- **Nombre del item**: el resto del texto
- **Emoji**: si hay un emoji al final, usalo; si no, inferí uno apropiado

Si `$ARGUMENTS` está vacío o incompleto, preguntale al usuario con opciones:
- Qué zona (mostrar la lista de las 7 zonas disponibles con sus nombres)
- Nombre del item
- Emoji (opcional, podés inferir uno)

### 2. Leer `src/data/campingData.ts`

Lee el archivo completo para:
- Confirmar que la zona existe
- Ver los IDs de items existentes en esa zona (para no colisionar)
- Entender el prefijo que usan los IDs en esa zona

### 3. Agregar el item

**Reglas para el ID:**
- Formato: `{id-zona}-{palabra-clave-del-item}`
- Solo minúsculas, sin tildes, sin ñ, sin espacios (usar guiones)
- Ejemplos: `cocina-servilletas`, `botiquin-pinzas`, `carpa-cuerda`
- Verificá que no exista ya ese ID en el array de la zona

Agregá el item al final del array `items` de la zona correspondiente:
```typescript
{ id: '{id-zona}-{clave}', name: 'Nombre visible del item', emoji: '🔧' },
```

### 4. Actualizar el badge en el SVG

El badge de cada zona muestra `checked/total` y se actualiza automáticamente en runtime desde `StateManager`, pero el **texto inicial** está hardcodeado en `CampsiteMap.ts`.

Buscá en `buildSVG()` el badge de la zona modificada:
```svg
<text text-anchor="middle" dy="4" class="zone-badge-text">0/{total-anterior}</text>
```
Actualizá el total: `0/{total-anterior + 1}`

### 5. Verificar que compila

```bash
NODE=/Applications/Cursor.app/Contents/Resources/app/resources/helpers/node
export PATH="/tmp/node-dir:$PATH"
cd /Users/nicolaskw/Documents/ZalesMachine/Projects/test-claude-code
$NODE ./node_modules/.bin/tsc --noEmit
```

### 6. Confirmar resultado

Mostrá al usuario:
- ✅ Zona modificada y su nuevo total de items
- El item agregado (ID, nombre, emoji)
- Recordale que el LocalStorage existente sigue siendo válido (los items nuevos arrancan sin marcar)
