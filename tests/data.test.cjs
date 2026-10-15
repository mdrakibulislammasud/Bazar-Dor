// Small dependency-free regression suite. TypeScript is a devDependency.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

let ts;
try {
  ts = require('typescript');
} catch {
  // Also supports running the suite in an offline assessment environment
  // where the TypeScript compiler is installed globally.
  const globalRoot = execFileSync('npm', ['root', '-g'], { encoding: 'utf8' }).trim();
  ts = require(path.join(globalRoot, 'typescript'));
}
require.extensions['.ts'] = (mod, filename) => {
  const compiled = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: filename,
    reportDiagnostics: true,
  });
  assert.equal(compiled.diagnostics?.filter((d) => d.category === ts.DiagnosticCategory.Error).length, 0);
  mod._compile(compiled.outputText, filename);
};
const { toBn, parseNumber, percent } = require('../lib/bn.ts');
const { normalizeProduct, normalizeCategory, getProducts, getCategories } = require('../lib/api.ts');

test('Bengali digits are converted to numeric values before sorting', () => {
  assert.equal(parseNumber('১,৮৫০ টাকা'), 1850);
  assert.equal(parseNumber('৯৯.৫০ টাকা'), 99.5);
  assert.equal(toBn(1850), '১,৮৫০');
  assert.equal(percent(-2.9), '২.৯%');
  const prices = ['১,৮৫০ টাকা', '৯৯ টাকা', '১৪৮ টাকা'].map(parseNumber).sort((a, b) => a - b);
  assert.deepEqual(prices, [99, 148, 1850]);
});

test('normalize categories with alternate field names', () => {
  assert.deepEqual(normalizeCategory({ category_slug: 'chal', category_name: 'চাল', icon: '🍚' }), {
    slug: 'chal', name: 'চাল', nameEn: undefined, icon: '🍚',
  });
});

test('normalize live API products and bazaar table rows', () => {
  const product = normalizeProduct({
    id: 5, productName: 'আলু', category: 'sobji', currentPrice: '৩৫ টাকা',
    changePercentage: '-২.৯%', trend: 'down', image: 'https://example.com/potato.png',
    marketPrices: [{ market: 'কারওয়ান বাজার', minPrice: '৩০', maxPrice: '৪০' }],
  });
  assert.ok(product);
  assert.equal(product.slug, '5');
  assert.equal(product.price, 35);
  assert.equal(product.changePct, -2.9);
  assert.equal(product.trend, 'down');
  assert.equal(product.emoji, '🥬');
  assert.equal(product.markets.length, 1);
  assert.equal(product.markets[0].avg, 35);
});

test('fall back to the alternate API after a primary provider 404', async () => {
  const original = global.fetch;
  const seen = [];
  global.fetch = async (url) => {
    seen.push(String(url));
    if (seen.length === 1) return { status: 404, ok: false };
    return { status: 200, ok: true, json: async () => ({ data: [
      { id: '88', name: 'পরীক্ষা', category: 'chal', price: '১২৫' },
    ] }) };
  };
  try {
    const products = await getProducts();
    assert.equal(products.length, 1);
    assert.equal(products[0].price, 125);
    assert.equal(seen.length, 2);
  } finally {
    global.fetch = original;
  }
});

test('a legitimate empty categories result does not invent categories', async () => {
  const original = global.fetch;
  global.fetch = async () => ({ status: 200, ok: true, json: async () => ({ data: [] }) });
  try {
    assert.deepEqual(await getCategories(), []);
  } finally {
    global.fetch = original;
  }
});

test('category APIs that return an array of plain slugs work', async () => {
  assert.equal(normalizeCategory('chal').name, 'চাল');
  assert.equal(normalizeCategory('dal').slug, 'dal');
  const original = global.fetch;
  global.fetch = async () => ({ status: 200, ok: true, json: async () => ({ categories: ['chal', 'dal', 'chal'] }) });
  try {
    const list = await getCategories();
    assert.deepEqual(list.map((c) => c.slug), ['chal', 'dal']);
  } finally {
    global.fetch = original;
  }
});

