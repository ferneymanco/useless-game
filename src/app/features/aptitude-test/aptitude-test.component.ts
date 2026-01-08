import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AptitudeService } from '../../core/services/aptitude.service';
import { AptitudeQuestion } from '../../core/models/aptitude.model';
import { PlayerService } from '../../core/services/player.service';
import { PlayerRole } from '../../core/models/player.model';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-aptitude-test',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatRadioModule, MatButtonModule, MatProgressBarModule, FormsModule],
  templateUrl: './aptitude-test.component.html',
  styleUrls: ['./aptitude-test.component.scss']
})
export class AptitudeTestComponent implements OnInit {
  private aptitudeService = inject(AptitudeService);
  private playerService = inject(PlayerService);
  private router = inject(Router);

  questions = signal<AptitudeQuestion[]>([]);
  currentIndex = signal(0);
  selectedWeight = signal<string>('');
  answers = signal<string[]>([]);
  isFinished = signal(false);
  finalRole = signal<string>('');

  ngOnInit() {
    this.aptitudeService.getQuestions().subscribe(data => {
      this.questions.set(data);
    });
  }

  nextQuestion() {
    this.answers.update(prev => [...prev, this.selectedWeight()]);
    
    if (this.currentIndex() < this.questions().length - 1) {
      this.currentIndex.update(v => v + 1);
      this.selectedWeight.set('');
    } else {
      this.calculateResult();
    }
  }

  calculateResult() {
    const counts: any = {};
    this.answers().forEach(role => { counts[role] = (counts[role] || 0) + 1; });
    
    // Find the role with the highest frequency
    const sortedRoles = Object.keys(counts).sort((a, b) => counts[b] - counts[a]);
    this.finalRole.set(sortedRoles[0] || 'recruit');
    this.isFinished.set(true);
  }

  async saveAndOnboard() {
    try {
      // Trigger login first if not authenticated (PlayerService handles this usually, but finalization needs a UID)
      await this.playerService.loginWithGoogle();
      await this.playerService.createProfileAfterTest(this.finalRole() as any);
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Finalization failed:', error);
      alert('Authentication or profile creation failed. Please try again.');
    }
  }

  get progress() {
    if (this.questions().length === 0) return 0;
    return ((this.currentIndex() + 1) / this.questions().length) * 100;
  }
}
