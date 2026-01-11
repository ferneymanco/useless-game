import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mission-code-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatFormFieldModule, MatInputModule, FormsModule, MatButtonModule],
  template: `
    <div class="terminal-dialog">
      <h2 mat-dialog-title>> ESTABLISHING LINK...</h2>
      <mat-dialog-content>
        <p>MISSION: {{ data.mission.title }}</p>
        <p class="instruction">ENTER OBJECTIVE DECRYPTION CODE:</p>
        <mat-form-field appearance="outline" class="full-width">
          <input matInput [(ngModel)]="inputCode" placeholder="0x0000" autocomplete="off">
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">ABORT</button>
        <button mat-raised-button color="accent" (click)="onConfirm()" [disabled]="!inputCode">EXECUTE</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .terminal-dialog { background: #050505; color: #00ff00; font-family: 'Courier New', monospace; padding: 10px; border: 1px solid #00ff00; }
    .instruction { color: #888; font-size: 0.8rem; margin-bottom: 15px; }
    .full-width { width: 100%; }
    ::ng-deep .terminal-dialog .mat-mdc-form-field-flex { background: transparent !important; }
    input { color: #00ff00 !important; text-transform: uppercase; letter-spacing: 2px; }
  `]
})
export class MissionCodeDialogComponent {
  public data = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<MissionCodeDialogComponent>);
  inputCode = '';

  onCancel() { this.dialogRef.close(); }
  onConfirm() { this.dialogRef.close(this.inputCode); }
}
