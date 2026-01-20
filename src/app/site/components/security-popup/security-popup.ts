import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-security-popup',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './security-popup.html',
  styleUrl: './security-popup.scss'
})
export class SecurityPopup {
  @Output() accessGranted = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  passkey: string = '';
  isError: boolean = false;
  private readonly ACCESS_SEQUENCE = "LAZARUS";

  verifyAccess() {
    if (this.passkey.toUpperCase() === this.ACCESS_SEQUENCE) {
      this.accessGranted.emit();
    } else {
      this.isError = true;
      // Reset error after a delay if desired, or keep it until next attempt
      setTimeout(() => {
           // Optional: Reset border color logic if strictly following original behavior
           // But simply setting isError to false might hide the message too early if implied?
           // The original code reset the border color after 1s but kept the error message visible?
           // Original: errorMsg visible, border red. Timeout 1s: border back to normal.
           // Let's implement that behavior via a getter or just a variable.
           // For simplicity in this new component, let's keep isError true but maybe handle border separately or just let it stay red until edit.
      }, 1000);
    }
  }

  onKeypress(event: KeyboardEvent) {
      if (event.key === 'Enter') {
          this.verifyAccess();
      }
  }

  onCancel() {
    this.cancel.emit();
  }

  get inputBorderColor() {
      // If we want the timeout behavior for border:
      // We'd need a separate flag 'showErrorBorder'
      return this.isError ? '#ff0000' : '#b87333';
  }
}
