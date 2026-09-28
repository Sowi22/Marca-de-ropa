/* Datos del prototipo.
   Precios, mínimos, niveles y stock son [SUPUESTO] para demostrar la experiencia.
   Reemplazar por datos reales del negocio antes de publicar. */

// Paleta de producto. Los HEX son aproximaciones digitales de referencias Pantone TCX:
// no son equivalencias físicas exactas. Validar con muestra física (tela) antes de producir.
window.COLORS = {
  negro:     { name: 'Negro',            hex: '#1B1B1D', pantone: 'Core de mercado',           role: 'core' },
  gris:      { name: 'Gris Dolphin',     hex: '#85848A', pantone: 'Dolphin 16-2901 TCX',       role: 'core' },
  azulnoche: { name: 'Azul noche',       hex: '#2C3950', pantone: 'Blue Indigo 19-3928 TCX',   role: 'core' },
  blanco:    { name: 'Blanco nube',      hex: '#EFEDE8', pantone: 'Cloud Dancer 11-4201 TCX',  role: 'core' },
  toffee:    { name: 'Toffee',           hex: '#7A5539', pantone: 'Toffee (core OI 26/27)',    role: 'core' },
  oliva:     { name: 'Oliva quemado',    hex: '#5E5A3E', pantone: 'Burnt Olive 18-0521 TCX',   role: 'trend' },
  tarragon:  { name: 'Estragón',         hex: '#A4AF83', pantone: 'Tarragon 15-0326 TCX',      role: 'trend' },
  arcilla:   { name: 'Arcilla',          hex: '#BE8C7B', pantone: 'Muted Clay 16-1330 TCX',    role: 'trend' },
  malva:     { name: 'Malva',            hex: '#B4808F', pantone: 'Foxglove 16-1710 TCX',      role: 'trend' },
  lavanda:   { name: 'Lavanda',          hex: '#C4B7D5', pantone: 'Lavender Oil 15-3615 TCX',  role: 'trend' },
  princesa:  { name: 'Azul princesa',    hex: '#00539C', pantone: 'Princess Blue 19-4150 TCX', role: 'trend' },
  fucsia:    { name: 'Fucsia festival',  hex: '#B0306F', pantone: 'Festival Fuchsia 19-2434 TCX', role: 'statement' },
  chili:     { name: 'Rojo chili',       hex: '#9B1B30', pantone: 'Chili Pepper 19-1557 TCX',  role: 'seasonal' },
  anis:      { name: 'Amarillo anís',    hex: '#EEDFA6', pantone: 'Anise Flower 12-0717 TCX',  role: 'seasonal' },
  lima:      { name: 'Lima daiquiri',    hex: '#CFDC6E', pantone: 'Daiquiri Green 12-0435',    role: 'test' },
  fuego:     { name: 'Naranja dragón',   hex: '#F2643A', pantone: 'Dragon Fire 16-1460 TCX',   role: 'test' }
};

// Precio por mayor por CANTIDAD de piezas en el pedido completo (se mezclan
// referencias, tallas y colores). [SUPUESTO] Ajustar al costo real.
window.TIERS = [
  { id: 'may1', name: 'Por mayor',   min: 12, off: 0.35 },
  { id: 'may2', name: 'Mayor Plus',  min: 36, off: 0.40 },
  { id: 'dist', name: 'Distribuidor', min: 72, off: 0.45 }
];

window.BUSINESS = {
  whatsapp: '573000000000',          // [DATO REQUERIDO] número real de WhatsApp Business
  retailFreeShipping: 199900,        // [SUPUESTO] envío gratis al detal desde este valor
  wholesaleFreeShippingUnits: 36,    // [SUPUESTO] envío gratis por mayor desde estas piezas
  dispatch: '24–48 h hábiles',       // [SUPUESTO]
  city: '[CIUDAD DE DESPACHO]'       // [DATO REQUERIDO]
};

