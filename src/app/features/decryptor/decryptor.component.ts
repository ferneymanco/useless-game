import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { PlayerService } from '../../core/services/player.service';

@Component({
  selector: 'app-decryptor',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './decryptor.component.html',
  styleUrls: ['./decryptor.component.scss'],
})
export class DecryptorComponent {
  playerService = inject(PlayerService);
  player = this.playerService.player;
  // Estados del juego
  currentSequence = signal<number[]>([0, 0, 0, 0]);
  lockedDigits = signal<boolean[]>([false, false, false, false]);
  targetNumbers = signal<number[]>([0, 0, 0, 0]);
  gameStatus = signal<'idle' | 'playing' | 'success' | 'fail' | 'blocked'>('idle');
  isShaking = signal<boolean>(false);
  rebootCode = signal<string>('');
  userRebootInput = signal<string>('');
  hadFailures = signal<boolean>(false);
  isDecrypting = false;
  private interval: any;
  private functions = inject(Functions);
  currentSpeed = signal((this.player()?.decryptedNodes || 0) * 50);

  startDecryption() {
    const newTarget = Array.from({length: 4}, () => Math.floor(Math.random() * 10));
    this.targetNumbers.set(newTarget);
    
    this.gameStatus.set('playing');
    this.isDecrypting = true;
    //this.currentSpeed.set(300); // Reset velocidad
    this.lockedDigits.set([false, false, false, false]);
    this.hadFailures.set(false); // Reset al empezar
    this.resetInterval();
  }

  private resetInterval() {
    if (this.interval) clearInterval(this.interval);
    
    this.interval = setInterval(() => {
      this.currentSequence.update(seq => 
        seq.map((val, i) => this.lockedDigits()[i] ? val : Math.floor(Math.random() * 10))
      );
    }, this.currentSpeed());
  }

  lockCurrentDigit() {
    if (this.gameStatus() !== 'playing') return;

    const nextIndex = this.lockedDigits().indexOf(false);
    if (nextIndex === -1) return;

    const currentVal = this.currentSequence()[nextIndex];
    const targetVal = this.targetNumbers()[nextIndex];

    if (currentVal === targetVal) {
      // ACIERTO
      const newLocked = [...this.lockedDigits()];
      newLocked[nextIndex] = true;
      this.lockedDigits.set(newLocked);
      if (newLocked.every(v => v)) this.finishGame();
    } else {
      // FALLO: Aumentar velocidad (reducir ms)
      this.hadFailures.set(true);
      this.triggerShake();
      this.currentSpeed.update(speed => speed - 10);
      console.log(`SISTEMA SOBRECALENTADO: ${this.currentSpeed()}ms`);

      if (this.currentSpeed() <= 0) {
        this.systemCriticalFailure();
      } else {
        this.resetInterval(); // Aplicar nueva velocidad
      }
    }
  }

  private triggerShake() {
    this.isShaking.set(true);
    setTimeout(() => this.isShaking.set(false), 300); // Dura lo mismo que la animación CSS
  }

  systemCriticalFailure() {
    this.isDecrypting = false;
    clearInterval(this.interval);
    const code = `REBOOT-${Math.floor(Math.random() * 900) + 100}`;
    this.rebootCode.set(code);
    this.userRebootInput.set('');
    this.gameStatus.set('blocked');
    // Aquí podrías incluso bloquear el botón de inicio por unos minutos
  }

  async finishGame() {
    this.isDecrypting = false;
    clearInterval(this.interval);
    
    const decryptFn = httpsCallable(this.functions, 'processDecryption');
    try {
      const result: any = await decryptFn({ isPerfect: !this.hadFailures() });
      if (result.data.success) {
        this.gameStatus.set('success');
      } else {
        alert(result.data.message); // O un snackbar estilo terminal
        this.gameStatus.set('fail');
      }
    } catch (error) {
      console.error("Error en la conexión con el núcleo", error);
    }
  }

  checkRebootCommand(event: Event) {
    const value = (event.target as HTMLInputElement).value.toUpperCase();
    this.userRebootInput.set(value);

    if (value === this.rebootCode()) {
      // Si el código es correcto, el sistema se estabiliza
      this.gameStatus.set('idle');
      this.currentSpeed.update(speed => 300);
    }
  }


}