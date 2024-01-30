/* Función para aclarán un color */
function brightenColor(hex, percent) {
  percent = Math.min(100, Math.max(0, percent));

  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  const newR = Math.round(r + (255 - r) * (percent / 100));
  const newG = Math.round(g + (255 - g) * (percent / 100));
  const newB = Math.round(b + (255 - b) * (percent / 100));

  const newHex = `#${(newR << 16 | newG << 8 | newB).toString(16).padStart(6, '0')}`;

  return newHex;
}

// Guardar la configuración del tema
async function guardarConfiguracionTema(configuracion) {
  await browser.storage.local.set({ temaConfiguracion: configuracion });
}

// Recuperar la configuración del tema
async function recuperarConfiguracionTema() {
  const almacenamiento = await browser.storage.local.get('temaConfiguracion');
  return almacenamiento.temaConfiguracion || {};
}

// Aplicar el tema con la configuración guardada
async function aplicarTemaConConfiguracion(configuracion) {
  await browser.theme.update(configuracion);
}

async function cambiarColor(action, color) {
  const currentTheme = await browser.theme.getCurrent();
  let nuevoTema;

  switch (action) {
    case 'cambiar_color_icons_attention':
      nuevoTema = { 
        colors: { 
          ...currentTheme.colors, 
          icons_attention: color, 
          tab_line: color,
          sidebar_highlight: color,
          tab_loading: color,
          tab_loading_inactive: color,
          toolbar_field_highlight: color,
          popup_highlight: color,
          popup_highlight_text: "white",
      } 
    };
      break;
    case 'cambiar_color_frame':
      nuevoTema = { colors: { ...currentTheme.colors, frame: color, frame_inactive: brightenColor(color, 6) } };
      break;
    case 'cambiar_color_icons':
        nuevoTema = { colors: { ...currentTheme.colors, icons: color } };
      break;
    case 'cambiar_color_button_background_hover':
        nuevoTema = { colors: { ...currentTheme.colors, button_background_hover: color } };
      break;
    case 'cambiar_color_button_background_active':
        nuevoTema = { colors: { ...currentTheme.colors, button_background_active: color } };
      break;
    case 'cambiar_color_tab_selected':
        nuevoTema = { colors: { ...currentTheme.colors, tab_selected: color } };
      break;
    case 'cambiar_color_popup':
        nuevoTema = { colors: { ...currentTheme.colors, popup: color, popup_border: brightenColor(color, 10) } };
      break;
    case 'cambiar_color_tab_background_text':
        nuevoTema = { colors: { ...currentTheme.colors, tab_background_text: color } };
      break;
    case 'cambiar_color_tab_text':
        nuevoTema = { colors: { ...currentTheme.colors, tab_text: color } };
      break;
    case 'cambiar_color_toolbar_text':
        nuevoTema = { colors: { ...currentTheme.colors, toolbar_text: color, toolbar_field_text: color } };
      break;
    case 'cambiar_color_popup_text':
        nuevoTema = { colors: { ...currentTheme.colors, popup_text: color } };
      break;
    case 'cambiar_color_toolbar':
      nuevoTema = {
        colors: {
          ...currentTheme.colors,
          toolbar: color,
          toolbar_bottom_separator: color,
          toolbar_field_border: color,
          toolbar_field_border_focus: brightenColor(color, 20),
          ntp_background: color,
          ntp_card_background: brightenColor(color, 6),
          sidebar: brightenColor(color, 1),
          sidebar_border: brightenColor(color, 20)
        },
      };
      break;
      case 'cambiar_color_toolbar_top_separator':
        nuevoTema = { 
          colors: { 
            ...currentTheme.colors, 
            toolbar_top_separator: color
           } };
      break;
      case 'cambiar_color_toolbar_field':
        nuevoTema = { 
          colors: { 
            ...currentTheme.colors, 
            toolbar_field: color, 
            toolbar_field_focus: color, 
            toolbar_field_border_focus: currentTheme.colors.popup_border 
          } };
      break;
    default:
      return;
  }
  browser.theme.update(nuevoTema);
  await guardarConfiguracionTema(nuevoTema);
  await aplicarTemaConConfiguracion(nuevoTema);
}

