export function isRequired(value){
    return value !== null && value !== undefined && String(value).trim() !== '';
}

export function isBetween(len, min, max){
    return typeof len === 'number' && len >= min && len <= max;
}

export function isNumber(value){
    return /^\d+$/.test(String(value));
}


export function isPhoneValid(phone){
    return /^\d{9}$/.test(String(phone));
}


export function isEmailValid(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).toLowerCase());
}


export function isDNICorrect(dni){
    return /^\d{3}\d{5}[A-Za-z]$/.test(String(dni));
}


export function debounce(fn, delay=300){
    let timer = null;
    return (...args)=>{
        clearTimeout(timer);
        timer = setTimeout(()=>fn.apply(this,args), delay);
    };
}