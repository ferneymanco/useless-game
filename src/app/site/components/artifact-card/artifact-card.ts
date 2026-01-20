import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-artifact-card',
  imports: [],
  templateUrl: './artifact-card.html',
  styleUrl: './artifact-card.scss',
})
export class ArtifactCard {
  @Input() title: string = '01: THE REACTIVE';
  @Input() visuals: string = '🪳';
  @Input() status: string = 'ACTIVE';
  @Input() sensors: string = 'RF / STATIC';
  @Input() classified: boolean = false;

}
