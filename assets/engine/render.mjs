/**
 * Fotografa a cena quadro a quadro.
 *
 * A pagina nao anima sozinha: ela expoe window.__setTime(t) e este script avanca o
 * relogio na mao. Por isso o resultado e identico a cada execucao e nao depende da
 * velocidade da maquina.
 *
 *   node render.mjs check                 passa pela linha do tempo inteira procurando erro de script
 *   node render.mjs preview               um quadro por cena (estado final), em preview/<O>/cNN.png
 *   node render.mjs preview 12.5 30.2     quadros nos instantes pedidos, em preview/<O>/t_<seg>.png
 *   node render.mjs full                  todos os quadros, em frames_<O>/f00000.jpg
 *
 * Variaveis de ambiente: PORT (obrigatoria; o build.sh escolhe), O = L (paisagem 1920x1080) ou
 * P (retrato 1080x1920), DE e ATE (segundos) para renderizar so um trecho no modo full.
 */
import { chromium } from 'playwright';
import fs from 'fs';

const MODE = process.argv[2] || 'preview';
const O = (process.env.O || 'L').toUpperCase();
const PORT = process.env.PORT;
if (!PORT) { console.error('defina PORT (use o scripts/build.sh, que sobe o servidor e escolhe a porta)'); process.exit(1); }
const [W, H] = O === 'P' ? [1080, 1920] : [1920, 1080];

const browser = await chromium.launch({ args: ['--disable-lcd-text'] });
const page = await browser.newPage({ viewport: { width: W, height: H }, deviceScaleFactor: 1 });
let erros = 0;
page.on('pageerror', e => { erros++; console.error('ERRO NA PAGINA:', e.message); });
await page.goto(`http://127.0.0.1:${PORT}/scene.html?o=${O}`, { waitUntil: 'load' });
await page.waitForFunction('window.__ready === true', null, { timeout: 60000 });
const dur = await page.evaluate('window.__duration');
const cenas = await page.evaluate('window.__scenes');
const fps = await page.evaluate('TL.fps || 30');
console.log(`duracao ${dur.toFixed(2)}s · ${cenas.length} cenas · ${W}x${H} · ${fps} fps`);

if (MODE === 'check') {
  const ruins = await page.evaluate(d => {
    const bad = [];
    for (let t = 0; t < d; t += 1 / 15) { try { window.__setTime(t); } catch (e) { bad.push(t.toFixed(2) + 's: ' + e.message); if (bad.length > 8) break; } }
    return bad;
  }, dur);
  if (ruins.length || erros) { console.error('FALHOU:', ruins.length ? ruins.join(' | ') : 'erro ao carregar a pagina'); await browser.close(); process.exit(1); }
  console.log('check ok: nenhuma excecao ao longo do video');
} else if (MODE === 'preview') {
  const dir = 'preview/' + O;
  fs.mkdirSync(dir, { recursive: true });
  const pedidos = process.argv.slice(3).map(Number).filter(n => !isNaN(n));
  if (pedidos.length) {
    for (const t of pedidos) { await page.evaluate(t => window.__setTime(t), t); await page.screenshot({ path: `${dir}/t_${t.toFixed(2)}.png` }); }
    console.log('preview ok:', pedidos.map(t => `${dir}/t_${t.toFixed(2)}.png`).join(' '));
  } else {
    for (const f of fs.readdirSync(dir)) if (/^c\d+\.png$/.test(f)) fs.unlinkSync(dir + '/' + f);
    // estado FINAL de cada cena: logo depois da ultima palavra, antes do corte (e antes do apagar da ultima cena).
    // E onde aparece texto estourando: a palavra forte costuma ser a ultima a entrar.
    for (const [i, c] of cenas.entries()) {
      const t = Math.max(c.t0, Math.min(c.t1 - 0.04, c.fim + 0.35));
      await page.evaluate(t => window.__setTime(t), t);
      await page.screenshot({ path: `${dir}/c${String(i + 1).padStart(2, '0')}.png` });
    }
    console.log('preview ok:', cenas.length, 'quadros em', dir + '/');
  }
} else if (MODE === 'full') {
  const out = 'frames_' + O;
  fs.rmSync(out, { recursive: true, force: true }); fs.mkdirSync(out, { recursive: true });
  const de = Math.max(0, Number(process.env.DE || 0)), ate = Math.min(dur, Number(process.env.ATE || dur));
  const f0 = Math.round(de * fps), f1 = Math.floor(ate * fps);
  for (let f = f0; f < f1; f++) {
    await page.evaluate(t => window.__setTime(t), f / fps);
    await page.screenshot({ path: `${out}/f${String(f - f0).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 92 });
    if ((f - f0) % 150 === 0) console.log('quadro', f - f0, '/', f1 - f0);
  }
  console.log('ok', f1 - f0, 'quadros em', out + '/');
} else { console.error('modo desconhecido:', MODE); process.exit(1); }

await browser.close();
if (erros) process.exit(1);
