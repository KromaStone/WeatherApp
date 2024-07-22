import { Component, } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faMagnifyingGlass, faLocation, faCloud, faCloudRain } from '@fortawesome/free-solid-svg-icons';
import { WeatherService } from '../service/weather.service';


@Component({
  selector: 'app-left-container',
  standalone: true,
  imports: [FontAwesomeModule],
  templateUrl: './left-container.component.html',
  styleUrl: './left-container.component.scss'
})
export class LeftContainerComponent {
  magnifyingGlass: any = faMagnifyingGlass;
  location: any = faLocation;
  cloud: any = faCloud;
  rain: any = faCloudRain;

  constructor(public weatherService: WeatherService) { }

  //const user = await this.authService.isLoggedIn()

  onSearch(locaion: string) {
    this.weatherService.cityName = locaion;
    this.weatherService.getData();
  }
}