// Manejar el mensaje del popup
browser.runtime.onMessage.addListener(async (message) => {
  if (message.action && message.color) {
    cambiarColor(message.action, message.color);
  }
});

// Aplicar el tema con la configuración guardada al iniciar la extensión
(async function() {
  const configuracionGuardada = await recuperarConfiguracionTema();
  if (Object.keys(configuracionGuardada).length > 0) {
    await aplicarTemaConConfiguracion(configuracionGuardada);
  }
})();

/* Apply default Fuchsia*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_fuchsia') {
    const nuevoTema = {
      colors: {
        frame: "#09080d",
        tab_background_text: "#CCCCCC",
        frame_inactive: "#0b0a10",
        toolbar: "#121019",
        toolbar_text: "#b3b3b3",
        toolbar_field: "#121019",
        toolbar_field_text: "#ffffff",
        toolbar_top_separator: "#af0429",
        toolbar_bottom_separator: "#121019",
        bookmark_text: "#d3d3d3",
        toolbar_field_border: "#121019",
        toolbar_field_focus: "#251f33",
        toolbar_field_border_focus: "#251f33",
        toolbar_field_highlight: "#f91e4d",
        toolbar_field_highlight_text: "#000000",
        toolbar_field_text_focus: "#e5e5e6",
        button_background_hover: "#392b45",
        button_background_active: "#2b2133",
        icons: "#bfb6d2",
        icons_attention: "#fa1e4e",
        ntp_background: "#121019",
        ntp_text: "#e5e5e6",
        ntp_card_background: "#211f2a",
        popup: "#1c1726",
        popup_text: "#e5e5e6",
        popup_border: "#4a3e65",
        popup_highlight: "#b01f41",
        sidebar: "#1a1320",
        sidebar_text: "#d3d8db",
        sidebar_border: "#3c364a",
        sidebar_highlight: "#d01a43",
        sidebar_highlight_text: "#eaeaea",
        tab_line: "#d01a43",
        tab_loading: "#fa1e4e",
        tab_loading_inactive: "#fa1e4e",
        tab_selected: "#121019",
        tab_text: "#ffffff"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default Swamp*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_swamp') {
    const nuevoTema = {
      colors: {
        frame: "#001214",
        tab_background_text: "#b3b3b3",
        frame_inactive: "#00171a",
        toolbar: "#002429",
        toolbar_text: "#b3b3b3",
        toolbar_field: "#002429",
        toolbar_field_text: "#e5e5e6",
        toolbar_top_separator: "#7e7801",
        toolbar_bottom_separator: "#002429",
        toolbar_field_border: "#002429",
        toolbar_field_focus: "#004852fc",
        toolbar_field_border_focus: "#004852fc",
        toolbar_field_highlight: "#fdf008D0",
        toolbar_field_highlight_text: "#000000",
        toolbar_field_text_focus: "#e5e5e6",
        toolbar_vertical_separator: "#60906090",
        bookmark_text: "#ffffff",
        button_background_hover: "#1b3b40",
        button_background_active: "#00171a",
        icons: "#8af1ff",
        icons_attention: "#fdf008",
        ntp_background: "#002429",
        ntp_text: "#e5e5e6",
        ntp_card_background: "#00363d",
        popup: "#00363d",
        popup_text: "#e5e5e6",
        popup_border: "#0090a3",
        popup_highlight: "#fdf008b0",
        sidebar: "#072b30",
        sidebar_text: "#d3d8db",
        sidebar_border: "#0090a3",
        sidebar_highlight: "#fdf008b0",
        sidebar_highlight_text: "#000000",
        tab_line: "#cac002",
        tab_selected: "#002429",
        tab_loading: "#fdf008",
        tab_text: "#ffffff"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default Blue*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_blue') {
    const nuevoTema = {
      colors: {
        frame: "#07090d",
        tab_background_text: "#b3b3b3",
        frame_inactive: "#090b11",
        toolbar: "#0d111a",
        toolbar_text: "#b3b3b3",
        toolbar_field: "#0d111a",
        toolbar_field_text: "#e5e5e6",
        toolbar_top_separator: "#2c2b88",
        toolbar_bottom_separator: "#0d111a",
        bookmark_text: "#d3d3d3",
        toolbar_field_border: "#0d111a",
        toolbar_field_focus: "#1c2435fe",
        toolbar_field_border_focus: "#1c2435fe",
        toolbar_field_highlight: "#3a5adf",
        toolbar_field_highlight_text: "#000000",
        toolbar_field_text_focus: "#e5e5e6",
        button_background_hover: "#1f2738",
        button_background_active: "#1b202f",
        icons: "#d8d8d9",
        icons_attention: "#4474ee",
        ntp_background: "#0d111a",
        ntp_text: "#e5e5e6",
        ntp_card_background: "#1b202c",
        popup: "#151b28",
        popup_text: "#e5e5e6",
        popup_border: "#38486b",
        popup_highlight: "#3e3bcd",
        sidebar: "#10141d",
        sidebar_text: "#d3d8db",
        sidebar_border: "#38486b",
        sidebar_highlight: "#312f83",
        sidebar_highlight_text: "#EEEEEE",
        tab_line: "#4d4dfe",
        tab_selected: "#0d111a",
        tab_loading: "#4d4dfe",
        tab_loading_inactive: "#4d4dfe",
        tab_text: "#ffffff"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default Ultraviolet*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_ultraviolet') {
    const nuevoTema = {
      colors: {
        frame: "#07060e",
        tab_background_text: "#b3b3b3",
        frame_inactive: "#0b0a14",
        toolbar: "#0e0c1d",
        toolbar_text: "#b3b3b3",
        toolbar_field: "#0e0c1d",
        toolbar_field_text: "#e5e5e6",
        toolbar_top_separator: "#8533ff",
        toolbar_bottom_separator: "#0e0c1d",
        bookmark_text: "#d3d3d3",
        toolbar_field_border: "#0e0c1d",
        toolbar_field_focus: "#1d1839fe",
        toolbar_field_border_focus: "#1d1839fe",
        toolbar_field_highlight: "#a970ff",
        toolbar_field_highlight_text: "#000000",
        toolbar_field_text_focus: "#e5e5e6",
        button_background_hover: "#2c265a",
        button_background_active: "#1f1c3b",
        icons: "#b3addc",
        icons_attention: "#a970ff",
        ntp_background: "#0e0c1d",
        ntp_text: "#e5e5e6",
        ntp_card_background: "#1a1736",
        popup: "#15122b",
        popup_text: "#e5e5e6",
        popup_border: "#3a3172",
        popup_highlight: "#60429d",
        sidebar: "#110f24",
        sidebar_text: "#d3d8db",
        sidebar_border: "#3a3172",
        sidebar_highlight: "#2c265a",
        sidebar_highlight_text: "#EEEEEE",
        tab_line: "#a970ff",
        tab_selected: "#0e0c1d",
        tab_loading: "#a970ff",
        tab_loading_inactive: "#a970ff",
        tab_text: "#ffffff"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default Cheaterman*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_cheaterman') {
    const nuevoTema = {
      colors: {
        frame: "#080c09",
        tab_background_text: "#b3b3b3",
        frame_inactive: "#0a0f0b",
        toolbar: "#101811",
        toolbar_text: "#b3b3b3",
        toolbar_field: "#101811",
        toolbar_field_text: "#e5e5e6",
        toolbar_top_separator: "#1f8e2e",
        toolbar_bottom_separator: "#101811",
        bookmark_text: "#d3d3d3",
        toolbar_field_border: "#101811",
        toolbar_field_focus: "#213123fe",
        toolbar_field_border_focus: "#213123fe",
        toolbar_field_highlight: "#33ff4e",
        toolbar_field_highlight_text: "#000000",
        toolbar_field_text_focus: "#e5e5e6",
        button_background_hover: "#263628",
        button_background_active: "#1c2b1f",
        icons: "#b9d0bc",
        icons_attention: "#33ff4e",
        ntp_background: "#101811",
        ntp_text: "#e5e5e6",
        ntp_card_background: "#1f2e21",
        popup: "#18251a",
        popup_text: "#e5e5e6",
        popup_border: "#416246",
        popup_highlight: "#2a9836",
        sidebar: "#101811",
        sidebar_text: "#d3d8db",
        sidebar_border: "#416246",
        sidebar_highlight: "#334d36",
        sidebar_highlight_text: "#EEEEEE",
        tab_line: "#33ff4e",
        tab_selected: "#101811",
        tab_loading: "#33ff4e",
        tab_loading_inactive: "#33ff4e",
        tab_text: "#ffffff"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default Gray*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_gray') {
    const nuevoTema = {
      colors: {
        frame: "#0a0a0a",
        tab_background_text: "#b3b3b3",
        frame_inactive: "#0f0f0f",
        toolbar: "#141414",
        toolbar_text: "#b3b3b3",
        toolbar_field: "#141414",
        toolbar_field_text: "#e5e5e6",
        toolbar_top_separator: "#717171",
        toolbar_bottom_separator: "#141414",
        bookmark_text: "#d3d3d3",
        toolbar_field_border: "#141414",
        toolbar_field_focus: "#292929fe",
        toolbar_field_border_focus: "#292929fe",
        toolbar_field_highlight: "#cccccc",
        toolbar_field_highlight_text: "#000000",
        toolbar_field_text_focus: "#e5e5e6",
        button_background_hover: "#3c4047",
        button_background_active: "#3c4047",
        icons: "#b9d0bc",
        icons_attention: "#cccccc",
        ntp_background: "#141414",
        ntp_text: "#e5e5e6",
        ntp_card_background: "#262626",
        popup: "#1f1f1f",
        popup_text: "#e5e5e6",
        popup_border: "#525252",
        popup_highlight: "#7a7a7a",
        sidebar: "#1a1a1a",
        sidebar_text: "#d3d8db",
        sidebar_border: "#525252",
        sidebar_highlight: "#404040",
        sidebar_highlight_text: "#EEEEEE",
        tab_line: "#cccccc",
        tab_selected: "#141414",
        tab_loading: "#cccccc",
        tab_loading_inactive: "#cccccc",
        tab_text: "#ffffff"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default Orange*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_orange') {
    const nuevoTema = {
      colors: {
        frame: "#090b0b",
        tab_background_text: "#b3b3b3",
        frame_inactive: "#0b0e0e",
        toolbar: "#131615",
        toolbar_text: "#b3b3b3",
        toolbar_field: "#131615",
        toolbar_field_text: "#e5e5e6",
        toolbar_top_separator: "#8c5705",
        toolbar_bottom_separator: "#131615",
        bookmark_text: "#d3d3d3",
        toolbar_field_border: "#131615",
        toolbar_field_focus: "#262c2afe",
        toolbar_field_border_focus: "#262c2afe",
        toolbar_field_highlight: "#ff9900",
        toolbar_field_highlight_text: "#000000",
        toolbar_field_text_focus: "#e5e5e6",
        button_background_hover: "#3b4441",
        button_background_active: "#242927",
        icons: "#b9d0bc",
        icons_attention: "#ff9900",
        ntp_background: "#131615",
        ntp_text: "#e5e5e6",
        ntp_card_background: "#242927",
        popup: "#1c211f",
        popup_text: "#e5e5e6",
        popup_border: "#4b5855",
        popup_highlight: "#936215",
        sidebar: "#181b1a",
        sidebar_text: "#d3d8db",
        sidebar_border: "#4b5855",
        sidebar_highlight: "#4d2e00",
        sidebar_highlight_text: "#EEEEEE",
        tab_line: "#ff9900",
        tab_selected: "#131615",
        tab_loading: "#ff9900",
        tab_loading_inactive: "#ff9900",
        tab_text: "#ffffff"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default catppuccin*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_catppuccin') {
    const nuevoTema = {
      colors: {
        frame: "#181825",
        tab_background_text: "#b3b3b3",
        frame_inactive: "#1e1e2e",
        toolbar: "#1e1e2e",
        toolbar_text: "#b3b3b3",
        toolbar_field: "#1e1e2e",
        toolbar_field_text: "#e5e5e6",
        toolbar_top_separator: "#8d556b",
        toolbar_bottom_separator: "#1e1e2e",
        bookmark_text: "#d3d3d3",
        toolbar_field_border: "#1e1e2e",
        toolbar_field_focus: "#32324dfe",
        toolbar_field_border_focus: "#32324dfe",
        toolbar_field_highlight: "#f38ba8",
        toolbar_field_highlight_text: "#000000",
        toolbar_field_text_focus: "#e5e5e6",
        button_background_hover: "#47476c",
        button_background_active: "#32324d",
        icons: "#b9d0bc",
        icons_attention: "#f38ba8",
        ntp_background: "#1e1e2e",
        ntp_text: "#e5e5e6",
        ntp_card_background: "#32324d",
        popup: "#28283e",
        popup_text: "#e5e5e6",
        popup_border: "#47476c",
        popup_highlight: "#f38ba899",
        sidebar: "#28283e",
        sidebar_text: "#d3d8db",
        sidebar_border: "#47476c",
        sidebar_highlight: "#50507c",
        sidebar_highlight_text: "#EEEEEE",
        tab_line: "#f38ba8",
        tab_selected: "#1e1e2e",
        tab_loading: "#f38ba8",
        tab_loading_inactive: "#f38ba8",
        tab_text: "#ffffff"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default FuchsiaBright*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_fuchsiabright') {
    const nuevoTema = {
      colors: {
        frame: "#e9e6ef",
        tab_background_text: "#333333",
        frame_inactive: "#e4e0eb",
        toolbar: "#f4f2f7",
        toolbar_text: "#000000",
        toolbar_field: "#f4f2f7",
        toolbar_field_text: "#3a334f",
        toolbar_top_separator: "#fb5075",
        toolbar_bottom_separator: "#ddd9e8",
        bookmark_text: "#3a334f",
        toolbar_field_border: "#f4f2f7",
        toolbar_field_focus: "#f9f9fb",
        toolbar_field_border_focus: "#f9f9fb",
        toolbar_field_highlight: "#fa1e4e",
        toolbar_field_highlight_text: "#ffffff",
        toolbar_field_text_focus: "#3a334f",
        button_background_hover: "#e1d0e1",
        button_background_active: "#ebe0eb",
        icons: "#3a334f",
        icons_attention: "#fa1e4e",
        ntp_background: "#f1e9f1",
        ntp_text: "#3a334f",
        ntp_card_background: "#e5d9e1",
        popup: "#faf9fb",
        popup_text: "#3a334f",
        popup_border: "#c7c0d8",
        popup_highlight: "#fa89a4",
        popup_highlight_text: "#2d283e",
        sidebar: "#ebe0eb",
        sidebar_text: "#3a334f",
        sidebar_border: "#ddd9e8",
        sidebar_highlight: "#f38ba8",
        sidebar_highlight_text: "#0a0a0a",
        tab_line: "#fa1e4e",
        tab_selected: "#f4f2f7",
        tab_loading: "#fa1e4e",
        tab_loading_inactive: "#fa1e4e",
        tab_text: "#3a334f"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default ultravioletBright*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_ultravioletbright') {
    const nuevoTema = {
      colors: {
        frame: "#e5e2f3",
        tab_background_text: "#333333",
        frame_inactive: "#dfdbf0",
        toolbar: "#f2f1f9",
        toolbar_text: "#000000",
        toolbar_field: "#f2f1f9",
        toolbar_field_text: "#3a334f",
        toolbar_top_separator: "#944dff",
        toolbar_bottom_separator: "#ddd9e8",
        bookmark_text: "#3a334f",
        toolbar_field_border: "#f2f1f9",
        toolbar_field_focus: "#f9f9fb",
        toolbar_field_border_focus: "#f9f9fb",
        toolbar_field_highlight: "#751aff",
        toolbar_field_highlight_text: "#ffffff",
        toolbar_field_text_focus: "#3a334f",
        button_background_hover: "#cfc3ef",
        button_background_active: "#dfd7f4",
        icons: "#383260",
        icons_attention: "#751aff",
        ntp_background: "#f0ecfa",
        ntp_text: "#3a334f",
        ntp_card_background: "#e3dfed",
        popup: "#f8f8fc",
        popup_text: "#3a334f",
        popup_border: "#bdb8e0",
        popup_highlight: "#b589fe",
        popup_highlight_text: "#221e2f",
        sidebar: "#e3dbf8",
        sidebar_text: "#3a334f",
        sidebar_border: "#ddd9e8",
        sidebar_highlight: "#63639c",
        sidebar_highlight_text: "#EEEEEE",
        tab_line: "#751aff",
        tab_selected: "#f2f1f9",
        tab_loading: "#751aff",
        tab_loading_inactive: "#751aff",
        tab_text: "#3a334f"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default blueBright*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_bluebright') {
    const nuevoTema = {
      colors: {
        frame: "#e4e8f1",
        tab_background_text: "#333333",
        frame_inactive: "#dde2ee",
        toolbar: "#f2f3f8",
        toolbar_text: "#000000",
        toolbar_field: "#f2f3f8",
        toolbar_field_text: "#3a334f",
        toolbar_top_separator: "#5c86f0",
        toolbar_bottom_separator: "#ddd9e8",
        bookmark_text: "#3a334f",
        toolbar_field_border: "#f2f3f8",
        toolbar_field_focus: "#f9f9fb",
        toolbar_field_border_focus: "#f9f9fb",
        toolbar_field_highlight: "#1652e9",
        toolbar_field_highlight_text: "#ffffff",
        toolbar_field_text_focus: "#3a334f",
        button_background_hover: "#c6c9ec",
        button_background_active: "#d9dbf2",
        icons: "#2a3550",
        icons_attention: "#1652e9",
        ntp_background: "#edeef9",
        ntp_text: "#3a334f",
        ntp_card_background: "#e3e4ef",
        popup: "#f8f9fb",
        popup_text: "#3a334f",
        popup_border: "#bcc5dc",
        popup_highlight: "#87a7f1",
        popup_highlight_text: "#221e2f",
        sidebar: "#eaebf6",
        sidebar_text: "#3a334f",
        sidebar_border: "#ddd9e8",
        sidebar_highlight: "#666fcc",
        sidebar_highlight_text: "#EEEEEE",
        tab_line: "#1652e9",
        tab_selected: "#f2f3f8",
        tab_loading: "#1652e9",
        tab_loading_inactive: "#1652e9",
        tab_text: "#3a334f"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default roseBright*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_rosebright') {
    const nuevoTema = {
      colors: {
        frame: "#f3e2e9",
        tab_background_text: "#333333",
        frame_inactive: "#f0dbe4",
        toolbar: "#f9f1f4",
        toolbar_text: "#000000",
        toolbar_field: "#f9f1f4",
        toolbar_field_text: "#3a334f",
        toolbar_top_separator: "#ff3385",
        toolbar_bottom_separator: "#edd4de",
        bookmark_text: "#3a334f",
        toolbar_field_border: "#f9f1f4",
        toolbar_field_focus: "#f9f9fb",
        toolbar_field_border_focus: "#f9f9fb",
        toolbar_field_highlight: "#e6005c",
        toolbar_field_highlight_text: "#ffffff",
        toolbar_field_text_focus: "#3a334f",
        button_background_hover: "#e1b7c8",
        button_background_active: "#e8c9d6",
        icons: "#6b3f50",
        icons_attention: "#e6005c",
        ntp_background: "#f7ecf1",
        ntp_text: "#3a334f",
        ntp_card_background: "#e4d3d9",
        popup: "#fcf8f9",
        popup_text: "#3a334f",
        popup_border: "#e0b8c8",
        popup_highlight: "#f17caa",
        popup_highlight_text: "#2d283e",
        sidebar: "#f3e2e8",
        sidebar_text: "#3a334f",
        sidebar_border: "#ddd9e8",
        sidebar_highlight: "#ff66a3",
        sidebar_highlight_text: "#0a0a0a",
        tab_line: "#e6005c",
        tab_selected: "#f9f1f4",
        tab_loading: "#e6005c",
        tab_loading_inactive: "#e6005c",
        tab_text: "#3a334f"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default greenBright*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_greenbright') {
    const nuevoTema = {
      colors: {
        frame: "#ebe4f1",
        tab_background_text: "#333333",
        frame_inactive: "#e6ddee",
        toolbar: "#f5f2f8",
        toolbar_text: "#000000",
        toolbar_field: "#f5f2f8",
        toolbar_field_text: "#3a334f",
        toolbar_top_separator: "#2aa617",
        toolbar_bottom_separator: "#e3d9eb",
        bookmark_text: "#3a334f",
        toolbar_field_border: "#f5f2f8",
        toolbar_field_focus: "#faf8fc",
        toolbar_field_border_focus: "#faf8fc",
        toolbar_field_highlight: "#2eca16",
        toolbar_field_highlight_text: "#ffffff",
        toolbar_field_text_focus: "#3a334f",
        button_background_hover: "#ddd5e4",
        button_background_active: "#ebe3f2",
        icons: "#4b375b",
        icons_attention: "#2eca16",
        ntp_background: "#f2ebf8",
        ntp_text: "#3a334f",
        ntp_card_background: "#dce2d9",
        popup: "#faf8fb",
        popup_text: "#3a334f",
        popup_border: "#cdbcdc",
        popup_highlight: "#94df88",
        popup_highlight_text: "#2d283e",
        sidebar: "#f2eef6",
        sidebar_text: "#3a334f",
        sidebar_border: "#ddd9e8",
        sidebar_highlight: "#86f075",
        sidebar_highlight_text: "#0a0a0a",
        tab_line: "#2eca16",
        tab_selected: "#f5f2f8",
        tab_loading: "#2eca16",
        tab_loading_inactive: "#2eca16",
        tab_text: "#3a334f"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default skyBright*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_skybright') {
    const nuevoTema = {
      colors: {
        frame: "#e6eeef",
        tab_background_text: "#333333",
        frame_inactive: "#e0eaeb",
        toolbar: "#f2f7f7",
        toolbar_text: "#000000",
        toolbar_field: "#f2f7f7",
        toolbar_field_text: "#3a334f",
        toolbar_top_separator: "#00b8e6",
        toolbar_bottom_separator: "#d9e6e8",
        bookmark_text: "#3a334f",
        toolbar_field_border: "#f2f7f7",
        toolbar_field_focus: "#faf8fc",
        toolbar_field_border_focus: "#faf8fc",
        toolbar_field_highlight: "#00bceb",
        toolbar_field_highlight_text: "#ffffff",
        toolbar_field_text_focus: "#3a334f",
        button_background_hover: "#d4eaea",
        button_background_active: "#d9efef",
        icons: "#4b375b",
        icons_attention: "#00bceb",
        ntp_background: "#e8fafa",
        ntp_text: "#3a334f",
        ntp_card_background: "#d4eaea",
        popup: "#f9fbfb",
        popup_text: "#3a334f",
        popup_border: "#c0d5d8",
        popup_highlight: "#7cdbf2",
        popup_highlight_text: "#2d283e",
        sidebar: "#e5f6f6",
        sidebar_text: "#3a334f",
        sidebar_border: "#ddd9e8",
        sidebar_highlight: "#70d5ff",
        sidebar_highlight_text: "#0a0a0a",
        tab_line: "#00bceb",
        tab_selected: "#f2f7f7",
        tab_loading: "#00bceb",
        tab_loading_inactive: "#00bceb",
        tab_text: "#3a334f"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default orangeBright*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_orangebright') {
    const nuevoTema = {
      colors: {
        frame: "#e9eceb",
        tab_background_text: "#333333",
        frame_inactive: "#e4e7e6",
        toolbar: "#f4f6f5",
        toolbar_text: "#000000",
        toolbar_field: "#f4f6f5",
        toolbar_field_text: "#3a334f",
        toolbar_top_separator: "#e68a00",
        toolbar_bottom_separator: "#dee3e2",
        bookmark_text: "#3a334f",
        toolbar_field_border: "#f4f6f5",
        toolbar_field_focus: "#faf8fc",
        toolbar_field_border_focus: "#faf8fc",
        toolbar_field_highlight: "#f59300",
        toolbar_field_highlight_text: "#ffffff",
        toolbar_field_text_focus: "#3a334f",
        button_background_hover: "#efe0cc",
        button_background_active: "#f1e5dd",
        icons: "#38423f",
        icons_attention: "#f59300",
        ntp_background: "#f3f2f0",
        ntp_text: "#3a334f",
        ntp_card_background: "#e3e1de",
        popup: "#f9fafa",
        popup_text: "#3a334f",
        popup_border: "#c8d0ce",
        popup_highlight: "#f6c67d",
        popup_highlight_text: "#2d283e",
        sidebar: "#edebe8",
        sidebar_text: "#3a334f",
        sidebar_border: "#ddd9e8",
        sidebar_highlight: "#ffb380",
        sidebar_highlight_text: "#0a0a0a",
        tab_line: "#f59300",
        tab_selected: "#f4f6f5",
        tab_loading: "#f59300",
        tab_loading_inactive: "#f59300",
        tab_text: "#3a334f"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});

/* Apply default grayBright*/ 

