import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LeftContainerComponent } from "./left-container/left-container.component";
import { RightContainerComponent } from "./right-container/right-container.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LeftContainerComponent, RightContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'weatherApp';
}
