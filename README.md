# Plan de Estudios Interactivo – Licenciatura en Sistemas de Información

**Objetivo:** construir y publicar un plan de estudios interactivo donde cada materia se desbloquea según sus correlativas, con diagrama limpio y flechas entre materias. Listo para GitHub Pages.

## 👀 Vista rápida
- Modo oscuro + acento verde azulado.
- Tarjetas por materia organizadas en **5 años x 2 semestres**.
- **Flechas SVG** para correlativas.
- Click en una materia ⇒ se marca **Aprobada** (persistencia en *localStorage*).
- **Buscar**, **Exportar/Importar** progreso (JSON).
- Sin dependencias, sólo **HTML + CSS + JS**.

## 📦 Contenido del ZIP
```
index.html
styles.css
script.js
README.md
```

## 🚀 Cómo publicar en GitHub Pages
1. Creá un repositorio (por ejemplo, `Plan-Sistemas-UCH`).
2. Subí estos 4 archivos a la **raíz** del repo.
3. En *Settings → Pages*, en **Build and deployment** elegí:
   - *Source:* Deploy from a branch
   - *Branch:* `main` (root)
4. Guardá. Tu sitio quedará disponible en unos segundos/minutos.

> Consejos:
> - Si tu repo ya existe, sólo arrastrá y soltá los archivos en la raíz.
> - Podés renombrar el repositorio a gusto; no hay rutas absolutas.

## ✏️ Cómo editar materias y correlativas
Los datos están dentro de `script.js`, en la constante `PLAN`. Cada ítem tiene:
```js
{
  code: 10,                      // número de materia
  name: "Programación II",       // nombre
  year: 1, semester: 2, order: 2,// ubicación en el diagrama
  prereq: [2]                    // correlativas por código (o "ALL" para requerir todas)
}
```
- **`year`**: 1..5
- **`semester`**: 1 ó 2
- **`order`**: posición vertical dentro de su columna
- **`prereq`**: lista de `code` de materias requeridas, o `"ALL"` (usado para la Tesina).

> ⚠️ *Importante:* Reconstruí el PLAN a partir del PDF provisto y criterios típicos de correlatividades para la carrera. Si tu plan oficial difiere, **ajustá la lista `PLAN`** (nombres, ubicaciones y `prereq`). El código está pensado para que editarlo sea simple.

## 🧭 Uso básico
- **Marcar aprobadas:** clic en la tarjeta.
- **Bloqueadas:** aparecen atenuadas; se desbloquean cuando completás sus correlativas.
- **Exportar:** guarda tu progreso como `progreso-plan.json`.
- **Importar:** restablece un JSON exportado.
- **Reiniciar:** borra el progreso del navegador.

## 🎨 Diseño
- Estilo limpio, esquinas redondeadas y sombras suaves.
- Flechas curvas con marcadores y color adaptado al estado (habilitada/bloqueada).
- Soporta **desktop y mobile** (layout responsivo).

## 🛠️ Desarrollo local (opcional)
Abrí `index.html` en tu navegador. No requiere servidor.

## 📄 Sobre los datos
Los nombres de materias y la estructura por años/semestres fueron tomados del PDF que compartiste. Algunas **correlativas** se infirieron cuando no estaban claras en el texto extraído; por eso puede que necesites ajustar pequeños detalles para que coincida 1:1 con tu plan oficial.

— Última generación: 2025-08-09


---

## ✅ Dejarlo listo con GitHub Actions (auto-deploy)

Este repo ya incluye:
- `.github/workflows/pages.yml` → flujo para desplegar automáticamente a **GitHub Pages** cuando hagas *push* a `main`.
- `.nojekyll` → evita que Jekyll interfiera con archivos/carpetas estáticos.
- `404.html` → página de error simple.

### Pasos
1. **Creá el repositorio** (por ejemplo, `Plan-Sistemas-UCH`) en tu cuenta.
2. **Subí** todo el contenido de esta carpeta a la rama `main` (arrastrando en GitHub o usando `git`).
3. Andá a **Settings → Pages** y en *Build and deployment* elegí **GitHub Actions** (si no aparece, elegí *Deploy from a branch*, rama `main`, carpeta `/root`).
4. Hacé un **commit** (aunque sea mínimo). El workflow **`Deploy to GitHub Pages`** va a correr y publicar el sitio.
5. La URL final queda en **Settings → Pages** (algo como `https://<tu-usuario>.github.io/Plan-Sistemas-UCH/`).

> Si preferís sin Actions, también funciona la opción *Deploy from a branch* con los mismos archivos.

— Actualizado: 2025-08-09
