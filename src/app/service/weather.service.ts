import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { locationDetails } from '../modal/locationDetails';
import { weatherDetails } from '../modal/weatherDetails';
import { TempData } from '../modal/tempData';
import { TodayData } from '../modal/todayData';
import { WeekData } from '../modal/weekData';
import { TodaysHighlight } from '../modal/todaysHighlight';
import { Observable } from 'rxjs';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})

export class WeatherService {
  loading: boolean = true;
  currentTime: Date;
  cityName: string = 'Chandigarh';
  language: string = 'en-US';
  date: string = '20200622'
  units: string = 'm';

  locationDetails?: locationDetails;
  weatherDetails?: weatherDetails;

  temperatureData: TempData = new TempData();
  todayData: TodayData[] = [];
  weekData: WeekData[] = [];
  todaysHighlights: TodaysHighlight = new TodaysHighlight;


  celsius: boolean = true;
  fehrenheit: boolean = false;
  today: boolean = false;
  week: boolean = true;

  constructor(private httpClient: HttpClient) {
    this.getData();

  }

  prepereData(): void {
    this.fillTemperatureDataModal();
    this.fillWeekData();
    this.fillTodaydata();
    this.fillTodayHighlight()
    console.log(this.temperatureData);
    console.log(this.weekData);
    console.log(this.todayData);
  }

  getData() {
    this.loading= true
    this.todayData = [];
    this.weekData = []
    this.temperatureData = new TempData;
    this.todaysHighlights = new TodaysHighlight;
    var latitude = 0;
    var longitude = 0;

    this.getlocationDetails(this.cityName, this.language).subscribe({
      //next use to get valid data , it will neglect null values
      next: (reponse) => {
        this.locationDetails = reponse
        latitude = this.locationDetails?.location.latitude[0];
        longitude = this.locationDetails?.location.latitude[0];

        this.getWeatherReport(this.date, latitude, longitude, this.language, this.units).subscribe({
          next: (response) => {
            this.weatherDetails = response;
            this.prepereData();

          }
        })
      }
    });
    this.loading=false
  }

  getlocationDetails(cityName: string, language: string): Observable<locationDetails> {
    return this.httpClient.get<locationDetails>(environment.locationbaseURL,
      {
        headers: new HttpHeaders()
          .set(environment.xRapidapiKeyname, environment.xRapidapiKeyValue)
          .set(environment.xRapidapiHostName, environment.xRapidapiHostValue),
        params: new HttpParams()
          .set('query', cityName)
          .set('language', language)
      }
    )
  }

  getWeatherReport(date: string, latitude: number, longitude: number, language: string, units: string): Observable<weatherDetails> {
    return this.httpClient.get<weatherDetails>(environment.forcastBaseURL, {
      headers: new HttpHeaders()
        .set(environment.xRapidapiKeyname, environment.xRapidapiKeyValue)
        .set(environment.xRapidapiHostName, environment.xRapidapiHostValue),
      params: new HttpParams()
        .set('date', date)
        .set('latitude', latitude)
        .set('longitude', longitude)
        .set('language', language)
        .set('units', units)
    });
  }

  fillTemperatureDataModal() {
    this.currentTime = new Date();
    this.temperatureData.day = this.weatherDetails['v3-wx-observations-current'].dayOfWeek;
    this.temperatureData.time = `${String(this.currentTime.getHours()).padStart(2, '0')}:${String(this.currentTime.getMinutes()).padStart(2, '0')}`;
    this.temperatureData.temperature = this.weatherDetails['v3-wx-observations-current'].temperature;
    this.temperatureData.location = `${this.locationDetails.location.city[0]},${this.locationDetails.location.country[0]}`;
    this.temperatureData.rainPercent = this.weatherDetails['v3-wx-observations-current'].precip24Hour;
    this.temperatureData.summeryPhrase = this.weatherDetails['v3-wx-observations-current'].wxPhraseShort;
    this.temperatureData.summeryImg = this.getSummeryImage(this.temperatureData.summeryPhrase);
  }

  fillWeekData() {
    var weekCount = 0;
    while (weekCount < 7) {
      this.weekData.push(new WeekData());
      this.weekData[weekCount].day = this.weatherDetails['v3-wx-forecast-daily-15day'].dayOfWeek[weekCount].slice(0, 3);
      this.weekData[weekCount].tempMax = this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMax[weekCount];
      this.weekData[weekCount].tempMin = this.weatherDetails['v3-wx-forecast-daily-15day'].calendarDayTemperatureMin[weekCount];
      this.weekData[weekCount].summeryImage = this.getSummeryImage(this.weatherDetails['v3-wx-forecast-daily-15day'].narrative[weekCount]);
      weekCount++;
    }
  }

  fillTodaydata() {
    var todayCount = 0;
    while (todayCount < 7) {
      this.todayData.push(new TodayData());


      this.todayData[todayCount].time = this.weatherDetails['v3-wx-forecast-hourly-10day'].validTimeLocal[todayCount].slice(11, 16);

      this.todayData[todayCount].temp = this.weatherDetails['v3-wx-forecast-hourly-10day'].temperature[todayCount];

      this.todayData[todayCount].summaryImage = this.getSummeryImage(this.weatherDetails['v3-wx-forecast-hourly-10day'].wxPhraseShort[todayCount]);
      todayCount++;
    }
  }

  getSummeryImage(summery: string): string {
    var baseAddress = '../../assets/'
    var cloudySunny = 'cloudy.png';
    var rainSunny = 'cloudysun.png';
    var windy = 'wind.png';
    var sunny = 'sun.png';
    var rainy = 'rain.png';

    if (String(summery).includes("Partly Cloudy") || String(summery).includes("P Cloudy")) return baseAddress + cloudySunny;

    else
      if (String(summery).includes("Partly Rainy") || String(summery).includes("P Rainy")) return baseAddress + rainSunny;


      else
        if (String(summery).includes("Wind")) return baseAddress + windy;

        else
          if (String(summery).includes("Rain")) return baseAddress + rainy;

          else
            if (String(summery).includes("Sun")) return baseAddress + sunny;


    return baseAddress + cloudySunny;
  }

  fillTodayHighlight() {
    this.todaysHighlights.airQuality = this.weatherDetails['v3-wx-globalAirQuality'].globalairquality.airQualityIndex;

    this.todaysHighlights.humidity = this.weatherDetails['v3-wx-observations-current'].relativeHumidity;

    this.todaysHighlights.sunRise = this.getTimeFromString(this.weatherDetails['v3-wx-observations-current'].sunriseTimeLocal);

    this.todaysHighlights.sunSet = this.getTimeFromString(this.weatherDetails['v3-wx-observations-current'].sunsetTimeLocal);

    this.todaysHighlights.uvIndex = this.weatherDetails['v3-wx-observations-current'].uvIndex;

    this.todaysHighlights.visibility = this.weatherDetails['v3-wx-observations-current'].visibility;

    this.todaysHighlights.windStatus = this.weatherDetails['v3-wx-observations-current'].windSpeed;
  }

  getTimeFromString(locaTime: string) {
    return locaTime.slice(11, 16)
  }


  celsiusToFahrenheit(celsius: number): number {
    return +((celsius * 1.8) + 32).toFixed(2);
  }

  fehrenheitToCelsius(fehrenheit: number): number {
    return +((fehrenheit - 32) * 0.5555).toFixed(2);
  }

}
