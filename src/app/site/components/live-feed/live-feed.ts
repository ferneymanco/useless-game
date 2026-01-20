import { Component, signal } from '@angular/core';
import { ARTIFACT_LOG } from '../../../core/constants/site-artifacts-log';

@Component({
  selector: 'app-live-feed',
  imports: [],
  templateUrl: './live-feed.html',
  styleUrl: './live-feed.scss',
})
export class LiveFeed {
  log = ARTIFACT_LOG[0];
  
  displayedText = signal<string>('LOG: ');
  currentLog = signal<{text: string[], currentIndex: number} | null>(null);

  ngOnInit() {
    if (this.log) {
      this.currentLog.set({ ...this.log, currentIndex: 0 });
      this.typeWriterEffect(this.log.text[0]);
    }
  }
  
  private typeWriterEffect(fullText: string) {
    let i = 0;
    const interval = setInterval(() => {
      this.displayedText.update(t => t + fullText.charAt(i));
      i++;
      if (i === fullText.length){
        clearInterval(interval);
        this.nextLogLine();
      }
    }, 30);
  }

  nextLogLine() {
    const current = this.currentLog();
    if (!current) return;

    if (current.currentIndex < current.text.length - 1) {
      const nextIdx = current.currentIndex + 1;
      this.currentLog.set({ ...current, currentIndex: nextIdx });
      let next_text = "\nLOG: "+current.text[nextIdx];
      this.typeWriterEffect(next_text);
    }
  }

}
