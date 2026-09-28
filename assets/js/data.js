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

// Equipaciones de fútbol: colores aproximados, sin escudos ni logos.
// Formato: [color principal, color secundario (rayas o ribete), ¿rayas?].
// [VALIDAR] licencia de cada club antes de vender.
const TEAM_KITS = {
  junior:      { name: 'Junior',                 local: ['#D01F2E', '#FFFFFF', true], visit: ['#F4F4F4', '#D01F2E'] },
  america:     { name: 'América de Cali',        local: ['#C8102E', '#FFFFFF'],       visit: ['#F4F4F4', '#C8102E'] },
  nacional:    { name: 'Atlético Nacional',      local: ['#0B7A3E', '#FFFFFF', true], visit: ['#F4F4F4', '#0B7A3E'] },
  millonarios: { name: 'Millonarios',            local: ['#1C3F94', '#FFFFFF'],       visit: ['#F4F4F4', '#1C3F94'] },
  santafe:     { name: 'Independiente Santa Fe', local: ['#D0102D', '#FFFFFF'],       visit: ['#F4F4F4', '#D0102D'] },
  cali:        { name: 'Deportivo Cali',         local: ['#0E7A3B', '#FFFFFF'],       visit: ['#F4F4F4', '#0E7A3B'] },
  medellin:    { name: 'Independiente Medellín', local: ['#D21F2A', '#1D3C8F'],       visit: ['#1D3C8F', '#D21F2A'] }
};
Object.entries(TEAM_KITS).forEach(([k, t]) => {
  window.COLORS[k + '-l'] = { name: 'Local',     hex: t.local[0], hex2: t.local[1], stripes: !!t.local[2], pantone: t.name + ' · equipación local', role: 'equipo' };
  window.COLORS[k + '-v'] = { name: 'Visitante', hex: t.visit[0], hex2: t.visit[1], pantone: t.name + ' · equipación visitante', role: 'equipo' };
});
window.TEAMS = Object.fromEntries(Object.entries(TEAM_KITS).map(([k, t]) => [k, t.name]));

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

// Tallas: mujer en numeración colombiana, hombre en letras, pantalón en cintura.
const DAMA = ['6', '8', '10', '12'];
const CABALLERO = ['S', 'M', 'L', 'XL', 'XXL'];
const UNISEX = ['S', 'M', 'L', 'XL'];
const PANTALON = ['28', '30', '32', '34', '36'];

// Páginas de categoría (migas de pan y tarjetas de la Home).
window.CATEGORIES = [
  { id: 'mujer-deportiva',  name: 'Deportiva mujer',       href: 'catalogo.html?genero=mujer&linea=deportiva',  garment: 'set',      color: 'malva',     tile: true },
  { id: 'hombre-deportiva', name: 'Deportiva hombre',      href: 'catalogo.html?genero=hombre&linea=deportiva', garment: 'tee',      color: 'azulnoche', tile: true },
  { id: 'conjuntos',        name: 'Conjuntos de gimnasio', href: 'catalogo.html?cat=conjuntos',                 garment: 'setskirt', color: 'princesa',  tile: true },
  { id: 'mujer-casual',     name: 'Casual mujer',          href: 'catalogo.html?genero=mujer&linea=casual',     garment: 'crop',     color: 'arcilla',   tile: true },
  { id: 'hombre-casual',    name: 'Casual hombre',         href: 'catalogo.html?genero=hombre&linea=casual',    garment: 'polo',     color: 'oliva',     tile: true },
  { id: 'unisex',           name: 'Suéteres y joggers',    href: 'catalogo.html?cat=unisex' }
];

const jersey = (team, gender, price, tags) => ({
  id: 'futbol-' + team + (gender === 'mujer' ? '-dama' : ''),
  sku: 'FB-' + team.slice(0, 3).toUpperCase() + (gender === 'mujer' ? '-D' : '-H'),
  name: 'Camiseta ' + window.TEAMS[team] + (gender === 'mujer' ? ' dama' : ''),
  cat: gender + '-deportiva', gender, line: 'deportiva', garment: 'jersey', team,
  price, colors: [team + '-l', team + '-v'], sizes: gender === 'mujer' ? DAMA : CABALLERO, tags: tags || [],
  comp: 'Poliéster de secado rápido. [VALIDAR ficha técnica y licencia del club]',
  fit: gender === 'mujer' ? 'Corte dama, entallado.' : 'Corte regular.'
});

