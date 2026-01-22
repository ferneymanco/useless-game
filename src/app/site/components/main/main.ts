import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StatusHeader } from "../status-header/status-header";
import { ArtifactCard } from "../artifact-card/artifact-card";
import { LiveFeed } from "../live-feed/live-feed";
import { SecurityPopup } from "../security-popup/security-popup";
import { ARTIFACT_CATALOG } from '../../../core/constants/site-artifacts-log';
import { Artefact } from '../../../core/models/artefact';

@Component({
  standalone: true,
  selector: 'app-main',
  imports: [CommonModule, FormsModule, StatusHeader, ArtifactCard, LiveFeed, SecurityPopup],
  templateUrl: './main.html',
  styleUrl: './main.scss',
})
export class Main {
  public artifacts: Artefact[] = Object.values(ARTIFACT_CATALOG) as Artefact[];
 
  /*  mouseX = 0;
    mouseY = 0; */

  // Popup State
  isPopupVisible = false;
  
  // Loading Screen State
  loadingScreenStyle: { [klass: string]: any } = {};
  enterBtnText = '[ REQUEST SPECIMEN ACCESS ]';
  enterBtnStyle: { [klass: string]: any } = {};

 /*  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.mouseX = event.clientX;
    this.mouseY = event.clientY;
  } */

  openPopup() {
    this.isPopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
  }

  onAccessGranted() {
      this.isPopupVisible = false;
      this.enterBtnText = '[ ACCESS GRANTED ]';
      this.enterBtnStyle = {
        'background': '#00ff00',
        'color': '#000'
      };

      setTimeout(() => {
        this.loadingScreenStyle = {
            'transition': 'opacity 0.8s ease-out, filter 0.5s ease',
            'opacity': '0',
            'filter': 'blur(10px)'
        };
        setTimeout(() => {
          this.loadingScreenStyle = { ...this.loadingScreenStyle, 'display': 'none' };
        }, 800);
      }, 500);
  }

}
