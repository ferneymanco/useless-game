import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent } from "@angular/material/card";
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, /*MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatIcon*/],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('lazaro-web');
}
