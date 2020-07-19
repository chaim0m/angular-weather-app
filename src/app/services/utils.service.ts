import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  cToF(celsius: number): number {
    const cTemp = celsius;
    return Math.round(cTemp * 9 / 5 + 32);
  }

   fToC(fahrenheit: number): number {
    const fTemp = fahrenheit;
    return Math.round((fTemp - 32) * 5 / 9) ;
  }

}
