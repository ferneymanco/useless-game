import { Component } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-status-header',
  imports: [],
  templateUrl: './status-header.html',
  styleUrl: './status-header.scss',
})
export class StatusHeader {
  public entropy: string = '0000000';
  private intervalId: any;

  ngOnInit() {
    this.startEntropyCounter();
  }

  startEntropyCounter() {
    this.intervalId = setInterval(() => {
      // 2. Actualizamos la variable directamente
      this.entropy = Math.floor(Math.random() * 0xFFFFFF)
        .toString(16) // Convertimos a hexadecimal para que parezca más "hacker"
        .toUpperCase()
        .padStart(7, '0');
    }, 80);
  }
  // --- Entropy Counter ---
    ngOnDestroy() {
    // 3. ¡Importante! Limpiamos el proceso al cerrar el componente
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

}
