/* ----------  CONFIG  ---------- */
const DB_NAME = 'GestionTareas';
const STORE   = 'tareas';
const VERSION = 1;
const LIST_SEL= '#tblPendientes tbody';  

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

/* ----------  LEE TODOS  ---------- */
async function leerTodos() {
    const tx = db.transaction(STORE, 'readonly');
    return await tx.store.getAll();
}

/* ----------  PINTA TABLA  ---------- */
async function pintarLista() {
    const regs = await leerTodos();
    listaEl.innerHTML = '';
    regs.forEach(t => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${t.Numero}</td>
            <td>${t.Nombre}</td>
            <td>${t.Asunto}</td>`;
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

/* ----------  INICIO  ---------- */
window.addEventListener('DOMContentLoaded', async () => {
    await abrirBD();
    await pintarLista();
});