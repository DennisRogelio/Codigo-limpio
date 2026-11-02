"use strict";

/* ============ CONTENIDO ============ */
const HERO_MESSY = `function x(a,b,c){
if(a){
if(b){
return c*2;
}
}
return 0;
}`;
const HERO_CLEAN = `function calculateDouble(value) {
    if (!value) {
        return 0;
    }

    return value * 2;
}`;

const CARELESS = `function calc(p){
 var r=p*1.16 // iva
 return r // TODO
}`;
const CAREFUL = `const VAT_RATE = 0.16;

function addVat(price) {
  return price * (1 + VAT_RATE);
}`;
const CONFUSING_CART = `function f(l, u) {
  let t = 0;
  for (let i of l) t += i.p * i.q;
  return u.v ? t * 0.9 : t;
}`;
const CLEAN_CART = `function calculateCartTotal(items, customer) {
  const subtotal = sumItems(items);
  return customer.isVip ? applyDiscount(subtotal) : subtotal;
}`;
const MIXED_LEVELS = `function processOrder(order) {
  document.querySelector("#button").style.display = "none";
  database.query("INSERT INTO orders ...");
  sendConfirmation(order);
}`;
const SEPARATED_LEVELS = `function processOrder(order) {
  validateOrder(order);
  saveOrder(order);
  hideCheckoutButton();
}`;

