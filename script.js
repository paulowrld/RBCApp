const ATTR_META = {
    Age: { type: 'numeric', defaultWeight: 0.07 },
    Sex: { type: 'categorical', defaultWeight: 0.03 },
    Ethnicity: { type: 'categorical', defaultWeight: 0.05 },
    BMI: { type: 'numeric', defaultWeight: 0.08 },
    WaistCircumference: { type: 'numeric', defaultWeight: 0.08 },
    FastingBloodGlucose: { type: 'numeric', defaultWeight: 0.1 },
    HbA1c: { type: 'numeric', defaultWeight: 0.1 },
    BloodPressureSystolic: { type: 'numeric', defaultWeight: 0.05 },
    BloodPressureDiastolic: { type: 'numeric', defaultWeight: 0.05 },
    CholesterolTotal: { type: 'numeric', defaultWeight: 0.04 },
    CholesterolHDL: { type: 'numeric', defaultWeight: 0.04 },
    CholesterolLDL: { type: 'numeric', defaultWeight: 0.04 },
    GGT: { type: 'numeric', defaultWeight: 0.03 },
    SerumUrate: { type: 'numeric', defaultWeight: 0.03 },
    PhysicalActivityLevel: { type: 'categorical', defaultWeight: 0.04 },
    DietaryIntakeCalories: { type: 'numeric', defaultWeight: 0.04 },
    AlcoholConsumption: { type: 'categorical', defaultWeight: 0.03 },
    SmokingStatus: { type: 'categorical', defaultWeight: 0.03 },
    FamilyHistoryDiabetes: { type: 'binary', defaultWeight: 0.05 },
    PreviousGestationalDiabetes: { type: 'binary', defaultWeight: 0.05 }
  };
  
  let cases = [];
  let numericRanges = {};


  function loadCasesFromCSV(csvText) {
    const parsed = Papa.parse(csvText, { header: true, dynamicTyping: true });
    
    // Mapeamento de nomes do CSV para nomes usados no código
    const columnMap = {
      'Waist_Circumference': 'WaistCircumference',
      'Fasting_Blood_Glucose': 'FastingBloodGlucose',
      'Blood_Pressure_Systolic': 'BloodPressureSystolic',
      'Blood_Pressure_Diastolic': 'BloodPressureDiastolic',
      'Cholesterol_Total': 'CholesterolTotal',
      'Cholesterol_HDL': 'CholesterolHDL',
      'Cholesterol_LDL': 'CholesterolLDL',
      'Serum_Urate': 'SerumUrate',
      'Physical_Activity_Level': 'PhysicalActivityLevel',
      'Dietary_Intake_Calories': 'DietaryIntakeCalories',
      'Alcohol_Consumption': 'AlcoholConsumption',
      'Smoking_Status': 'SmokingStatus',
      'Family_History_of_Diabetes': 'FamilyHistoryDiabetes',
      'Previous_Gestational_Diabetes': 'PreviousGestationalDiabetes'
    };
    
    const normalizedData = parsed.data.filter(r => Object.keys(r).length > 1).map(row => {
      const newRow = {...row};
      
      for (const oldName in columnMap) {
        if (row[oldName] !== undefined) {
          newRow[columnMap[oldName]] = row[oldName];
          delete newRow[oldName];
        }
      }
      
      return newRow;
    });
    
    cases = normalizedData.slice(0, 500);
    computeNumericRanges();
  }
  
  function computeNumericRanges() {
    Object.keys(ATTR_META).forEach(attr => {
      if (ATTR_META[attr].type === 'numeric') {
        const values = cases.map(c => Number(c[attr])).filter(v => !isNaN(v));
        numericRanges[attr] = { min: Math.min(...values), max: Math.max(...values) };
      }
    });
  }
  
  function localSimilarity(attr, v1, v2) {
    const meta = ATTR_META[attr];

    if (v1 === undefined || v1 === null || v1 === '' || v2 === undefined || v2 === null || v2 === '') {
      return 0;
    }
  
    switch (meta.type) {
      case 'numeric': {
        const num1 = Number(v1);
        const num2 = Number(v2);
        if (isNaN(num1) || isNaN(num2)) return 0;
        const range = numericRanges[attr];
        if (!range || range.max === range.min) return 1;
        return 1 - Math.abs(num1 - num2) / (range.max - range.min);
      }
      case 'categorical':
      case 'binary':
        return v1 === v2 ? 1 : 0;
      default:
        return 0;
    }
  }
  
  function totalSimilarity(caseA, caseB, weights) {
    let num = 0, den = 0;
    for (const attr in ATTR_META) {
      const w = weights[attr] ?? ATTR_META[attr].defaultWeight;
      const s = localSimilarity(attr, caseA[attr], caseB[attr]);
      num += w * s;
      den += w;
    }
    const score = den === 0 ? 0 : num / den;
    return isNaN(score) ? 0 : score;
  }
  
  function getCurrentWeights() {
    const weights = {};
    for (const attr in ATTR_META) {
      const elem = document.getElementById(`weight-${attr}`);
      weights[attr] = elem ? Number(elem.value) : ATTR_META[attr].defaultWeight;
    }
    return weights;
  }
  
  function getInputCase() {
    const obj = {};
    for (const attr in ATTR_META) {
      const elem = document.getElementById(`input-${attr}`);
      if (!elem) continue;
      const val = elem.value;
      switch (ATTR_META[attr].type) {
        case 'numeric':
          obj[attr] = val === '' ? undefined : Number(val);
          break;
        case 'binary':
          obj[attr] = val === '' ? undefined : (val === '1' || val === 'true' ? 1 : 0);
          break;
        default:
          obj[attr] = val;
      }
    }
    return obj;
  }
  
  function runSimilarity() {
    if (cases.length === 0) {
      alert('Base de casos não carregada!');
      return;
    }
    const inputCase = getInputCase();
    const weights = getCurrentWeights();
    const results = cases
      .map(c => ({ caseData: c, similarity: totalSimilarity(inputCase, c, weights) }))
      .sort((a, b) => b.similarity - a.similarity);
    renderResults(inputCase, results);
  }
  

  function formatCell(val) {
    return val === undefined || val === null || val === '' ? '-' : val;
  }
  
  function renderResults(inputCase, results) {
    const container = document.getElementById('results');
    container.innerHTML = '';
  
    const inpDiv = document.createElement('pre');
    inpDiv.textContent = `Caso de entrada:\n${JSON.stringify(inputCase, null, 2)}`;
    container.appendChild(inpDiv);
  
    const table = document.createElement('table');
    table.classList.add('table-results');
  
    const thead = document.createElement('thead');
    const headRow = document.createElement('tr');
    headRow.innerHTML = '<th>#</th>' + Object.keys(ATTR_META).map(a => `<th>${a}</th>`).join('') + '<th>% Similaridade</th>';
    thead.appendChild(headRow);
    table.appendChild(thead);
  
    const tbody = document.createElement('tbody');
    results.forEach((r, idx) => {
      const row = document.createElement('tr');
      row.innerHTML = `<td>${idx + 1}</td>` +
        Object.keys(ATTR_META).map(a => `<td>${formatCell(r.caseData[a])}</td>`).join('') +
        `<td>${(r.similarity * 100).toFixed(1)}%</td>`;
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
  
    const wrapper = document.createElement('div');
    wrapper.className = 'table-wrapper';
    wrapper.appendChild(table);
    container.appendChild(wrapper);
  }
  
  document.getElementById('btnRun')?.addEventListener('click', runSimilarity);
  
  fetch('dataset.csv')
    .then(resp => resp.ok ? resp.text() : Promise.reject('CSV não encontrado'))
    .then(loadCasesFromCSV)
    .catch(err => console.warn('Aviso:', err));
