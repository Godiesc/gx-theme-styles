// Función para cambiar el color del fondo del popup
async function actualizarColorPopup() {
    const currentTheme = await browser.theme.getCurrent();
    const popupBackground = currentTheme.colors?.popup ?? '#101019';
    const popupText = currentTheme.colors?.popup_text ?? '#ffffff';
    const tabLineColor = currentTheme.colors?.tab_line ?? '#ffffff';
    
    const style = document.createElement('style');
    style.textContent = `

        :root {
            --accent-color: color-mix(in srgb, ${tabLineColor} 80%, transparent);
        }

        @media (prefers-color-scheme: dark) {
        :root {
          --accent-color: color-mix(in srgb, ${tabLineColor} 70%, transparent);
        }}

        hr {
            border-image: linear-gradient(to right, transparent, ${tabLineColor}) 1;
        }
        .scrolling-card .theme-button:hover,
        .scrolling-card1 .theme-button:hover {
            border: 1px solid ${tabLineColor};
        }
        .slider:hover{
            outline: 2px solid ${tabLineColor};
            transition-duration: 0ms;
        }
        .btngx:hover{
            background-color: color-mix(in srgb, ${tabLineColor}, transparent);
        }
        .sp-replacer:hover, .sp-replacer.sp-active {
            border-color: ${tabLineColor};
        }
    `;
    document.head.appendChild(style);
    document.body.style.backgroundColor = popupBackground;
    document.body.style.color = popupText;
}

function inicializarSpectrum(id, defaultColor, action) {
    const $element = $(id);
    
    const spectrumInstance = $element.spectrum({
        color: defaultColor,
        preferredFormat: "hex",
        theme: 'dark',
        flat: false,
        showInput: true,
        showButtons: false,
        move: function (color) {
            // Enviar el color seleccionado al fondo (background.js)
            browser.runtime.sendMessage({ action, color: color.toHexString() });

            if (id === '#color_popup' || id === '#color_popup_text' || id === '#color_icons_attention') {
                // Introducir un retraso antes de actualizar el fondo del popup
            setTimeout(actualizarColorPopup, 200); // 200 milisegundos de retraso
            }
        },
    });

    // Devolver el objeto Spectrum para facilitar la destrucción y recreación
    return { $element, spectrumInstance };
}

async function obtenerColores() {
    const currentTheme = await browser.theme.getCurrent();
    return {
        '#color_icons_attention': currentTheme.colors?.icons_attention ?? '#ff0000',
        '#color_frame': currentTheme.colors?.frame ?? '#101019',
        '#color_toolbar': currentTheme.colors?.toolbar ?? '#14141d',
        '#color_tab_selected': currentTheme.colors?.tab_selected ?? '#14141d',
        '#color_popup': currentTheme.colors?.popup ?? '#2a2a3c',
        '#color_icons': currentTheme.colors?.icons ?? '#eaeaea',
        '#color_toolbar_top_separator': currentTheme.colors?.toolbar_top_separator ?? '#ff0000',
        '#color_toolbar_field': currentTheme.colors?.toolbar_field ?? '#14141d',
        '#color_button_background_hover': currentTheme.colors?.button_background_hover ?? '#3f3f5a',
        '#color_button_background_active': currentTheme.colors?.button_background_active ?? '#2a2a3c',
        '#color_tab_background_text': currentTheme.colors?.tab_background_text ?? '#eaeaea',
        '#color_tab_text': currentTheme.colors?.tab_text ?? '#eaeaea',
        '#color_toolbar_text': currentTheme.colors?.toolbar_text ?? '#eaeaea',
        '#color_popup_text': currentTheme.colors?.popup_text ?? '#eaeaea',
    };
}

// Ejecutar la función al cargar el popup
document.addEventListener("DOMContentLoaded", async function () {
    await actualizarColorPopup();
});

$(document).ready(async function () {
    // Obtener los colores del nuevo tema después de cargar el popup
    const colores = await obtenerColores();

    // Inicializar Spectrum con los colores predeterminados
    const spectrumInstances = {};
    for (const [id, defaultColor] of Object.entries(colores)) {
        spectrumInstances[id] = inicializarSpectrum(id, defaultColor, 'cambiar_' + id.substring(1));
    }

    // Manejar el clic en el botón 'Aplicar Theme'
    $(".theme-button").on("click", async function () {
        const themeId = $(this).data("theme-id");
        browser.runtime.sendMessage({ action: `aplicar_theme_${themeId}` });

        // Esperar a que se actualice el tema
        await new Promise(resolve => setTimeout(resolve, 200));

        // Actualizar el fondo del popup
        await actualizarColorPopup();

        // Obtener los colores del nuevo tema después de cambiarlo
        const newColors = await obtenerColores();

        // Destruir las instancias Spectrum existentes y crear nuevas
        for (const [id, spectrumInstance] of Object.entries(spectrumInstances)) {
            spectrumInstance.$element.spectrum('destroy');
            spectrumInstances[id] = inicializarSpectrum(id, newColors[id], 'cambiar_' + id.substring(1));
        }
    });

    function setupScrollingButtons(leftBtn, rightBtn, container) {
        leftBtn.addEventListener("click", () => {
            container.scrollLeft -= 306;
        });
    
        rightBtn.addEventListener("click", () => {
            container.scrollLeft += 306;
        });
    }
    
    // Scroll de temas oscuros
    const rightBtn = document.querySelector("#scrolling-button-right");
    const leftBtn = document.querySelector("#scrolling-button-left");
    const content = document.querySelector(".scrolling-container");
    
    setupScrollingButtons(leftBtn, rightBtn, content);
    
    // Scroll de temas claros
    const rightBtn1 = document.querySelector("#scrolling-button-right1");
    const leftBtn1 = document.querySelector("#scrolling-button-left1");
    const content1 = document.querySelector(".scrolling-container1");
    
    setupScrollingButtons(leftBtn1, rightBtn1, content1);
    
    // Recuperar el estado almacenado del checkbox al inicio
    var toggleState = localStorage.getItem('toggleState');
    if (toggleState === 'true') {
        $(".scrolling-buttons-container").hide();
        $(".scrolling-container").hide();
        $(".scrolling-buttons-container1").show();
        $(".scrolling-container1").show();
        $("#toggleSections").prop('checked', true);
    } else {
        $(".scrolling-buttons-container").show();
        $(".scrolling-container").show();
        $(".scrolling-buttons-container1").hide();
        $(".scrolling-container1").hide();
        $("#toggleSections").prop('checked', false);
    }
    
    // Evento de cambio en el toggle
    $("#toggleSections").change(function () {
        // Mostrar u ocultar las secciones según el estado del toggle
        if (this.checked) {
            $(".scrolling-buttons-container, .scrolling-container").hide();
            $(".scrolling-buttons-container1, .scrolling-container1").show();
        } else {
            $(".scrolling-buttons-container, .scrolling-container").show();
            $(".scrolling-buttons-container1, .scrolling-container1").hide();
        }
    
        // Almacenar el estado del checkbox en el almacenamiento local
        localStorage.setItem('toggleState', this.checked);
    });
});