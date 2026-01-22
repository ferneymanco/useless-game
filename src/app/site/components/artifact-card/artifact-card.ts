import { Component, Input } from '@angular/core';
import { Artefact } from '../../../core/models/artefact';

@Component({
  selector: 'app-artifact-card',
  imports: [],
  templateUrl: './artifact-card.html',
  styleUrl: './artifact-card.scss',
})
export class ArtifactCard {
  @Input() artefactData: Artefact = {id: '', title: '', status: '', sensors: '', classified: false, img: ''};

}
