import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private isDark = false;

  constructor() {
    // Verifica si el usuario ya ha seleccionado el tema oscuro en el pasado
    const storedTheme = localStorage.getItem('darkMode');
    this.isDark = storedTheme === 'true';

    // Aplica el tema al cargar el servicio
    this.applyTheme();
  }

  isDarkTheme() {
    return this.isDark;
  }

  setDarkTheme(isDark: boolean) {
    this.isDark = isDark;
    this.applyTheme();
    // Guarda la preferencia del usuario en localStorage
    localStorage.setItem('darkMode', isDark ? 'true' : 'false');
  }

  private applyTheme() {
    if (this.isDark) {
      // Aplica estilos para el modo oscuro
      document.body.classList.add('dark-theme');
    } else {
      // Aplica estilos para el modo claro
      document.body.classList.remove('dark-theme');
    }
  }
  
}

