// UI
const form = document.getElementById('form');
const inputsDiv = document.getElementById('inputs');
const outDiv = document.getElementById('pred');
const dbg = document.getElementById('debug');

let session = null;
let scaler = null; // { mean: [...], scale: [...], feature_names: [...] }

// Build numeric inputs from feature list
function buildInputs(featureNames) {
  inputsDiv.innerHTML = '';
  featureNames.forEach(name => {
    const id = `f_${name.replace(/[^a-zA-Z0-9_]/g,'_')}`;
    const wrap = document.createElement('div');
    wrap.className = 'field';
    const label = document.createElement('label');
    label.htmlFor = id;
    label.textContent = name;
    const input = document.createElement('input');
    input.type = 'number';
    input.step = 'any';
    input.id = id;
    input.placeholder = 'e.g. 0';
    wrap.appendChild(label);
    wrap.appendChild(input);
    inputsDiv.appendChild(wrap);
  });
}

async function loadAssets() {
  // Load scaler (includes feature_names)
  const sResp = await fetch('./weather_scaler.json');
  scaler = await sResp.json();
  if (!scaler || !Array.isArray(scaler.feature_names)) {
    throw new Error('weather_scaler.json missing feature_names');
  }
  buildInputs(scaler.feature_names);

  // Load ONNX model
  session = await ort.InferenceSession.create('./weather_regression.onnx', {
    executionProviders: ['wasm']
  });
}

function getVectorFromForm() {
  const feats = scaler.feature_names;
  const x = new Array(feats.length);
  for (let i = 0; i < feats.length; i++) {
    const id = `f_${feats[i].replace(/[^a-zA-Z0-9_]/g,'_')}`;
    const el = document.getElementById(id);
    const v = parseFloat(el.value);
    x[i] = Number.isFinite(v) ? v : 0;
  }
  return x;
}

function applyScaler(x) {
  const mean = scaler.mean;
  const scale = scaler.scale;
  return x.map((v,i) => (v - mean[i]) / scale[i]);
}

async function predict(xArr) {
  const xScaled = applyScaler(xArr);
  const D = xScaled.length;
  const input = new ort.Tensor('float32', Float32Array.from(xScaled), [1, D]);
  const out = await session.run({ input }); 
  const y = out.output.data[0]; 
  return { y, x:xArr, xScaled };
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    if (!session) { await loadAssets(); }
    const x = getVectorFromForm();
    const { y, xScaled } = await predict(x);
    outDiv.textContent = `${y.toFixed(2)} °C`;
    dbg.textContent = JSON.stringify({ features: scaler.feature_names, x, xScaled, pred_celsius: y }, null, 2);
  } catch (err) {
    outDiv.textContent = 'Error. See console.';
    console.error(err);
  }
});

// Preload so first click is instant
loadAssets().catch(console.error);
