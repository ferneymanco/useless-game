import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-aptitude-test',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatRadioModule, MatButtonModule, FormsModule],
  template: `
    <div class="test-container">
      <mat-card class="aethelgard-card">
        <mat-card-header>
          <mat-card-title>PROTOCOLO DE EVALUACIÓN v1.0</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngIf="!completed; else results">
            <h3>Pregunta {{currentStep + 1}} de {{questions.length}}</h3>
            <p class="question-text">{{questions[currentStep].text}}</p>
            
            <mat-radio-group [(ngModel)]="selectedAnswer" class="options-group">
              <mat-radio-button *ngFor="let opt of questions[currentStep].options" [value]="opt.role">
                {{opt.text}}
              </mat-radio-button>
            </mat-radio-group>
          </div>
          
          <ng-template #results>
            <div class="results-screen">
              <h2>ANÁLISIS COMPLETADO</h2>
              <p>Tu perfil asignado es: <strong>{{assignedRole | uppercase}}</strong></p>
              <button mat-raised-button color="primary" (click)="finalize()">ACEPTAR ROL Y DESCARGAR APP</button>
            </div>
          </ng-template>
        </mat-card-content>
        <mat-card-actions *ngIf="!completed">
          <button mat-button (click)="next()" [disabled]="!selectedAnswer">SIGUIENTE ></button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .test-container { padding: 20px; display: flex; justify-content: center; }
    .options-group { display: flex; flex-direction: column; margin: 20px 0; }
    .question-text { font-size: 1.2rem; color: var(--aethelgard-amber); }
  `]
})
export class AptitudeTestComponent {
  currentStep = 0;
  selectedAnswer: string = '';
  completed = false;
  assignedRole = '';

  questions = [
    { 
      text: 'Detectas una anomalía en el RSSI de -30dBm. ¿Qué haces?', 
      options: [
        { text: 'Triangular la posición física.', role: 'tracker' },
        { text: 'Inyectar un script de escucha.', role: 'hacker' }
      ]
    },
    // Añadir el resto de preguntas aquí...
  ];

  next() {
    if (this.currentStep < this.questions.length - 1) {
      this.currentStep++;
      this.selectedAnswer = '';
    } else {
      this.completed = true;
      this.assignedRole = 'Hacker'; // Lógica de cálculo de rol
    }
  }

  finalize() { /* Redirigir a descarga de App o Donación */ }
}