const IDEAS = [
  { id: 1, short: "Cuidado", name: "El código limpio se nota por el cuidado",
    brief: "No basta con que funcione: debe mostrar atención a los detalles y no dejar mejoras obvias pendientes.",
    key: "El código limpio demuestra que su autor se preocupa por lo que está construyendo.",
    type: "choice", prompt: "¿Cuál parece escrito por alguien que realmente se preocupó por él?",
    options: [{ label: CARELESS, mono: true }, { label: CAREFUL, mono: true, correct: true }],
    explain: "Nombres claros, una constante con significado y nada de TODOs olvidados: cada detalle dice “me importó”.",
    bad: CARELESS, good: CAREFUL,
    conclusion: "Antes de dar algo por terminado, pregúntate: ¿dejé alguna mejora obvia sin hacer?" },
  { id: 2, short: "Simplicidad", name: "La simplicidad es fundamental",
    brief: "Pasa las pruebas, evita duplicación, expresa el diseño y minimiza entidades. Simple no es hacer menos: es quitar complejidad innecesaria.",
    key: "La complejidad que no aporta es deuda.",
    type: "steps", button: "SIMPLIFICAR", meterLabel: "CLARIDAD",
    stages: [
      { code: `function isEven(n) {\n  let result;\n  if (n % 2 === 0) {\n    result = true;\n  } else {\n    result = false;\n  }\n  return result;\n}`, meter: 25, note: "Funciona, pero tiene una variable y una rama de más." },
      { code: `function isEven(n) {\n  if (n % 2 === 0) {\n    return true;\n  }\n  return false;\n}`, meter: 60, note: "Sin variable intermedia: la intención se ve antes." },
      { code: `function isEven(n) {\n  return n % 2 === 0;\n}`, meter: 100, note: "La expresión ya es la respuesta." } ],
    conclusion: "Si puedes borrar algo sin perder comportamiento ni claridad, bórralo." },
  { id: 3, short: "Legibilidad", name: "El código debe leerse como un texto bien escrito",
    brief: "Debe expresar claramente la intención del diseño. Leerlo no debería sentirse como descifrar un acertijo.",
    key: "Se escribe una vez, se lee cientos de veces.",
    type: "steps", button: "MEJORAR NOMBRES", meterLabel: "COMPRENSIÓN",
    stages: [
      { code: `let x = 5;\nlet y = 10;\nlet z = x * y;`, meter: 15, note: "¿Qué es x? ¿Y z? Hay que adivinar." },
      { code: `let productPrice = 5;\nlet y = 10;\nlet z = productPrice * y;`, meter: 55, note: "Ya sabemos qué es la primera variable." },
      { code: `const productPrice = 5;\nconst quantity = 10;\nconst totalPrice = productPrice * quantity;`, meter: 100, note: "Se lee como una frase: precio por cantidad es el total." } ],
    conclusion: "Léelo en voz alta: si suena como una frase con sentido, vas bien." },
  { id: 4, short: "Mantenible", name: "El código debe ser mantenible por otras personas",
    brief: "No se escribe solo para su autor: nombres significativos, pruebas, dependencias mínimas y una estructura comprensible.",
    key: "Tu compañero acaba de entrar al proyecto.",
    type: "choice", prompt: "Tu compañero acaba de entrar al proyecto. ¿Qué hace esta función?", code: CONFUSING_CART,
    options: [{ label: "Calcula el total de un carrito y da 10% de descuento a clientes VIP", correct: true },
      { label: "Ordena una lista de usuarios por edad" }, { label: "Valida el formato de una contraseña" }],
    explain: "Lo pudiste deducir, pero costó esfuerzo. Mira cómo se lee la versión limpia:", reveal: CLEAN_CART,
    bad: CONFUSING_CART, good: CLEAN_CART,
    conclusion: "Escribe pensando en la persona que lo abrirá dentro de seis meses (puedes ser tú)." },
  { id: 5, short: "Nombres", name: "Los nombres importan",
    brief: "Variables, funciones y clases deben comunicar qué representan. Mejor un nombre largo y claro que uno corto y enigmático.",
    key: "Un buen nombre responde: ¿qué es y para qué sirve?",
    type: "choice", prompt: "¿Qué nombre elegirías?", code: "let ______ = calculateTax(price);",
    options: [{ label: "x" }, { label: "a" }, { label: "tax" }, { label: "productTaxAmount", correct: true }],
    explain: "productTaxAmount dice qué es (impuesto), de qué (producto) y cómo se mide (monto). Sin adivinar.",
    bad: "let d;\nlet x;\nlet p;", good: "let deliveryDate;\nlet customerName;\nlet productPrice;",
    conclusion: "Si necesitas un comentario para explicar una variable, necesita un mejor nombre." },
  { id: 6, short: "Sin duplicación", name: "Elimina la duplicación",
    brief: "Código repetido aumenta el mantenimiento, el riesgo de errores y la complejidad. Puede indicar una abstracción que falta.",
    key: "DRY — Don't Repeat Yourself.",
    type: "steps", button: "ELIMINAR DUPLICACIÓN", meterLabel: "DUPLICACIÓN",
    stages: [
      { code: `calculateTax();\nsaveUser();\n\ncalculateTax();\nsaveUser();\n\ncalculateTax();\nsaveUser();`, meter: 100, chips: ["calculateTax + saveUser", "calculateTax + saveUser", "calculateTax + saveUser"], note: "Tres copias: si cambia una regla, hay que acordarse de tocar las tres." },
      { code: `function processUser() {\n  calculateTax();\n  saveUser();\n}\n\nprocessUser();\nprocessUser();\nprocessUser();`, meter: 40, chips: ["processUser()"], note: "Una sola definición reutilizable." },
      { code: `function processUser() {\n  calculateTax();\n  saveUser();\n}\n\nfor (let i = 0; i < 3; i++) {\n  processUser();\n}`, meter: 0, chips: ["processUser()"], note: "Ya no queda nada repetido." } ],
    conclusion: "Cuando copies y pegues por segunda vez, es momento de crear una abstracción." },
  { id: 7, short: "Una sola cosa", name: "Las funciones deben hacer una sola cosa",
    brief: "Una función con una responsabilidad clara es fácil de entender, probar y reutilizar.",
    key: "Una función debe hacer una sola cosa y hacerla bien.",
    type: "steps", button: "SEPARAR RESPONSABILIDADES", meterLabel: "RESPONSABILIDADES",
    stages: [
      { code: `function processOrder(order) {\n  // validar\n  if (!order.items.length) throw Error("vacío");\n  // calcular precio\n  let total = 0;\n  for (const i of order.items) total += i.price;\n  // guardar\n  database.save(order, total);\n  // enviar correo\n  mailer.send(order.email, "Gracias");\n  // modificar interfaz\n  showMessage("Listo");\n}`, meter: 100, chips: ["processOrder()  ← hace TODO"], note: "Una función, cinco responsabilidades." },
      { code: `function processOrder(order) {\n  validateOrder(order);\n  const total = calculateTotal(order);\n  saveOrder(order, total);\n  sendConfirmation(order);\n}`, meter: 20, chips: ["validateOrder()", "calculateTotal()", "saveOrder()", "sendConfirmation()"], note: "Cada bloque tiene un nombre y un solo motivo para cambiar." } ],
    conclusion: "Si describes una función usando “y”, probablemente son dos funciones." },
  { id: 8, short: "Abstracción", name: "No mezcles niveles de abstracción",
    brief: "Mantén juntos los conceptos del mismo nivel. Mezclar alto nivel con detalles de bajo nivel dificulta la lectura.",
    key: "Una función debe contar una historia a un solo nivel.",
    type: "classify", prompt: "Haz clic en cada instrucción para asignarle su nivel y pulsa COMPROBAR.",
    items: [{ text: "processOrder(order)", level: 0 }, { text: "document.querySelector(\"#button\").style.display = \"none\"", level: 2 },
      { text: "calculateTotal(order.items)", level: 1 }, { text: "database.query(\"INSERT INTO orders ...\")", level: 2 },
      { text: "formatPrice(total)", level: 1 }, { text: "sendConfirmation(order)", level: 0 }],
    bad: MIXED_LEVELS, good: SEPARATED_LEVELS,
    conclusion: "Los detalles sucios viven en funciones pequeñas con buen nombre, no mezclados con la historia principal." },
  { id: 9, short: "Pruebas", name: "Las pruebas permiten mejorar el diseño",
    brief: "Las pruebas no solo encuentran errores: dan seguridad para cambiar el código. Escribe pruebas → refactoriza → ejecútalas → confirma.",
    key: "Con pruebas, el miedo a cambiar desaparece.",
    type: "steps", tests: true, button: "REFACTORIZAR", meterLabel: "CONFIANZA",
    stages: [
      { code: `function total(items) {\n  var t = 0;\n  for (var i = 0; i < items.length; i++) {\n    t = t + items[i].price;\n  }\n  return t;\n}`, meter: 60, note: "Funciona y tiene pruebas. Pero es mejorable." },
      { code: `const total = (items) =>\n  items.reduce((sum, item) => sum + item.price, 0);`, meter: 100, note: "Código nuevo, mismo comportamiento: las pruebas lo confirman." } ],
    conclusion: "Ahora puedes mejorar el código sin miedo." },
  { id: 10, short: "Expresividad", name: "La expresividad importa",
    brief: "El código vive mucho tiempo. Si expresa claramente lo que hace, se tarda menos en comprenderlo y mantenerlo.",
    key: "La claridad reduce el costo de cada cambio futuro.",
    type: "steps", button: "HACER MÁS EXPRESIVO", meterLabel: "LEGIBILIDAD",
    stages: [
      { code: `if (u.a > 18 && u.s === true) {\n  ...\n}`, meter: 20, note: "¿Qué es a? ¿Y s?" },
      { code: `if (u.age > 18 && u.isActive) {\n  ...\n}`, meter: 55, note: "Mejor, pero “> 18” sigue siendo un número mágico." },
      { code: `if (user.isAdult && user.isActive) {\n  ...\n}`, meter: 80, note: "La condición se lee como una oración." } ],
    conclusion: "Haz que la condición diga la regla de negocio, no su implementación." },
  { id: 11, short: "Refactorización", name: "Refactoriza constantemente",
    brief: "El código limpio no aparece al primer intento. Un buen programador consigue que funcione y que el siguiente cambio sea más fácil.",
    key: "Escribe → prueba → revisa → refactoriza → vuelve a probar.",
    type: "steps", button: "REFACTORIZAR", meterLabel: "CALIDAD DEL CÓDIGO",
    stages: [
      { code: `function calc(l) {\n  var t = 0;\n  for (var i = 0; i < l.length; i++) {\n    if (l[i].a) { t += l[i].p; }\n  }\n  return t;\n}`, meter: 40, note: "Funciona, pero nadie quiere tocarlo." },
      { code: `function calcActiveTotal(products) {\n  var total = 0;\n  for (var i = 0; i < products.length; i++) {\n    if (products[i].isActive) { total += products[i].price; }\n  }\n  return total;\n}`, meter: 60, note: "Paso 1: nombres con significado." },
      { code: `function calcActiveTotal(products) {\n  let total = 0;\n  for (const product of products) {\n    if (product.isActive) total += product.price;\n  }\n  return total;\n}`, meter: 80, note: "Paso 2: sintaxis moderna, menos ruido." },
      { code: `const isActive = (product) => product.isActive;\nconst sumPrices = (products) =>\n  products.reduce((sum, p) => sum + p.price, 0);\n\nconst calculateActiveTotal = (products) =>\n  sumPrices(products.filter(isActive));`, meter: 100, note: "Paso 3: piezas pequeñas y reutilizables." } ],
    conclusion: "El objetivo no es escribir código perfecto. Es dejar el código mejor de como lo encontraste." }
];
const TOTAL = IDEAS.length;
const STORAGE_KEY = "cleanCodeLab.discovered";
const LEVEL_NAMES = ["Alto nivel", "Medio nivel", "Bajo nivel"];
const SAMPLE_CODE = `function p(a, b) {
  console.log(a);
  // suma
  let x = a.price * b;
  if (a.valid) { if (b > 0) { if (x > 100) { x = x * 0.9; } } }
  database.save(x);
  mailer.send(a.email, "gracias");
  console.log(x);
  console.log(x);
  return x;
}`;