window.CATEGORIES = [
  { id: 'mujer-deportiva', name: 'Mujer deportiva', gender: 'mujer',  line: 'deportiva', garment: 'set',     color: 'malva' },
  { id: 'hombre-deportiva', name: 'Hombre deportiva', gender: 'hombre', line: 'deportiva', garment: 'tee',   color: 'azulnoche' },
  { id: 'mujer-casual',    name: 'Mujer casual',    gender: 'mujer',  line: 'casual',    garment: 'crop',    color: 'arcilla' },
  { id: 'hombre-casual',   name: 'Hombre casual',   gender: 'hombre', line: 'casual',    garment: 'polo',    color: 'oliva' },
  { id: 'conjuntos',       name: 'Conjuntos',       gender: 'mujer',  line: 'deportiva', garment: 'set',     color: 'princesa' },
  { id: 'unisex',          name: 'Buzos y joggers', gender: 'unisex', line: 'casual',    garment: 'hoodie',  color: 'gris' }
];

window.PRODUCTS = [
  { id: 'legging-flex', sku: 'MD-LEG-01', name: 'Legging Flex tiro alto', cat: 'mujer-deportiva', gender: 'mujer', line: 'deportiva', garment: 'legging',
    price: 89900, colors: ['negro','azulnoche','malva','oliva','chili'], sizes: ['6','8','10','12'], tags: ['bestseller'],
    comp: '78% poliamida, 22% elastano. Tela de compresión media, opaca en sentadilla.', fit: 'Ajustado, tiro alto con pretina ancha.' },
  { id: 'top-core', sku: 'MD-TOP-02', name: 'Top Core soporte medio', cat: 'mujer-deportiva', gender: 'mujer', line: 'deportiva', garment: 'bra',
    price: 59900, colors: ['negro','malva','lavanda','princesa','lima'], sizes: ['6','8','10','12'], tags: ['bestseller'],
    comp: '80% poliamida, 20% elastano. Copas removibles.', fit: 'Ajustado. Soporte medio para entrenamiento funcional.' },
  { id: 'conjunto-studio', sku: 'MD-SET-03', name: 'Conjunto Studio top + legging', cat: 'conjuntos', gender: 'mujer', line: 'deportiva', garment: 'set',
    price: 149900, colors: ['princesa','malva','oliva','negro','fucsia'], sizes: ['6','8','10','12'], tags: ['nuevo','bestseller'],
    comp: '78% poliamida, 22% elastano.', fit: 'Ajustado. Top y legging del mismo lote de tinte.' },
  { id: 'biker-run', sku: 'MD-BIK-04', name: 'Biker Run con bolsillo', cat: 'mujer-deportiva', gender: 'mujer', line: 'deportiva', garment: 'biker',
    price: 64900, colors: ['negro','azulnoche','arcilla','lavanda'], sizes: ['6','8','10','12'], tags: ['bestseller'],
    comp: '80% poliéster reciclado, 20% elastano.', fit: 'Ajustado, largo medio muslo, bolsillo lateral para celular.' },
  { id: 'crop-boxy', sku: 'MC-CRP-05', name: 'Camiseta crop boxy', cat: 'mujer-casual', gender: 'mujer', line: 'casual', garment: 'crop',
    price: 49900, colors: ['blanco','arcilla','anis','negro','lavanda'], sizes: ['6','8','10','12'], tags: ['nuevo'],
    comp: '100% algodón peinado, 180 g/m².', fit: 'Corte recto y corto. Hombro caído.' },
  { id: 'jogger-mujer', sku: 'MC-JOG-06', name: 'Jogger French Terry mujer', cat: 'mujer-casual', gender: 'mujer', line: 'casual', garment: 'jogger',
    price: 109900, colors: ['gris','toffee','oliva','negro'], sizes: ['6','8','10','12'], tags: [],
    comp: '70% algodón, 30% poliéster. French terry 280 g/m².', fit: 'Relajado, puño en tobillo.' },
  { id: 'oversize-mujer', sku: 'MC-OVS-07', name: 'Camiseta oversize estampada', cat: 'mujer-casual', gender: 'mujer', line: 'casual', garment: 'oversize',
    price: 69900, colors: ['blanco','negro','tarragon','chili'], sizes: ['6','8','10','12'], tags: ['bestseller'],
    comp: '100% algodón, 200 g/m².', fit: 'Oversize. Recomendado pedir la talla habitual.' },
  { id: 'tee-dryfit', sku: 'HD-TEE-08', name: 'Camiseta Dry-Fit hombre', cat: 'hombre-deportiva', gender: 'hombre', line: 'deportiva', garment: 'tee',
    price: 59900, colors: ['negro','gris','azulnoche','princesa','fuego'], sizes: ['S','M','L','XL','XXL'], tags: ['bestseller'],
    comp: '100% poliéster microperforado. Secado rápido.', fit: 'Regular fit.' },
  { id: 'pantaloneta-2en1', sku: 'HD-SHO-09', name: 'Pantaloneta 2 en 1 con licra', cat: 'hombre-deportiva', gender: 'hombre', line: 'deportiva', garment: 'short',
    price: 64900, colors: ['negro','azulnoche','oliva','gris'], sizes: ['S','M','L','XL','XXL'], tags: [],
    comp: 'Exterior 100% poliéster; interior 85% poliéster, 15% elastano.', fit: 'Regular, largo 7".' },
  { id: 'jogger-tech', sku: 'HD-JOG-10', name: 'Jogger Tech hombre', cat: 'hombre-deportiva', gender: 'hombre', line: 'deportiva', garment: 'jogger',
    price: 119900, colors: ['negro','azulnoche','gris','oliva'], sizes: ['S','M','L','XL','XXL'], tags: ['nuevo'],
    comp: '88% poliéster, 12% elastano. Tejido stretch liviano.', fit: 'Slim, bota con cremallera.' },
  { id: 'polo-pique', sku: 'HC-POL-11', name: 'Polo piqué hombre', cat: 'hombre-casual', gender: 'hombre', line: 'casual', garment: 'polo',
    price: 79900, colors: ['blanco','azulnoche','oliva','toffee','chili'], sizes: ['S','M','L','XL','XXL'], tags: ['bestseller'],
    comp: '100% algodón piqué.', fit: 'Regular fit.' },
  { id: 'oversize-hombre', sku: 'HC-OVS-12', name: 'Camiseta oversize heavy', cat: 'hombre-casual', gender: 'hombre', line: 'casual', garment: 'oversize',
    price: 69900, colors: ['negro','blanco','toffee','tarragon','gris'], sizes: ['S','M','L','XL'], tags: ['nuevo'],
    comp: '100% algodón, 240 g/m².', fit: 'Oversize, cuello grueso.' },
  { id: 'bermuda-cargo', sku: 'HC-BER-13', name: 'Bermuda cargo gabardina', cat: 'hombre-casual', gender: 'hombre', line: 'casual', garment: 'bermuda',
    price: 99900, colors: ['toffee','oliva','negro','arcilla'], sizes: ['28','30','32','34','36'], tags: [],
    comp: '98% algodón, 2% elastano. Gabardina lavada.', fit: 'Regular, largo sobre rodilla.' },
  { id: 'buzo-hoodie', sku: 'UX-HOO-14', name: 'Buzo hoodie unisex', cat: 'unisex', gender: 'unisex', line: 'casual', garment: 'hoodie',
    price: 139900, colors: ['gris','negro','azulnoche','tarragon','blanco'], sizes: ['S','M','L','XL'], tags: ['bestseller'],
    comp: '70% algodón, 30% poliéster perchado.', fit: 'Relajado, capota doble.' },
  { id: 'jogger-unisex', sku: 'UX-JOG-15', name: 'Jogger básico unisex', cat: 'unisex', gender: 'unisex', line: 'casual', garment: 'jogger',
    price: 99900, colors: ['gris','negro','azulnoche'], sizes: ['S','M','L','XL'], tags: [],
    comp: '70% algodón, 30% poliéster perchado.', fit: 'Regular, puño en tobillo.' },
  { id: 'conjunto-lounge', sku: 'MC-SET-16', name: 'Conjunto lounge crop + jogger', cat: 'conjuntos', gender: 'mujer', line: 'casual', garment: 'set',
    price: 139900, colors: ['arcilla','lavanda','gris','anis'], sizes: ['6','8','10','12'], tags: ['nuevo'],
    comp: '95% algodón, 5% elastano. Rib.', fit: 'Crop ajustado, jogger relajado.' }
];

// Stock determinístico para el prototipo: algunas combinaciones bajas o agotadas.
window.stockFor = function (productId, color, size) {
  let h = 0;
  const s = productId + color + size;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  const r = h % 100;
  if (r < 6) return 0;
  if (r < 18) return 3 + (h % 6);
  return 20 + (h % 60);
};
