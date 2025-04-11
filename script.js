// Body
const body = document.body;
body.style.margin = '0';
body.style.fontFamily = 'Arial, sans-serif';
body.style.display = 'flex';
body.style.height = '100vh';

// Sidebar
const sidebar = document.createElement('div');
sidebar.style.width = '100px';
sidebar.style.background = '#2c3e50';
sidebar.style.color = 'white';
sidebar.style.padding = '20px';
sidebar.style.display = 'flex';
sidebar.style.flexDirection = 'column';
sidebar.style.gap = '20px';
sidebar.style.fontSize = '14px';
sidebar.innerHTML = '<div><strong>Dashboard Incidentes</strong></div>';
body.appendChild(sidebar);

// Contenedor principal
const content = document.createElement('div');
content.style.flex = '1';
content.style.background = '#ecf0f1';
content.style.padding = '20px';
body.appendChild(content);

// Encabezado y botones
const header = document.createElement('div');
header.style.display = 'flex';
header.style.justifyContent = 'space-between';
header.style.alignItems = 'center';
header.style.marginBottom = '20px';

const title = document.createElement('h2');
title.textContent = 'Gestión de Incidentes';
header.appendChild(title);

const btnGroup = document.createElement('div');

// Botones arriba
['Ver todos', 'Buscar por ID', 'Actualizar', 'Eliminar'].forEach((label, index) => {
  const btn = document.createElement('button');
  btn.textContent = label;
  btn.style.marginLeft = '10px';
  btn.style.padding = '10px';
  btn.style.cursor = 'pointer';
  btn.style.border = 'none';
  btn.style.borderRadius = '5px';
  btn.style.background = '#3498db';
  btn.style.color = 'white';
  btn.onclick = () => handleAction(index);
  btnGroup.appendChild(btn);
});

// Botón para crear incidente
const createBtn = document.createElement("button");
createBtn.textContent = "Crear Incidente";
Object.assign(createBtn.style, {
  backgroundColor: "#3498db",
  color: "white",
  padding: "10px",
  borderRadius: "5px",
  border: "none",
  cursor: "pointer",
  marginLeft: "10px",
});
createBtn.onclick = () => showCreateForm();
btnGroup.appendChild(createBtn);

header.appendChild(btnGroup);
content.appendChild(header);

// Contenedor para resultados
const resultBox = document.createElement('div');
resultBox.style.background = 'white';
resultBox.style.padding = '20px';
resultBox.style.borderRadius = '10px';
content.appendChild(resultBox);

// Manejo de acciones por cada uno de los botones
function handleAction(index) {
  resultBox.innerHTML = '';
  if (index === 0) getAllIncidents();
  else if (index === 1) searchByID();
  else if (index === 2) updateForm();
  else if (index === 3) deleteForm();
}

// Inputs
function createInput(labelText, id) {
  const label = document.createElement('label');
  label.textContent = labelText;
  label.style.display = 'block';
  const input = document.createElement('input');
  input.id = id;
  input.style.marginBottom = '10px';
  input.style.padding = '5px';
  input.style.width = '100%';
  resultBox.appendChild(label);
  resultBox.appendChild(input);
  return input;
}

function createButton(text, onclick) {
  const btn = document.createElement('button');
  btn.textContent = text;
  btn.style.padding = '10px';
  btn.style.marginTop = '10px';
  btn.style.background = '#2ecc71';
  btn.style.color = 'white';
  btn.style.border = 'none';
  btn.style.cursor = 'pointer';
  btn.onclick = onclick;
  resultBox.appendChild(btn);
}

// Función para creación de incidentes
function showCreateForm() {
    resultBox.innerHTML = '';
  
    const reporterInput = createInput('Reportado por:', 'createReporter');
    const descriptionInput = createInput('Descripción (mínimo 10 caracteres):', 'createDescription');
  
    const statusLabel = document.createElement('label');
    statusLabel.textContent = 'Estado del incidente:';
    statusLabel.style.display = 'block';
    resultBox.appendChild(statusLabel);
  
    const statusSelect = document.createElement('select');
    ['pendiente', 'en proceso', 'resuelto'].forEach(status => {
      const opt = document.createElement('option');
      opt.value = status;
      opt.textContent = status;
      statusSelect.appendChild(opt);
    });
    statusSelect.id = 'createStatus';
    statusSelect.style.marginBottom = '10px';
    statusSelect.style.padding = '5px';
    statusSelect.style.width = '100%';
    resultBox.appendChild(statusSelect);
  
    createButton('Crear Incidente', () => {
      const reporter = reporterInput.value.trim();
      const description = descriptionInput.value.trim();
      const status = statusSelect.value;
  
      if (!reporter || description.length < 10) {
        alert("Por favor, completa todos los campos. La descripción debe tener al menos 10 caracteres.");
        return;
      }
  
      fetch('http://127.0.0.1:5000/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reporter, description, status })
      })
      .then(res => res.json())
      .then(data => {
        alert("Incidente creado exitosamente.");
        handleAction(0); 
      })
      .catch(err => {
        alert("Error al crear el incidente.");
        console.error(err);
      });
    });
  }
  

// Obtener todos los incidentes
function getAllIncidents() {
  fetch('http://127.0.0.1:5000/incidents')
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        resultBox.textContent = 'No hay incidentes registrados.';
        return;
      }
      const table = document.createElement('table');
      table.style.width = '100%';
      table.style.borderCollapse = 'collapse';
      const headerRow = document.createElement('tr');
      ['ID', 'Reportero', 'Descripción', 'Estado', 'Creado'].forEach(h => {
        const th = document.createElement('th');
        th.textContent = h;
        th.style.background = '#2980b9';
        th.style.color = 'white';
        th.style.padding = '10px';
        headerRow.appendChild(th);
      });
      table.appendChild(headerRow);
      data.forEach(inc => {
        const row = document.createElement('tr');
        inc.forEach(cell => {
          const td = document.createElement('td');
          td.textContent = cell;
          td.style.padding = '10px';
          td.style.borderBottom = '1px solid #ddd';
          row.appendChild(td);
        });
        table.appendChild(row);
      });
      resultBox.appendChild(table);
    });
}

// Buscar por ID
function searchByID() {
  const input = createInput('ID del incidente:', 'searchId');
  createButton('Buscar', () => {
    fetch(`http://127.0.0.1:5000/incidents/${input.value}`)
      .then(res => res.json())
      .then(data => {
        resultBox.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      });
  });
}

// Actualizar incidente
function updateForm() {
  const idInput = createInput('ID del incidente a actualizar:', 'updateId');
  const statusInput = createInput('Nuevo estado (pendiente, en proceso, resuelto):', 'newStatus');
  createButton('Actualizar', () => {
    fetch(`http://127.0.0.1:5000/incidents/${idInput.value}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: statusInput.value })
    })
    .then(res => res.json())
    .then(data => {
      resultBox.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    });
  });
}

// Eliminar incidente
function deleteForm() {
  const input = createInput('ID del incidente a eliminar:', 'deleteId');
  createButton('Eliminar', () => {
    fetch(`http://127.0.0.1:5000/incidents/${input.value}`, { method: 'DELETE' })
      .then(res => res.json())
      .then(data => {
        resultBox.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
      });
  });
}