/* ============ UTILIDADES ============ */
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const pad = (number) => String(number).padStart(2, "0");
const findIdea = (id) => IDEAS.find((idea) => idea.id === id);

function createElement(tag, className = "", text = "") {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (text) element.textContent = text;
  return element;
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code) {
  const tokens = /(\/\/.*)|("[^"]*"|'[^']*')|\b(function|const|let|var|return|if|else|for|of|throw|new)\b|\b(\d+(?:\.\d+)?)\b/g;
  return escapeHtml(code).replace(tokens, (match, comment, string, keyword, number) => {
    const type = comment ? "com" : string ? "str" : keyword ? "kw" : "num";
    return `<span class="tk-${type}">${match}</span>`;
  });
}

function createCodeBlock(code) {
  const block = createElement("pre", "code");
  block.innerHTML = highlight(code);
  return block;
}

function setCode(block, code) {
  block.innerHTML = highlight(code);
  block.classList.remove("flash");
  void block.offsetWidth;
  block.classList.add("flash");
}

function countUp(element, target, suffix = "") {
  const start = parseInt(element.textContent, 10) || 0;
  const startTime = performance.now();
  const step = (now) => {
    const progress = Math.min((now - startTime) / 600, 1);
    element.textContent = Math.round(start + (target - start) * progress) + suffix;
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => { toast.hidden = true; }, 2200);
}

