import { isRequired, isBetween, isPhoneValid, isEmailValid, isDNICorrect, debounce } from './validators.js';
import { postClient, checkEmailExists } from './api.js';

const form = document.getElementById('clientForm');
const messageEl = document.getElementById('clientMessage');

function showError(fieldEl, msg){
    const container = fieldEl.closest('.form-field');
    container.classList.remove('success');
    container.classList.add('error');

    const small = container.querySelector('small');
    small.textContent = msg;
}

function showSuccess(fieldEl){
    const container = fieldEl.closest('.form-field');
    container.classList.remove('error');
    container.classList.add('success');

    const small = container.querySelector('small');
    small.textContent = '';
}

function validateFullname(value){
    if(!isRequired(value)) return 'El nombre es obligatorio.';

    if(!isBetween(value.trim().length,3,40)) return 'Entre 3 y 40 caracteres.';

    return '';
}

function validatePhone(value){
    if(!isRequired(value)) return 'Teléfono obligatorio.';

    if(!isPhoneValid(value)) return 'Teléfono inválido (9 dígitos).';

    return '';
}

function validateEmail(value){
    if(!isRequired(value)) return 'Email obligatorio.';

    if(!isEmailValid(value)) return 'Email inválido.';
    
    return '';
}

function validateAge(value){
    if(!isRequired(value)) return 'Edad obligatoria.';

    const n = Number(value);

    if(Number.isNaN(n) || n < 18 || n > 100) return 'Edad entre 18 y 100.';

    return '';
}

function validateDNI(value){
    if(!isRequired(value)) return 'DNI obligatorio.';

    if(!isDNICorrect(value)) return 'DNI inválido (ej. 12300000A).';

    return '';
}

form.addEventListener('input', debounce((e)=>{
    const target = e.target;
    if(!target.name) return;

    switch(target.name){
        case 'fullname': {
            const err = validateFullname(target.value);
            err ? showError(target, err) : showSuccess(target);
            break;
        }
        case 'phone': {
            const err = validatePhone(target.value);
            err ? showError(target, err) : showSuccess(target);
            break;
        }
        case 'email': {
            const err = validateEmail(target.value);

            if(err){ 
                showError(target, err); 
            }
            else{ 
                showSuccess(target); 
            }
            break;
        }
        case 'age': {
            const err = validateAge(target.value);
            err ? showError(target, err) : showSuccess(target);
            break;
        }
        case 'dni': {
            const err = validateDNI(target.value);
            err ? showError(target, err) : showSuccess(target);
            break;
        }
    }
}, 300));

form.addEventListener('submit', async (ev)=>{
ev.preventDefault();

messageEl.textContent = '';
const data = Object.fromEntries(new FormData(form).entries());

const validators = [
    ['fullname', validateFullname],
    ['phone', validatePhone],
    ['email', validateEmail],
    ['age', validateAge],
    ['dni', validateDNI]
];

let hasError = false;

  for(const [name, fn] of validators){
    const input = form.elements[name];
    const err = fn(input.value);

    if(err){
      showError(input, err);
      hasError = true;
    } else {
      showSuccess(input);
    }
  }

  if(hasError){
    messageEl.textContent = 'Corrige los errores antes de enviar.';
    return;
  }

  const emailExists = await checkEmailExists(data.email);

  if(emailExists){
    const emailInput = form.elements['email'];
    showError(emailInput, 'El email ya existe.');
    messageEl.textContent = 'Corrige los errores antes de enviar.';

    return;
  }

  const payload = {
    fullname: data.fullname.trim(),
    phone: data.phone.trim(),
    email: data.email.trim().toLowerCase(),
    age: Number(data.age),
    dni: data.dni.trim()
  };

  try{
    await postClient(payload);
    messageEl.textContent = 'Cliente creado correctamente.';
    form.reset();

    form.querySelectorAll('.form-field').forEach(f=>{
      f.classList.remove('error', 'success');
      f.querySelector('small').textContent = '';
    });

  } catch(err){
    console.error(err);
    messageEl.textContent = 'Error al crear cliente.';
  }
});