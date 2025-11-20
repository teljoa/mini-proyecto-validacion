import { isRequired, isBetween, isFutureDate } from './validators.js';
import { getClientById, createReservation } from './api.js';

const form = document.getElementById('reservationForm');
const fechaEl = document.getElementById('fecha');
const horaEl = document.getElementById('hora');
const numPersonasEl = document.getElementById('numPersonas');
const clienteIdEl = document.getElementById('clienteId');
const tipoActividadEl = document.getElementById('tipoActividad');

async function validateFecha() {
    const fecha = fechaEl.value;
    if (!isRequired(fecha)) return setError(fechaEl, 'La fecha es obligatoria');
    if (!isFutureDate(fecha)) return setError(fechaEl, 'La fecha debe ser posterior al día actual');
    setSuccess(fechaEl);
    return true;
}

function validateHora() {
    const hora = horaEl.value;
    if (!isRequired(hora)) return setError(horaEl, 'La hora es obligatoria');
    const [hh, mm] = hora.split(':').map(Number);
    if (hh < 10 || hh > 22) return setError(horaEl, 'La hora debe estar entre 10:00 y 22:00');
    setSuccess(horaEl);
    return true;
}

function validateNumPersonas() {
    const num = parseInt(numPersonasEl.value, 10);
    if (!isRequired(numPersonasEl.value)) return setError(numPersonasEl, 'Número de personas obligatorio');
    if (!isBetween(num, 1, 10)) return setError(numPersonasEl, 'Número de personas debe ser entre 1 y 10');
    setSuccess(numPersonasEl);
    return true;
}

async function validateClienteId() {
    const id = clienteIdEl.value;
    if (!isRequired(id)) return setError(clienteIdEl, 'ID del cliente obligatorio');

    try {
        const cliente = await getClientById(id);
        if (!cliente) return setError(clienteIdEl, 'Cliente no encontrado');
        setSuccess(clienteIdEl);
        return true;
    } catch {
        return setError(clienteIdEl, 'Error al verificar cliente');
    }
}

function validateTipoActividad() {
    if (!isRequired(tipoActividadEl.value)) return setError(tipoActividadEl, 'Selecciona un tipo de actividad');
    setSuccess(tipoActividadEl);
    return true;
}

function setError(element, message) {
    const formField = element.parentElement;
    formField.classList.remove('success');
    formField.classList.add('error');
    const small = formField.querySelector('small');
    small.textContent = message;
    return false;
}

function setSuccess(element) {
    const formField = element.parentElement;
    formField.classList.remove('error');
    formField.classList.add('success');
    const small = formField.querySelector('small');
    small.textContent = '';
    return true;
}

function debounce(fn, delay = 500) {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn(...args), delay);
    };
}

form.addEventListener('input', debounce(async (e) => {
    switch (e.target.id) {
        case 'fecha': await validateFecha(); break;
        case 'hora': validateHora(); break;
        case 'numPersonas': validateNumPersonas(); break;
        case 'clienteId': await validateClienteId(); break;
        case 'tipoActividad': validateTipoActividad(); break;
    }
}));

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const validFecha = await validateFecha();
    const validHora = validateHora();
    const validNum = validateNumPersonas();
    const validCliente = await validateClienteId();
    const validTipo = validateTipoActividad();

    if (validFecha && validHora && validNum && validCliente && validTipo) {
        const reservation = {
            fecha: fechaEl.value,
            hora: horaEl.value,
            numPersonas: parseInt(numPersonasEl.value, 10),
            clienteId: clienteIdEl.value,
            tipoActividad: tipoActividadEl.value
        };

        try {
            await createReservation(reservation);
            alert('Reserva registrada correctamente');
            form.reset();
            document.querySelectorAll('.form-field').forEach(field => field.classList.remove('success'));
        } catch (error) {
            alert('Error al registrar la reserva');
            console.error(error);
        }
    } else {
        alert('Corrige los errores antes de enviar');
    }
});