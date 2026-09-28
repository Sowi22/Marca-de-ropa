# Tienda mayorista + detal: prototipo

Prototipo navegable (HTML, CSS y JS sin dependencias) para validar la arquitectura, los flujos y el copy antes de construir la versión de producción.

## Cómo verlo

```bash
python -m http.server 5173
```

Luego abre http://localhost:5173

## Páginas

| Archivo | Qué prueba |
|---|---|
| `index.html` | Home: hero, franja de condiciones, categorías, calculadora de volumen, más vendidos, pasos, colores de temporada, confianza y preguntas frecuentes |
| `catalogo.html` | Filtros (panel inferior en móvil), chips, orden y vista **Pedido por mayor** (tabla talla × color); cada tarjeta muestra precio detal y por mayor |
| `producto.html?id=legging-flex` | Ficha con los dos precios lado a lado (pestañas «Al detal» / «Por mayor»), tabla de precios por piezas, tabla talla × color y barra hacia las 12 piezas |
| `mayoristas.html` | Condiciones, niveles, cómo funciona y formulario que abre WhatsApp con el mensaje armado |
| `checkout.html` | Checkout sin cuenta; Addi y contraentrega solo aparecen si el pedido tiene menos de 12 piezas |

Cada prenda muestra el precio al detal y el precio por mayor; desde 12 piezas en el pedido (mezclando referencias) todo pasa a precio por mayor. El pedido se guarda en `localStorage` y se puede enviar por WhatsApp ya armado.

## Qué es supuesto

Todo lo marcado `[SUPUESTO]`, `[DATO REQUERIDO]` o `[VALIDAR]` en el sitio y en `assets/js/data.js`: precios, mínimo (12 piezas por pedido), niveles (−35 / −40 / −45% desde 12 / 36 / 72 piezas), stock, tiempos de despacho y número de WhatsApp. Las prendas son siluetas SVG que reemplazan fotografías reales.

## Producción (recomendado)

- **Frontend:** Next.js (App Router), páginas de catálogo generadas estáticamente y revalidadas con cada cambio de stock.
- **Motor de comercio:** Medusa v2, con grupos de clientes (detal y mayorista), listas de precio por grupo y por cantidad, e inventario por variante.
- **Pagos:** pasarela local con PSE, Nequi, Bancolombia y tarjeta (por ejemplo Wompi). Addi y contraentrega solo al detal.
- **Envíos:** transportadora con API de guías (Coordinadora, Servientrega o Interrapidísimo).
- **Imágenes:** CDN con AVIF/WebP y tamaños adaptados.
- **Presupuesto de rendimiento:** LCP < 2,5 s, INP < 200 ms, CLS < 0,1 en móvil 4G.

La estrategia completa está en `docs/estrategia.html`.
