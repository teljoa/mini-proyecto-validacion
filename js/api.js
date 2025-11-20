const BASE = 'http://localhost:3000'; 

export async function getClients(){
    const res = await fetch(`${BASE}/clients`);
    return res.json();
}

export async function getClientById(id){
    const res = await fetch(`${BASE}/clients/${id}`);

    if(res.status === 404) return null;

    return res.json();
}

export async function checkEmailExists(email){
    const res = await fetch(`${BASE}/clients?email=${encodeURIComponent(email)}`);
    const arr = await res.json();

    return arr.length > 0;
}

export async function postClient(client){
    const res = await fetch(`${BASE}/clients`,{
        method:'POST',  
        headers:{'Content-Type':'application/json'}, 
        body:JSON.stringify(client)
    });

    return res.json();
}

export async function getReservations(){
    const res = await fetch(`${BASE}/reservations`);
    
    return res.json();
}


export async function postReservation(reservation){
    const res = await fetch(`${BASE}/reservations`,{
        method:'POST', 
        headers:{'Content-Type':'application/json'}, 
        body:JSON.stringify(reservation)
    });

    return res.json();
}

export async function checkDuplicateReservation(date, time, clientId){
    const res = await fetch(`${BASE}/reservations?date=${date}&time=${time}&clientId=${clientId}`);
    const arr = await res.json();
    
    return arr.length > 0;
}