/* ============ PROGRESO ============ */
const discovered = new Set(loadProgress());

function loadProgress() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}

function saveProgress() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...discovered])); } catch { /* sin almacenamiento */ }
}

function completeIdea(id) {
  if (discovered.has(id)) return;
  discovered.add(id);
  saveProgress();
  updateProgress();
  showToast(`✓ Concepto ${pad(id)} descubierto`);
  if (discovered.size === TOTAL) setTimeout(() => { $("#celebration").hidden = false; }, 900);
}

function updateProgress() {
  const count = discovered.size;
  $("#topProgress").textContent = `${count} / ${TOTAL}`;
  countUp($("#labCount"), count);
  $("#labBar").style.width = `${(count / TOTAL) * 100}%`;
  $$(".card").forEach((card) => {
    const done = discovered.has(Number(card.dataset.id));
    card.classList.toggle("done", done);
    $(".badge", card).textContent = done ? "✓ DESCUBIERTO" : "PENDIENTE";
  });
  $$(".map-node").forEach((node) => node.classList.toggle("done", discovered.has(Number(node.dataset.id))));
  renderFinal();
}

/* ============ NAVEGACIÓN ============ */
function showView(name) {
  document.body.dataset.view = name;
  $$(".view").forEach((view) => view.classList.toggle("active", view.id === `view-${name}`));
  window.scrollTo(0, 0);
}

function openModal(id) {
  const idea = findIdea(id);
  const conclusion = buildConclusion(idea);
  const finish = () => { completeIdea(id); conclusion.classList.add("show"); };
  const body = $("#modalBody");
  body.replaceChildren(buildHeader(idea), buildComparison(idea), buildInteraction(idea, finish), conclusion);
  $("#modalTitle").textContent = `idea_${pad(id)}.js`;
  $("#modal").hidden = false;
  document.body.classList.add("noscroll");
}

function closeModal() {
  $("#modal").hidden = true;
  document.body.classList.remove("noscroll");
}

/* ============ MÓDULOS: PIEZAS COMUNES ============ */
function buildHeader(idea) {
  const header = createElement("div", "idea-head");
  header.innerHTML = `<span class="num">IDEA ${pad(idea.id)} / ${TOTAL}</span><h3>${idea.name}</h3><p>${idea.brief}</p><p class="key">“${idea.key}”</p>`;
  return header;
}