window.PRODUCTS = [
  /* Deportiva mujer: leggings, shorts, faldas, tops y conjuntos de gimnasio */
  { id: 'legging-flex', sku: 'MD-LEG-01', name: 'Legging Flex tiro alto', cat: 'mujer-deportiva', gender: 'mujer', line: 'deportiva', garment: 'legging',
    price: 89900, colors: ['negro','azulnoche','malva','oliva','chili'], sizes: DAMA, tags: ['bestseller'],
    comp: '78% poliamida, 22% elastano. Tela de compresión media, opaca en sentadilla.', fit: 'Ajustado, tiro alto con pretina ancha.' },
  { id: 'short-biker', sku: 'MD-BIK-02', name: 'Short biker deportivo', cat: 'mujer-deportiva', gender: 'mujer', line: 'deportiva', garment: 'biker',
    price: 64900, colors: ['negro','azulnoche','arcilla','lavanda'], sizes: DAMA, tags: [],
    comp: '80% poliéster reciclado, 20% elastano.', fit: 'Ajustado, largo medio muslo, bolsillo lateral para celular.' },
  { id: 'falda-short', sku: 'MD-FAL-03', name: 'Falda short deportiva', cat: 'mujer-deportiva', gender: 'mujer', line: 'deportiva', garment: 'skirt',
    price: 69900, colors: ['negro','blanco','lavanda','princesa','malva'], sizes: DAMA, tags: ['nuevo'],
    comp: 'Exterior 100% poliéster; short interior 80% poliamida, 20% elastano.', fit: 'Falda con short interno, para gimnasio y tenis.' },
  { id: 'top-core', sku: 'MD-TOP-04', name: 'Top deportivo soporte medio', cat: 'mujer-deportiva', gender: 'mujer', line: 'deportiva', garment: 'bra',
    price: 59900, colors: ['negro','malva','lavanda','princesa','lima'], sizes: DAMA, tags: ['bestseller'],
    comp: '80% poliamida, 20% elastano. Copas removibles.', fit: 'Ajustado. Soporte medio para entrenamiento funcional.' },
  { id: 'conjunto-studio', sku: 'MD-SET-05', name: 'Conjunto de gimnasio top + legging', cat: 'conjuntos', gender: 'mujer', line: 'deportiva', garment: 'set',
    price: 149900, colors: ['princesa','malva','oliva','negro','fucsia'], sizes: DAMA, tags: ['bestseller'],
    comp: '78% poliamida, 22% elastano.', fit: 'Ajustado. Top y legging del mismo lote de tinte.' },
  { id: 'conjunto-falda', sku: 'MD-SET-06', name: 'Conjunto top + falda short', cat: 'conjuntos', gender: 'mujer', line: 'deportiva', garment: 'setskirt',
    price: 129900, colors: ['lavanda','negro','blanco','fucsia'], sizes: DAMA, tags: ['nuevo'],
    comp: 'Top 80% poliamida, 20% elastano; falda con short interno.', fit: 'Top ajustado, falda con caída.' },

  /* Deportiva hombre */
  { id: 'tee-dryfit', sku: 'HD-TEE-07', name: 'Camiseta Dry-Fit hombre', cat: 'hombre-deportiva', gender: 'hombre', line: 'deportiva', garment: 'tee',
    price: 59900, colors: ['negro','gris','azulnoche','princesa','fuego'], sizes: CABALLERO, tags: ['bestseller'],
    comp: '100% poliéster microperforado. Secado rápido.', fit: 'Regular fit.' },
  { id: 'pantaloneta-2en1', sku: 'HD-SHO-08', name: 'Pantaloneta 2 en 1 con licra', cat: 'hombre-deportiva', gender: 'hombre', line: 'deportiva', garment: 'short',
    price: 64900, colors: ['negro','azulnoche','oliva','gris'], sizes: CABALLERO, tags: [],
    comp: 'Exterior 100% poliéster; interior 85% poliéster, 15% elastano.', fit: 'Regular, largo 7".' },
  { id: 'jogger-tech', sku: 'HD-JOG-09', name: 'Jogger deportivo hombre', cat: 'hombre-deportiva', gender: 'hombre', line: 'deportiva', garment: 'jogger',
    price: 119900, colors: ['negro','azulnoche','gris','oliva'], sizes: CABALLERO, tags: ['nuevo'],
    comp: '88% poliéster, 12% elastano. Tejido stretch liviano.', fit: 'Slim, bota con cremallera.' },

  /* Camisetas de fútbol: equipos colombianos */
  jersey('junior', 'hombre', 89900, ['bestseller']),
  jersey('america', 'hombre', 89900, ['bestseller']),
  jersey('nacional', 'hombre', 89900),
  jersey('millonarios', 'hombre', 89900),
  jersey('santafe', 'hombre', 89900),
  jersey('cali', 'hombre', 89900),
  jersey('medellin', 'hombre', 89900),
  jersey('junior', 'mujer', 84900, ['nuevo']),
  jersey('america', 'mujer', 84900, ['nuevo']),
  jersey('nacional', 'mujer', 84900),
  jersey('millonarios', 'mujer', 84900),

  /* Casual: camisetas, suéteres y joggers */
  { id: 'crop-boxy', sku: 'MC-CRP-10', name: 'Camiseta crop boxy', cat: 'mujer-casual', gender: 'mujer', line: 'casual', garment: 'crop',
    price: 49900, colors: ['blanco','arcilla','anis','negro','lavanda'], sizes: DAMA, tags: ['nuevo'],
    comp: '100% algodón peinado, 180 g/m².', fit: 'Corte recto y corto. Hombro caído.' },
  { id: 'oversize-mujer', sku: 'MC-OVS-11', name: 'Camiseta oversize dama', cat: 'mujer-casual', gender: 'mujer', line: 'casual', garment: 'oversize',
    price: 69900, colors: ['blanco','negro','tarragon','chili'], sizes: DAMA, tags: ['bestseller'],
    comp: '100% algodón, 200 g/m².', fit: 'Oversize. Recomendado pedir la talla habitual.' },
  { id: 'jogger-mujer', sku: 'MC-JOG-12', name: 'Jogger French Terry dama', cat: 'mujer-casual', gender: 'mujer', line: 'casual', garment: 'jogger',
    price: 109900, colors: ['gris','toffee','oliva','negro'], sizes: DAMA, tags: [],
    comp: '70% algodón, 30% poliéster. French terry 280 g/m².', fit: 'Relajado, puño en tobillo.' },
  { id: 'polo-pique', sku: 'HC-POL-13', name: 'Polo piqué hombre', cat: 'hombre-casual', gender: 'hombre', line: 'casual', garment: 'polo',
    price: 79900, colors: ['blanco','azulnoche','oliva','toffee','chili'], sizes: CABALLERO, tags: [],
    comp: '100% algodón piqué.', fit: 'Regular fit.' },
  { id: 'oversize-hombre', sku: 'HC-OVS-14', name: 'Camiseta oversize hombre', cat: 'hombre-casual', gender: 'hombre', line: 'casual', garment: 'oversize',
    price: 69900, colors: ['negro','blanco','toffee','tarragon','gris'], sizes: CABALLERO, tags: ['nuevo'],
    comp: '100% algodón, 240 g/m².', fit: 'Oversize, cuello grueso.' },
  { id: 'bermuda-cargo', sku: 'HC-BER-15', name: 'Bermuda cargo gabardina', cat: 'hombre-casual', gender: 'hombre', line: 'casual', garment: 'bermuda',
    price: 99900, colors: ['toffee','oliva','negro','arcilla'], sizes: PANTALON, tags: [],
    comp: '98% algodón, 2% elastano. Gabardina lavada.', fit: 'Regular, largo sobre rodilla.' },
  { id: 'sueter-capota', sku: 'UX-SUE-16', name: 'Suéter con capota', cat: 'unisex', gender: 'unisex', line: 'casual', garment: 'hoodie',
    price: 139900, colors: ['gris','negro','azulnoche','tarragon','blanco'], sizes: UNISEX, tags: ['bestseller'],
    comp: '70% algodón, 30% poliéster perchado.', fit: 'Relajado, capota doble. Tallaje unisex: la dama suele pedir una talla menos.' },
  { id: 'sueter-cuello', sku: 'UX-SUE-17', name: 'Suéter cuello redondo', cat: 'unisex', gender: 'unisex', line: 'casual', garment: 'crew',
    price: 119900, colors: ['gris','negro','arcilla','oliva'], sizes: UNISEX, tags: ['nuevo'],
    comp: '70% algodón, 30% poliéster perchado.', fit: 'Regular. Tallaje unisex.' },
  { id: 'jogger-unisex', sku: 'UX-JOG-18', name: 'Jogger básico unisex', cat: 'unisex', gender: 'unisex', line: 'casual', garment: 'jogger',
    price: 99900, colors: ['gris','negro','azulnoche'], sizes: UNISEX, tags: [],
    comp: '70% algodón, 30% poliéster perchado.', fit: 'Regular, puño en tobillo.' }
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
