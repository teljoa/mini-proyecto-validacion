import { getClients, getReservations } from './api.js';

const clientsTable = document.querySelector('#clientsTable tbody');
const reservationsTable = document.querySelector('#reservationsTable tbody');

async function loadClients(){
    const clients = await getClients();
    clientsTable.innerHTML = clients.map(c=>`
        <tr>
            <td>${c.id}</td>
            <td>${c.fullname}</td>
            <td>${c.phone}</td>
            <td>${c.email}</td>
            <td>${c.age}</td>
            <td>${c.dni}</td>
            <td>
                <button data-id="${c.id}" class="edit-client">Editar</button>
                <button data-id="${c.id}" class="delete-client">Borrar</button>
            </td>
        </tr>
    `).join('');
}

async function loadReservations(){
    const reservations = await getReservations();
    reservationsTable.innerHTML = reservations.map(r=>`
        <tr>
            <td>${r.id}</td>
            <td>${r.date}</td>
            <td>${r.time}</td>
            <td>${r.people}</td>
            <td>${r.clientId}</td>
            <td>${r.activity}</td>
            <td>
                <button data-id="${r.id}" class="edit-res">Editar</button>
                <button data-id="${r.id}" class="delete-res">Borrar</button>
            </td>
        </tr>
    `).join('');
}

async function deleteItem(type, id){
    await fetch(`http://localhost:3000/${type}/${id}`, { 
        method:'DELETE'
    });

    if(type==='clients') loadClients();

    if(type==='reservations') loadReservations();
}

document.addEventListener('click', async (e)=>{
    if(e.target.classList.contains('delete-client')){
        const id = e.target.dataset.id;
        await deleteItem('clients', id);
    }

    if(e.target.classList.contains('delete-res')){
        const id = e.target.dataset.id;
        await deleteItem('reservations', id);
    }
});

loadReservations();
loadClients();