function buildConclusion(idea) {
  const box = createElement("div", "conclusion");
  box.innerHTML = `<strong>CONCLUSIÓN PRÁCTICA</strong><p>${idea.conclusion}</p>`;
  box.classList.toggle("show", discovered.has(idea.id));
  return box;
}

function buildComparison(idea) {
  const bad = idea.bad || idea.stages[0].code;
  const good = idea.good || idea.stages[idea.stages.length - 1].code;
  const wrapper = createElement("div", "compare");
  [["bad", "✗ CÓDIGO MALO", bad], ["good", "✓ CÓDIGO LIMPIO", good]].forEach(([kind, label, code]) => {
    const window_ = createElement("div", `window ${kind}`);
    window_.append(createElement("div", "tag", label), createCodeBlock(code));
    wrapper.append(window_);
  });
  return wrapper;
}

function buildInteraction(idea, finish) {
  const builders = { choice: buildChoice, steps: buildSteps, classify: buildClassify };
  return builders[idea.type](idea, finish);
}

function buildMeter(label) {
  const root = createElement("div", "meter");
  root.innerHTML = `<div class="top"><span>${label}</span><span class="value">0%</span></div><div class="bar"><div class="fill"></div></div>`;
  const fill = $(".fill", root);
  const set = (value) => {
    fill.style.width = `${value}%`;
    fill.className = `fill ${value < 40 ? "low" : value < 75 ? "mid" : "high"}`;
    countUp($(".value", root), value, "%");
  };
  return { root, set };
}

/* ============ MOTOR: ELEGIR ============ */
function buildChoice(idea, finish) {
  const box = createElement("div", "lab");
  const options = createElement("div", "options");
  const feedback = createElement("div", "feedback");
  box.append(createElement("p", "prompt", idea.prompt));
  if (idea.code) box.append(createCodeBlock(idea.code));

  idea.options.forEach((option) => {
    const button = createElement("button", "option");
    if (option.mono) button.append(createCodeBlock(option.label)); else button.textContent = option.label;
    button.addEventListener("click", () => handleChoice(option, button));
    options.append(button);
  });

  function handleChoice(option, button) {
    if (!option.correct) {
      button.classList.add("wrong");
      button.disabled = true;
      feedback.className = "feedback error";
      feedback.textContent = "Casi. Piénsalo otra vez…";
      return;
    }
    $$(".option", options).forEach((item) => { item.disabled = true; });
    button.classList.add("right");
    feedback.className = "feedback";
    feedback.textContent = `✓ ${idea.explain}`;
    if (idea.reveal) box.append(createCodeBlock(idea.reveal));
    finish();
  }

  box.append(options, feedback);
  return box;
}

/* ============ MOTOR: PASOS ============ */
function buildSteps(idea, finish) {
  const lastIndex = idea.stages.length - 1;
  const box = createElement("div", "lab");
  const codeView = createCodeBlock(idea.stages[0].code);
  const note = createElement("p", "note");
  const chips = createElement("div", "chips");
  const meter = buildMeter(idea.meterLabel);
  const button = createElement("button", "action", idea.button);
  const tests = idea.tests ? buildTests() : null;
  let index = 0;
  let busy = false;

  function renderStage() {
    const stage = idea.stages[index];
    setCode(codeView, stage.code);
    note.textContent = stage.note;
    chips.replaceChildren(...(stage.chips || []).map((text) => createElement("span", "chip", text)));
    meter.set(stage.meter);
  }

  async function advance() {
    if (busy) return;
    if (index === lastIndex) { index = 0; renderStage(); button.textContent = idea.button; if (tests) tests.reset(); return; }
    busy = true;
    button.disabled = true;
    index += 1;
    renderStage();
    if (tests) await tests.run();
    busy = false;
    button.disabled = false;
    if (index === lastIndex) { finish(); button.textContent = "REINICIAR"; }
  }

  button.addEventListener("click", advance);
  renderStage();
  box.append(meter.root, codeView, chips, note);
  if (tests) box.append(tests.root);
  box.append(button);
  return box;
}