test('invalid 200 API responses trigger mirror failover instead of empty results', async () => {
  const original = global.fetch;
  let hits = 0;
  global.fetch = async () => {
    hits++;
    return hits === 1
      ? { status: 200, ok: true, json: async () => ({ error: 'temporarily broken' }) }
      : { status: 200, ok: true, json: async () => ({ products: [{ id: 3, name: 'আলু', category: 'sobji', price: '৫০' }] }) };
  };
  try {
    const items = await getProducts();
    assert.equal(hits, 2);
    assert.deepEqual(items.map((p) => p.price), [50]);
  } finally {
    global.fetch = original;
  }
});

test('category listing hides products from other categories even if the API ignores the filter', async () => {
  const original = global.fetch;
  global.fetch = async () => ({
    status: 200, ok: true,
    json: async () => ([
      { id: 1, name: 'আলু', category: 'sobji', price: '৪০' },
      { id: 2, name: 'চাল', category: 'chal', price: '৮০' },
    ]),
  });
  try {
    const list = await getProducts('chal');
    assert.deepEqual(list.map((p) => p.name), ['চাল']);
  } finally {
    global.fetch = original;
  }
});

test('broken product records cannot render nameless cards', () => {
  assert.equal(normalizeProduct({ id: '123', price: 88 }), null);
});

test('price decreases tagged bearish do not display as an increase', () => {
  const item = normalizeProduct({ id: 1, name: 'Test', category: 'chal', price: 100, change: '২.৯%', trend: 'bearish' });
  assert.equal(item.trend, 'down');
  assert.equal(item.changePct, -2.9);
});

test('invalid product list falls back across mirrors, even with HTTP 200', async () => {
  const original = global.fetch;
  let hits = 0;
  global.fetch = async () => {
    hits++;
    return hits === 1
      ? { status: 200, ok: true, json: async () => ([{ id: 1, price: 99 }]) }
      : { status: 200, ok: true, json: async () => ([{ id: 2, name: 'Good', price: 90 }]) };
  };
  try {
    const products = await getProducts();
    assert.equal(hits, 2);
    assert.equal(products[0].name, 'Good');
  } finally {
    global.fetch = original;
  }
});

test('sample-data flag distinguishes an outage from a genuine empty category', async () => {
  const { getProductFeed } = require('../lib/api.ts');
  const original = global.fetch;
  global.fetch = async () => { throw new Error('network unavailable'); };
  try {
    const offline = await getProductFeed();
    assert.equal(offline.isSample, true);
    assert.ok(offline.products.length > 0);
  } finally {
    global.fetch = original;
  }
  global.fetch = async () => ({ status: 200, ok: true, json: async () => ({ data: [] }) });
  try {
    const empty = await getProductFeed('nonexistent');
    assert.equal(empty.isSample, false);
    assert.deepEqual(empty.products, []);
  } finally {
    global.fetch = original;
  }
});

test('partial mirror outage is not interpreted as legitimate no-data response', async () => {
  const { getProductFeed } = require('../lib/api.ts');
  const original = global.fetch;
  let hits = 0;
  global.fetch = async () => {
    hits++;
    if (hits === 1) return { ok: false, status: 404 };
    throw new Error('service unavailable');
  };
  try {
    const result = await getProductFeed();
    assert.equal(hits, 3);
    assert.equal(result.isSample, true);
  } finally {
    global.fetch = original;
  }
});

test('product data flags when it uses demo prices', async () => {
  const { getProductResult } = require('../lib/api.ts');
  const original = global.fetch;
  global.fetch = async () => { throw new Error('API offline'); };
  try {
    const result = await getProductResult('1');
    assert.equal(result.isSample, true);
    assert.equal(result.product?.slug, '1');
  } finally {
    global.fetch = original;
  }
});
