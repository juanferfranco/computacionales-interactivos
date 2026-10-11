# Sistemas computacionales · Interactivos

Colección de animaciones didácticas. Cada recurso tiene una dirección propia dentro del mismo sitio y se puede reutilizar entre cursos y semestres.

## Vista previa

Requiere Node.js 22 o posterior. No tiene dependencias npm externas.

```sh
npm run dev
```

El comando muestra la dirección local de la colección. Detén el servidor con Ctrl+C y vuelve a ejecutarlo después de editar.

```sh
npm run check    # Validar catálogo, archivos y scripts
npm run build    # Generar el sitio en dist/
npm run preview  # Servir la última construcción
```

## Recursos

- Cómo OpenGL dibuja un triángulo.
- De los datos al dibujo: vértices, atributos, VBO y VAO.
- Cómo OpenGL mueve y colorea un triángulo.
- Del mouse al framebuffer: CPU, RAM, GPU y VRAM.

## Añadir una animación

```sh
npm run new:animation -- --id hilos --topic concurrencia --title "Procesos e hilos" --unit 8
```

El comando crea una carpeta en `src/animations/` y una ficha en `catalog.json`, con `published: false`. Completa la explicación visual, sustituye los marcadores `TODO_ANIMATION` y añade la descripción y los conceptos a la ficha. Cambia `published` a `true` cuando el recurso esté listo y comprueba el resultado con `npm run dev`.

Para añadir otro tema, registra su identificador, título y descripción en `topics` dentro de `catalog.json`. Los borradores y los temas sin recursos publicados no aparecen en el sitio.

Usa identificadores estables, en minúsculas y con guiones. Conserva las direcciones publicadas para mantener los enlaces desde los cursos. El encabezado común y el tema se añaden durante la construcción.

## Estructura

```text
catalog.json          Catálogo y estado de publicación de los recursos
site.config.json      Identidad y ruta de publicación
src/animations/       Recursos organizados por tema y concepto
site/                 Portada y estilos compartidos
templates/            Plantilla para nuevas animaciones
scripts/              Herramientas de mantenimiento y vista previa
.github/workflows/    Construcción y publicación
```

Edita los archivos de origen. `dist/` se genera al construir y no se guarda en Git.

## GitHub Pages

Configura la fuente de Pages como **GitHub Actions**. El workflow valida y construye cada cambio; los pushes a `main` publican el sitio y los pull requests solo ejecutan la construcción.

Si cambia el nombre del repositorio, actualiza `repository` y `basePath` en `site.config.json`. La ruta base debe comenzar y terminar con `/`.

Las cuatro animaciones usan recursos de estilos y scripts locales. Sus vínculos a documentación técnica son externos.
