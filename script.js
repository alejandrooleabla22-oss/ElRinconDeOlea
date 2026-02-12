const REPARACION_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynV10StODFoSXTMZHL_mAoyAgoUoUJoKMDyIQb1N12lFu6yYgN3aoBaMGNkMi4Rd5a/exec";
const SUSCRIPCION_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbynV10StODFoSXTMZHL_mAoyAgoUoUJoKMDyIQb1N12lFu6yYgN3aoBaMGNkMi4Rd5a/exec";

// Register Service Worker for Offline Access
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker Registered'))
            .catch(err => console.log('SW Registration failed', err));
    });
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Detail Items Accordion (For Individual Pages)
const detailItems = document.querySelectorAll('.detail-item');

detailItems.forEach(item => {
    const header = item.querySelector('.detail-header');

    header.addEventListener('click', () => {
        // Close others? Optional. keeping independent for now allows multiple open.
        // To close others:
        /*
        detailItems.forEach(other => {
            if(other !== item) other.classList.remove('active');
        });
        */

        item.classList.toggle('active');
    });
});


// Contact Form Handler (Reparaciones)
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btn.disabled = true;

        if (REPARACION_SCRIPT_URL.includes("URL_DE_")) {
            console.error("No has pegado la URL de Google Sheets en script.js");
            return;
        }

        const formData = new FormData(contactForm);
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            params.append(key, value);
        }

        console.log("Enviando datos de reparación a:", REPARACION_SCRIPT_URL);

        fetch(REPARACION_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: params
        })
            .then(response => {
                console.log('✅ Intento de envío realizado a Google (Reparación)');
                console.log('Nota: Si no ves los datos en el Excel, revisa el permiso "Cualquier persona" en Google Apps Script.');
                contactForm.style.display = 'none';
                document.getElementById('successMessage').style.display = 'block';
                contactForm.reset();
            })
            .catch(error => {
                console.error('❌ Error de red al intentar conectar con Google:', error);
                alert('Hubo un problema de conexión. Revisa tu internet o la configuración del script de Google.');
            })
            .finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
    });
}

// Subscription Form Handler (Nuevo Club)
const subscriptionForm = document.getElementById('subscriptionForm');
if (subscriptionForm) {
    subscriptionForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const btn = subscriptionForm.querySelector('button');
        const originalText = btn.innerHTML;

        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        btn.disabled = true;

        if (SUSCRIPCION_SCRIPT_URL.includes("URL_DE_")) {
            console.error("No has pegado la URL de suscripción en script.js");
            return;
        }

        const formData = new FormData(subscriptionForm);
        const params = new URLSearchParams();
        for (const [key, value] of formData.entries()) {
            params.append(key, value);
        }

        console.log("Enviando datos de suscripción a:", SUSCRIPCION_SCRIPT_URL);

        fetch(SUSCRIPCION_SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            body: params
        })
            .then(response => {
                console.log('✅ Intento de envío realizado a Google (Suscripción)');
                console.log('Nota: Si no ves los datos en el Excel, revisa el permiso "Cualquier persona" en Google Apps Script.');
                subscriptionForm.style.display = 'none';
                document.getElementById('successSubscription').style.display = 'block';
                const header = document.querySelector('.contact-header');
                if (header) header.style.display = 'none';
                subscriptionForm.reset();
            })
            .catch(error => {
                console.error('❌ Error de red al intentar conectar con Google (Suscripción):', error);
                alert('Hubo un problema al enviar la suscripción. Revisa tu conexión.');
            })
            .finally(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
            });
    });
}
// Check for URL parameters to pre-fill the form
const urlParams = new URLSearchParams(window.location.search);
const asunto = urlParams.get('asunto');
if (asunto) {
    console.log("Detectado mensaje de entrada:", asunto);
    const detailsField = document.getElementById('detalles');
    const problemaField = document.getElementById('problema');
    const dispositivoField = document.getElementById('dispositivo');

    if (detailsField) detailsField.value = asunto;

    // Extraer dispositivo y problema para campos obligatorios
    try {
        if (asunto.includes("ayuda con mi ") && asunto.includes(". El problema es:")) {
            const part1 = asunto.split("ayuda con mi ")[1];
            const device = part1.split(". El problema es:")[0];
            const problem = part1.split(". El problema es:")[1].replace(".", "");

            if (dispositivoField) dispositivoField.value = device;
            if (problemaField) problemaField.value = problem;
        } else {
            // Fallback si el formato es distinto
            if (problemaField) problemaField.value = "Consulta General";
            if (dispositivoField) dispositivoField.value = "No especificado";
        }
    } catch (err) {
        console.error("Error parseando asunto:", err);
    }

    if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });
    }
}

// Quick Selector Logic
const problemsData = {
    pc: ["Limpieza Profunda / Pasta Térmica", "Mantenimiento Técnico (Placa/Bisagras)", "Pack Software Pro (Optimización)", "Actualización (RAM/SSD)", "Cambio de Pantalla", "Consultoría / Asesoramiento", "Virus / Malware", "Otro"],
    consola: ["Limpieza Profunda (Sobrecalentamiento)", "Mandos / Joysticks (Drift)", "Puertos (HDMI/USB/Carga)", "Reparación de Lentes", "Pantalla Portátiles (Switch/Deck)", "Batería / Autonomía", "Mantenimiento de Software", "Otro"]
};

const deviceSelector = document.getElementById('deviceSelector');
const problemSelector = document.getElementById('problemSelector');
const customProblemWrapper = document.getElementById('customProblemWrapper');
const customProblemInput = document.getElementById('customProblemInput');
const quickSubmit = document.getElementById('quickSubmit');

if (deviceSelector && problemSelector) {
    deviceSelector.addEventListener('change', () => {
        const device = deviceSelector.value;
        const problems = problemsData[device];

        if (!problems) {
            problemSelector.innerHTML = '<option value="" disabled selected>Primero elige un equipo</option>';
            problemSelector.disabled = true;
            quickSubmit.disabled = true;
            return;
        }

        problemSelector.innerHTML = '<option value="" disabled selected>Selecciona el servicio</option>';
        problems.forEach(p => {
            const option = document.createElement('option');
            option.value = p;
            option.textContent = p;
            problemSelector.appendChild(option);
        });
        problemSelector.disabled = false;
        quickSubmit.disabled = true;
        if (customProblemWrapper) customProblemWrapper.style.display = 'none';
    });

    problemSelector.addEventListener('change', () => {
        if (problemSelector.value) {
            quickSubmit.disabled = false;

            if (problemSelector.value === 'Otro') {
                customProblemWrapper.style.display = 'flex';
                customProblemInput.focus();
            } else {
                customProblemWrapper.style.display = 'none';
            }
        }
    });

    quickSubmit.addEventListener('click', () => {
        const device = deviceSelector.options[deviceSelector.selectedIndex].text;
        let problem = problemSelector.value;

        if (problem === 'Otro') {
            problem = customProblemInput.value.trim() || 'Otro (No especificado)';
        }

        const message = `Hola, necesito ayuda con mi ${device}. El problema es: ${problem}.`;
        window.location.href = `contacto.html?asunto=${encodeURIComponent(message)}`;
    });
}

console.log('ElRinconDeOlea 2026 Loaded');
