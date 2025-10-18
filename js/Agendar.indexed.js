/* ----------  CONFIG  ---------- */
const DB_NAME = 'GestionTareas';
const STORE   = 'tareas';
const VERSION = 1;
const LIST_SEL= '#tblTareas tbody'; 

let db;
const listaEl = document.querySelector(LIST_SEL);

/* ----------  ABRE BD  ---------- */
async function abrirBD() {
    db = await idb.openDB(DB_NAME, VERSION, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE)) {
                db.createObjectStore(STORE, {keyPath: 'id', autoIncrement: true});
            }
        }
    });
}

/* ----------  CREAR REGISTRO  ---------- */
async function crearRegistro(datos) {
    const tx = db.transaction(STORE, 'readwrite');
    await tx.store.add(datos);
    await tx.done;
}
async function leerTodos() {
    const tx = db.transaction(STORE, 'readonly');
    return await tx.store.getAll();
}
async function actualizarRegistro(datos) {
    const tx = db.transaction(STORE, 'readwrite');
    await tx.store.put(datos);
    await tx.done;
}
async function borrarRegistro(id) {
    const tx = db.transaction(STORE, 'readwrite');
    await tx.store.delete(id);
    await tx.done;
}

/* ----------  PINTAR TABLA   ---------- */

async function pintarLista() {
    const tx  = db.transaction(STORE, 'readonly');
    const regs= await tx.store.getAll();
    listaEl.innerHTML = '';
    regs.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${t.Numero}</td>
            <td>${t.Nombre}</td>
            <td>${t.Asunto}</td>
            <td><button onclick="eliminar(${t.id})">Eliminar</button></td>`;
        listaEl.appendChild(tr);
    });
}
/* ----------  ELIMINAR  ---------- */
window.eliminar = async id => {
    if (!confirm('¿Borrar Tarea?')) return;
    const tx = db.transaction(STORE, 'readwrite');
    await tx.store.delete(id);
    await tx.done;
    await pintarLista();
};

/* ----------  FORMULARIO  ---------- */
const form = document.querySelector('#frmTareas');
form.addEventListener('submit', async e => {
    e.preventDefault();
    const datos = {
        Numero: Number(document.querySelector('#Id').value),
        Nombre: document.querySelector('#Nombre').value.trim(),
        Asunto: document.querySelector('#asunto').value.trim()
    };
    await crearRegistro(datos);
    form.reset();
    await pintarLista();   // actualiza la tabla de esta misma página
});

/* ----------  INICIO  ---------- */
window.addEventListener('DOMContentLoaded', async () => {
    await abrirBD();
    await pintarLista();
});