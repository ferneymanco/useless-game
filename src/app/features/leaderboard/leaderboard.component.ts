import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Functions, httpsCallable } from '@angular/fire/functions';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss'],
})
export class LeaderboardComponent implements OnInit {
  private functions = inject(Functions);
  agents = signal<any[]>([]);
  loading = signal<boolean>(true);

  async ngOnInit() {
    const getLeaderboard = httpsCallable(this.functions, 'getGlobalLeaderboard');
    try {
      const result: any = await getLeaderboard();
      this.agents.set(result.data.leaderboard);
    } finally {
      this.loading.set(false);
    }
  }
}