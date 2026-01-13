import { Component, signal, computed, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { Functions, httpsCallable } from '@angular/fire/functions';

@Component({
  selector: 'app-decryptor',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="decryptor-container">
      <div class="aethelgard-card scanner-frame">
        <div class="header">
          <mat-icon>psychology</mat-icon>
          <h2>DECRYPTOR CORE <span class="version">v1.0.4</span></h2>
        </div>

        <div class="status-bar">
          <span class="status-text" [class.active]="isDecrypting">
            {{ isDecrypting ? 'SCANNING NODE...' : 'READY TO INITIALIZE' }}
          </span>
          <span class="target-id">TARGET: SIGNAL_NODE_X</span>
        </div>

        <div class="matrix-display">
          <div *ngFor="let digit of currentSequence(); let i = index" class="slot-container">
            <div class="target-hint">{{ targetNumbers()[i] }}</div>
            
            <div class="digit-box" [class.locked]="lockedDigits()[i]" [class.mismatch]="!lockedDigits()[i]">
              {{ digit }}
            </div>
          </div>
        </div>

        <div class="controls">
          <button *ngIf="!isDecrypting" (click)="startDecryption()" class="btn-action">
            INITIALIZE BRUTE FORCE
          </button>
          
          <button *ngIf="isDecrypting" (click)="lockCurrentDigit()" class="btn-lock">
            SYNC SIGNAL
          </button>
        </div>

        <div *ngIf="gameStatus() === 'success'" class="result success">
          <mat-icon>check_circle</mat-icon>
          <p>SIGNAL DECRYPTED. REWARD: 50 XP & 1 ACCESS_TOKEN</p>
        </div>
      </div>
    </div>
    
    <div *ngIf="gameStatus() === 'fail'" class="result error">
      <mat-icon>report_problem</mat-icon>
      <p>COOLDOWN ACTIVE: CORE RECHARGING...</p>
    </div>
  `,
  styles: [`
    .decryptor-container { padding: 40px; display: flex; justify-content: center; background: #050505; min-height: 80vh; }
    .scanner-frame { width: 100%; max-width: 600px; border-top: 4px solid var(--aethelgard-amber); }
    
    .header { display: flex; align-items: center; gap: 15px; margin-bottom: 20px; }
    .version { font-size: 0.6rem; opacity: 0.5; vertical-align: middle; }

    .status-bar { display: flex; justify-content: space-between; font-family: 'Courier New', monospace; font-size: 0.8rem; margin-bottom: 30px; border-bottom: 1px solid #333; padding-bottom: 10px; }
    .status-text.active { color: #00ff00; text-shadow: 0 0 5px #00ff00; }

    /* Matrix Display */
    .matrix-display { display: flex; justify-content: center; gap: 15px; margin: 40px 0; }
    .digit-box {
      width: 60px; height: 80px; background: #111; border: 2px solid #333;
      display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem; font-family: 'Orbitron', sans-serif; color: var(--aethelgard-amber);
    }
    .digit-box.locked { border-color: #00ff00; color: #00ff00; box-shadow: inset 0 0 10px rgba(0,255,0,0.2); }

    /* Botones */
    .btn-action, .btn-lock {
      width: 100%; padding: 15px; border: none; font-weight: bold; cursor: pointer; font-family: 'Courier New';
    }
    .btn-action { background: var(--aethelgard-amber); color: black; }
    .btn-lock { background: #333; color: white; border: 1px solid #555; }
    .btn-lock:active { transform: scale(0.98); }

    .result { margin-top: 20px; text-align: center; padding: 15px; border-radius: 4px; }
    .result.success { background: rgba(0, 255, 0, 0.1); color: #00ff00; border: 1px solid #00ff00; }
    .slot-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
    }

    .target-hint {
      font-family: 'Orbitron', sans-serif;
      color: #666; /* Color apagado para el objetivo */
      font-size: 1rem;
      border-bottom: 1px solid #333;
      width: 100%;
      text-align: center;
    }

    .digit-box.locked {
      border-color: #00ff00 !important;
      color: #00ff00 !important;
      text-shadow: 0 0 10px #00ff00;
    }

    /* Efecto de parpadeo cuando está activo */
    .digit-box:not(.locked) {
      border-color: var(--aethelgard-amber);
      animation: pulse 0.15s infinite;
    }

    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.8; }
      100% { opacity: 1; }
    }
  `]
})
export class DecryptorComponent {
  // Estados del juego
  currentSequence = signal<number[]>([0, 0, 0, 0]);
  lockedDigits = signal<boolean[]>([false, false, false, false]);
  targetNumbers = signal<number[]>([0, 0, 0, 0]);
  gameStatus = signal<'idle' | 'playing' | 'success' | 'fail'>('idle');
  isDecrypting = false;
  private interval: any;
  private functions = inject(Functions);

  startDecryption() {
    const newTarget = Array.from({length: 4}, () => Math.floor(Math.random() * 10));
    this.targetNumbers.set(newTarget);
    
    this.gameStatus.set('playing');
    this.isDecrypting = true;
    this.lockedDigits.set([false, false, false, false]);
    
    this.interval = setInterval(() => {
      this.currentSequence.update(seq => 
        seq.map((val, i) => this.lockedDigits()[i] ? val : Math.floor(Math.random() * 10))
      );
    }, 150); // Velocidad: 150ms es un reto decente
  }

  lockCurrentDigit() {const nextIndex = this.lockedDigits().indexOf(false);
    if (nextIndex === -1) return;

    const currentVal = this.currentSequence()[nextIndex];
    const targetVal = this.targetNumbers()[nextIndex];

    // VALIDACIÓN: ¿Coincide el número actual con el objetivo?
    if (currentVal === targetVal) {
      const newLocked = [...this.lockedDigits()];
      newLocked[nextIndex] = true;
      this.lockedDigits.set(newLocked);

      if (newLocked.every(v => v)) this.finishGame();
    } else {
      // PENALIZACIÓN: Si falla, reiniciamos ese dígito o damos un aviso
      console.log("MISMATCH! Intenta de nuevo.");
      // Opcional: podrías restar vida o tiempo aquí
    }
  }

  async finishGame() {
    this.isDecrypting = false;
    clearInterval(this.interval);
    
    const decryptFn = httpsCallable(this.functions, 'processDecryption');
    try {
      const result: any = await decryptFn();
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


}