function buildTests() {
  const root = createElement("div", "tests");
  const rows = [1, 2, 3, 4].map((number) => createElement("div", "", ""));
  const summary = createElement("div", "summary");
  const setRow = (row, number, status, css) => { row.textContent = `TEST ${pad(number)}   ${status}`; row.className = css; };
  const reset = () => {
    rows.forEach((row, position) => setRow(row, position + 1, "✓", "ok"));
    summary.textContent = "4/4 TESTS PASSED · versión original";
  };
  const run = async () => {
    summary.textContent = "Ejecutando pruebas…";
    rows.forEach((row, position) => setRow(row, position + 1, "…", "run"));
    for (let position = 0; position < rows.length; position++) {
      await wait(450);
      setRow(rows[position], position + 1, "✓", "ok");
    }
    summary.textContent = "4/4 TESTS PASSED — Ahora puedes mejorar el código sin miedo.";
  };
  root.append(...rows, summary);
  reset();
  return { root, run, reset };
}

/* ============ MOTOR: CLASIFICAR ============ */
function buildClassify(idea, finish) {
  const box = createElement("div", "lab");
  const feedback = createElement("div", "feedback");
  const checkButton = createElement("button", "action", "COMPROBAR");
  const choices = idea.items.map(() => -1);
  const rows = idea.items.map((item, position) => buildClassifyRow(item, position));

  function buildClassifyRow(item, position) {
    const row = createElement("div", "classify-row");
    const code = createElement("code", "", item.text);
    const toggle = createElement("button", "", "Sin clasificar");
    toggle.addEventListener("click", () => {
      choices[position] = (choices[position] + 1) % LEVEL_NAMES.length;
      toggle.textContent = LEVEL_NAMES[choices[position]];
      row.className = "classify-row";
    });
    row.append(code, toggle);
    return row;
  }

  checkButton.addEventListener("click", () => {
    let correct = 0;
    idea.items.forEach((item, position) => {
      const isRight = choices[position] === item.level;
      rows[position].className = `classify-row ${isRight ? "right" : "wrong"}`;
      if (isRight) correct += 1;
    });
    const allRight = correct === idea.items.length;
    feedback.className = allRight ? "feedback" : "feedback error";
    feedback.textContent = allRight
      ? "✓ Perfecto: la historia principal va arriba y los detalles sucios abajo, cada uno en su función."
      : `${correct}/${idea.items.length} correctas. Revisa las marcadas en rojo.`;
    if (allRight) finish();
  });

  box.append(createElement("p", "prompt", idea.prompt), ...rows, feedback, checkButton);
  return box;
}

/* ============ ESCÁNER ============ */
function matchCount(code, pattern) {
  return (code.match(pattern) || []).length;
}

function checkFunctions(code) {
  const count = matchCount(code, /\bfunction\b|=>/g);
  return count ? { ok: true, text: `Funciones detectadas: ${count}`, penalty: 0 }
    : { ok: false, text: "No se detectaron funciones", penalty: 5 };
}

function checkShortNames(code) {
  const declared = [...code.matchAll(/\b(?:let|const|var)\s+([A-Za-z_]\w?)\b/g)].map((match) => match[1]);
  const params = [...code.matchAll(/function\s*\w*\s*\(([^)]*)\)/g)]
    .flatMap((match) => match[1].split(",")).map((name) => name.trim()).filter((name) => name && name.length <= 2);
  const names = [...new Set([...declared, ...params])].filter((name) => !["i", "j", "k"].includes(name));
  return names.length ? { ok: false, text: `Nombres poco descriptivos: ${names.join(", ")}`, penalty: 15 }
    : { ok: true, text: "Nombres descriptivos", penalty: 0 };
}

function checkDuplication(code, lines) {
  const seen = {};
  lines.map((line) => line.trim()).filter((line) => line.length >= 14).forEach((line) => { seen[line] = (seen[line] || 0) + 1; });
  const repeated = Object.values(seen).filter((times) => times > 1).length;
  return repeated ? { ok: false, text: `Posible duplicación (${repeated} línea/s repetida/s)`, penalty: 15 }
    : { ok: true, text: "Sin duplicación evidente", penalty: 0 };
}

function checkConsoleLogs(code) {
  const count = matchCount(code, /console\.log/g);
  return count ? { ok: false, text: `console.log olvidados: ${count}`, penalty: 8 }
    : { ok: true, text: "Sin console.log", penalty: 0 };
}

