import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { WeatherService } from '../service/weather.service';

@Component({
  selector: 'app-right-container',
  standalone: true,
  imports: [CommonModule, CommonModule],

  templateUrl: './right-container.component.html',
  styleUrl: './right-container.component.scss'
})
export class RightContainerComponent {
  constructor(public weatherService: WeatherService) { }



  onTodayClick() {
    this.weatherService.today = true;
    this.weatherService.week = false;
  }

  onWeekClick() {
    this.weatherService.today = false;
    this.weatherService.week = true;
  }

  onCelsiusClicik() {
    this.weatherService.celsius = true;
    this.weatherService.fehrenheit = false;
  }

  onFehrenheitClicik() {
    this.weatherService.celsius = false;
    this.weatherService.fehrenheit = true;
  }

}