browser.runtime.onMessage.addListener(async (message) => {
  if (message.action === 'aplicar_theme_graybright') {
    const nuevoTema = {
      colors: {
        frame: "#ebebeb",
        tab_background_text: "#333333",
        frame_inactive: "#e6e6e6",
        toolbar: "#f5f5f5",
        toolbar_text: "#000000",
        toolbar_field: "#f5f5f5",
        toolbar_field_text: "#3a334f",
        toolbar_top_separator: "#4d4d4d",
        toolbar_bottom_separator: "#e0e0e0",
        bookmark_text: "#3a334f",
        toolbar_field_border: "#f5f5f5",
        toolbar_field_focus: "#faf8fc",
        toolbar_field_border_focus: "#faf8fc",
        toolbar_field_highlight: "#292929",
        toolbar_field_highlight_text: "#ffffff",
        toolbar_field_text_focus: "#3a334f",
        button_background_hover: "#d5d5d5",
        button_background_active: "#dfdfdf",
        icons: "#38423f",
        icons_attention: "#292929",
        ntp_background: "#f2f2f2",
        ntp_text: "#3a334f",
        ntp_card_background: "#e3e1de",
        popup: "#fafafa",
        popup_text: "#3a334f",
        popup_border: "#cccccc",
        popup_highlight: "#919191",
        popup_highlight_text: "#2d283e",
        sidebar: "#edebe8",
        sidebar_text: "#3a334f",
        sidebar_border: "#ddd9e8",
        sidebar_highlight: "#8c8c8c",
        sidebar_highlight_text: "#0a0a0a",
        tab_line: "#292929",
        tab_selected: "#f5f5f5",
        tab_loading: "#292929",
        tab_loading_inactive: "#292929",
        tab_text: "#3a334f"
      },
    };
    await browser.theme.update(nuevoTema);
    await guardarConfiguracionTema(nuevoTema);
    await aplicarTemaConConfiguracion(nuevoTema);
  }
});