function checkConditions(code) {
  const count = matchCount(code, /\bif\s*\(/g);
  return count > 4 ? { ok: false, text: `Demasiadas condiciones if (${count})`, penalty: 10 }
    : { ok: true, text: "Cantidad de condiciones razonable", penalty: 0 };
}

function checkComments(code, lines) {
  const comments = lines.filter((line) => line.trim().startsWith("//")).length;
  const excessive = comments >= 2 && comments / lines.length > 0.3;
  return excessive ? { ok: false, text: "Comentarios posiblemente innecesarios", penalty: 7 }
    : { ok: true, text: "Comentarios bajo control", penalty: 0 };
}

function checkSize(code, lines) {
  return lines.length > 20 ? { ok: false, text: `Función/bloque demasiado grande (${lines.length} líneas)`, penalty: 15 }
    : { ok: true, text: "Tamaño aceptable", penalty: 0 };
}

function checkResponsibilities(code) {
  const concerns = [/valid|check/i, /save|insert|database|db\./i, /send|mail/i, /document\.|innerHTML|\.style/i, /total|price|tax|calc/i];
  const found = concerns.filter((pattern) => pattern.test(code)).length;
  return found >= 3 ? { ok: false, text: "Posible función con demasiadas responsabilidades", penalty: 15 }
    : { ok: true, text: "Responsabilidades acotadas", penalty: 0 };
}

function analyzeCode(code) {
  const lines = code.split("\n").filter((line) => line.trim());
  const checks = [checkFunctions, checkShortNames, checkDuplication, checkConsoleLogs, checkConditions, checkComments, checkSize, checkResponsibilities]
    .map((check) => check(code, lines));
  const penalty = checks.reduce((sum, check) => sum + check.penalty, 0);
  checks.push(penalty < 30 ? { ok: true, text: "Estructura aceptable" } : { ok: false, text: "Estructura mejorable" });
  return { checks, score: Math.max(5, 100 - penalty) };
}

function renderScan() {
  const code = $("#scanInput").value;
  const result = $("#scanResult");
  if (!code.trim()) { result.innerHTML = '<p class="muted">Escribe o pega algo de código primero.</p>'; return; }
  const { checks, score } = analyzeCode(code);
  result.replaceChildren(createElement("strong", "label", "ANÁLISIS COMPLETADO"));
  checks.forEach((check, position) => {
    const line = createElement("div", `scan-line ${check.ok ? "ok" : "warn"}`, check.text);
    line.style.animationDelay = `${position * 120}ms`;
    result.append(line);
  });
  const scoreBox = createElement("div", "score");
  scoreBox.innerHTML = `<div class="label">CLEAN CODE SCORE</div><div class="num">0</div><div class="muted">/ 100</div><div class="bar"><div class="fill"></div></div>`;
  result.append(scoreBox);
  requestAnimationFrame(() => {
    $(".fill", scoreBox).style.width = `${score}%`;
    countUp($(".num", scoreBox), score);
  });
}

/* ============ MAPA ============ */
function renderMap() {
  const svg = $("#mapSvg");
  const ns = "http://www.w3.org/2000/svg";
  const centerX = 400, centerY = 290, radiusX = 300, radiusY = 215;
  const make = (tag, attributes, parent = svg) => {
    const node = document.createElementNS(ns, tag);
    Object.entries(attributes).forEach(([name, value]) => node.setAttribute(name, value));
    parent.append(node);
    return node;
  };

  IDEAS.forEach((idea, position) => {
    const angle = -Math.PI / 2 + (position * 2 * Math.PI) / TOTAL;
    const x = centerX + radiusX * Math.cos(angle), y = centerY + radiusY * Math.sin(angle);
    make("line", { class: "map-line", "data-id": idea.id, x1: centerX, y1: centerY, x2: x, y2: y });
    const node = make("g", { class: "map-node", "data-id": idea.id, tabindex: 0 });
    make("circle", { cx: x, cy: y, r: 24 }, node);
    make("text", { class: "n", x, y }, node).textContent = pad(idea.id);
    make("text", { class: "l", x, y: y + 42 }, node).textContent = idea.short;
    node.addEventListener("click", () => selectMapIdea(idea.id));
    node.addEventListener("keydown", (event) => { if (event.key === "Enter") selectMapIdea(idea.id); });
  });

  const center = make("g", { class: "map-center" });
  make("rect", { x: centerX - 90, y: centerY - 24, width: 180, height: 48, rx: 10 }, center);
  make("text", { x: centerX, y: centerY + 6 }, center).textContent = "CÓDIGO LIMPIO";
  svg.append(center);
  $("#mapInfo").innerHTML = '<p class="muted">Selecciona una idea del mapa.</p>';
}

function selectMapIdea(id) {
  const idea = findIdea(id);
  $$(".map-node").forEach((node) => node.classList.toggle("active", Number(node.dataset.id) === id));
  $$(".map-line").forEach((line) => line.classList.toggle("active", Number(line.dataset.id) === id));
  const info = $("#mapInfo");
  info.innerHTML = `<h3>${pad(id)} · ${idea.name}</h3><p>${idea.brief}</p>`;
  const open = createElement("button", "action", "ABRIR EXPERIMENTO");
  open.style.marginTop = ".8rem";
  open.addEventListener("click", () => openModal(id));
  info.append(open);
}

/* ============ RESULTADO FINAL ============ */
function renderFinal() {
  const box = $("#finalBox");
  const typedName = $("#certName") ? $("#certName").value : "";
  if (discovered.size < TOTAL) {
    box.innerHTML = `<div class="panel center"><p>🔒 Certificado bloqueado.</p><p class="muted">Te faltan ${TOTAL - discovered.size} concepto(s) por descubrir.</p></div>`;
    return;
  }
  box.innerHTML = `<div class="certificate">
      <pre class="ascii">╔══════════════════════════════╗
       LABORATORIO COMPLETADO
╚══════════════════════════════╝</pre>
      <p>Se certifica simbólicamente que</p>
      <div class="cert-name" id="certDisplay">${escapeHtml(typedName) || "—"}</div>
      <input id="certName" placeholder="Escribe tu nombre" maxlength="40" value="${escapeHtml(typedName)}">
      <p>descubrió las 11 ideas fundamentales del Código Limpio.</p>
      <p class="muted" style="margin-top:1rem;font-style:italic">“Un buen programador no solamente hace que el programa funcione; hace que el siguiente cambio sea fácil de realizar.”</p>
      <p class="muted" style="margin-top:1rem">${new Date().toLocaleDateString("es-MX")}</p></div>`;
  $("#certName").addEventListener("input", (event) => { $("#certDisplay").textContent = event.target.value || "—"; });
}

/* ============ HERO ============ */
async function typeInto(block, text, delay) {
  for (let length = 1; length <= text.length; length++) {
    block.innerHTML = highlight(text.slice(0, length)) + '<span class="cursor"></span>';
    await wait(delay);
  }
}

async function playHero() {
  const block = $("#heroCode");
  await typeInto(block, HERO_MESSY, 35);
  await wait(900);
  $("#heroFile").textContent = "refactorizando…";
  await wait(500);
  $("#heroFile").textContent = "limpio.js";
  await typeInto(block, HERO_CLEAN, 22);
  setCode(block, HERO_CLEAN);
  await wait(300);
  $("#heroQuote").classList.add("show");
  await wait(500);
  $("#enterBtn").classList.add("show");
}

/* ============ INICIO ============ */
function renderCards() {
  const grid = $("#cards");
  IDEAS.forEach((idea) => {
    const card = createElement("button", "card");
    card.dataset.id = idea.id;
    card.title = "Abrir experimento";
    card.innerHTML = `<span class="card-num">${pad(idea.id)}</span><h3>${idea.name}</h3><p>${idea.brief}</p><span class="badge">PENDIENTE</span>`;
    card.addEventListener("click", () => openModal(idea.id));
    grid.append(card);
  });
}

function bindEvents() {
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-go]");
    if (target) showView(target.dataset.go);
  });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape") closeModal(); });
  $("#enterBtn").addEventListener("click", () => showView("lab"));
  $("#modalClose").addEventListener("click", closeModal);
  $("#modal").addEventListener("click", (event) => { if (event.target.id === "modal") closeModal(); });
  $("#scanBtn").addEventListener("click", renderScan);
  $("#sampleBtn").addEventListener("click", () => { $("#scanInput").value = SAMPLE_CODE; renderScan(); });
  $("#keepExploring").addEventListener("click", () => { $("#celebration").hidden = true; });
  $("#seeCertificate").addEventListener("click", () => { $("#celebration").hidden = true; closeModal(); showView("final"); });
}

function init() {
  $("#scanInput").value = SAMPLE_CODE;
  renderCards();
  renderMap();
  bindEvents();
  updateProgress();
  playHero();
}

init();
