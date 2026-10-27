/** @param {string} color */
export function normalizeHex(color) {
  if (typeof color !== 'string' || !/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(color)) {
    throw new TypeError('Use uma cor hexadecimal como #0a63ff ou #abc.');
  }
  const hex = color.slice(1).toLowerCase();
  return '#' + (hex.length === 3 ? [...hex].map(c => c + c).join('') : hex);
}
const rgb = color => normalizeHex(color).slice(1).match(/../g).map(x => parseInt(x, 16));
/** @param {string} first @param {string} second */
export function contrastRatio(first, second) {
  const luminance = color => {
    const [r, g, b] = rgb(color).map(v => {
      const s = v / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  const a = luminance(first), b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
/** Mix RGB channels; this is intentionally not a perceptually uniform scale. */
function mix(base, target, amount) {
  return '#' + rgb(base).map((c, i) => Math.round(c + (rgb(target)[i] - c) * amount)
    .toString(16).padStart(2, '0')).join('');
}
/** @param {string} color @param {string} [name] */
export function generateTheme(color, name = 'brand') {
  if (!/^[a-z][a-z0-9-]*$/i.test(name)) throw new TypeError('O nome deve começar com uma letra e usar letras, números ou hífens.');
  const base = normalizeHex(color);
  const colors = { 50: mix(base, '#ffffff', .95), 100: mix(base, '#ffffff', .9),
    200: mix(base, '#ffffff', .7), 300: mix(base, '#ffffff', .5), 400: mix(base, '#ffffff', .25),
    500: base, 600: mix(base, '#000000', .15), 700: mix(base, '#000000', .3),
    800: mix(base, '#000000', .5), 900: mix(base, '#000000', .7) };
  const onBase = contrastRatio(base, '#000000') >= contrastRatio(base, '#ffffff') ? '#000000' : '#ffffff';
  const contrast = contrastRatio(base, onBase);
  const lines = Object.entries(colors).map(([step, hex]) => `  --${name}-${step}: ${hex};`);
  lines.push(`  --on-${name}: ${onBase};`);
  return { name, base, colors, onBase, contrast, css: `:root {\n${lines.join('\n')}\n}\n` };
}
