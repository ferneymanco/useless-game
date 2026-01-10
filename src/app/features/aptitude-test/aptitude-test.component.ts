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

  terminalLogs = signal<string[]>([]);
  isProcessing = signal(false);

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

  async calculateResult() {

    this.isFinished.set(true);
    this.isProcessing.set(true);
    
    // Scoring logic
    const counts: any = {};
    this.answers().forEach(role => { counts[role] = (counts[role] || 0) + 1; });
    this.finalRole.set(Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b));

    // Visual simulation of data crunching
    const sequence = [
      "Analyzing behavioral patterns...",
      "Cross-referencing signal heuristics...",
      "Evaluating field response latency...",
      "Bypassing ethical sub-routines...",
      "Neural match found: " + this.finalRole().toUpperCase()
    ];

    for (const log of sequence) {
      await new Promise(res => setTimeout(res, 800));
      this.terminalLogs.update(prev => [...prev, log]);
    }

    this.isProcessing.set(false);
  }

  async saveAndOnboard() {
    try {
      // 1. First, we need the user to be authenticated
      await this.playerService.loginWithGoogle();
      
      // 2. Once logged in, we create their profile with the assigned role
      await this.playerService.createProfileAfterTest(this.finalRole() as any);
      
      // 3. Success! Redirect to the main dashboard
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error("Initialization failed:", error);
      // You could show a "Neural Link Failed" message here
    }
  }

  get progress() {
    if (this.questions().length === 0) return 0;
    return ((this.currentIndex() + 1) / this.questions().length) * 100;
  }

  getRoleDescription(): string {
  const descriptions: any = {
    'hacker': 'Master of digital intrusion and cryptographic subversion.',
    'engineer': 'Specialist in hardware manipulation and signal stability.',
    'tracker': 'Expert in physical geolocation and urban infiltration.',
    'analyst': 'Strategic mind focused on pattern recognition and OSINT.'
  };
  return descriptions[this.finalRole()] || 'Field operative in training.';
}
}
