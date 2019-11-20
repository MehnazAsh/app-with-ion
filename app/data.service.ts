import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  result:any;

  constructor(public  _http:HttpClient) { }

  getCoins(coins)
  {
    let coinlist='';
    coinlist=coins.join();
    return this._http.get("https://min-api.cryptocompare.com/data/pricemulti?fsyms="+coinlist+"&tsyms=USD")
      .pipe(map(result => this.result=result));
    
  }
  getCoin(coin){
    return this._http.get("https://min-api.cryptocompare.com/data/pricemultifull?fsyms="+coin+"&tsyms=USD")
    .pipe(map(result => this.result=result));

  }

  getChart(coin){
    
    return this._http.get("https://min-api.cryptocompare.com/data/v2/histoday?fsym="+coin+"&tsym=USD&limit=30&aggregate=1")
    .pipe(map(result => this.result=result));

  }

  allCoins(){
    //let headers = new HttpHeaders()
      //.set("Access-Control-Allow-Origin","*");
     // return this._http.get("https://min-api.cryptocompare.com/data/all/coinlist",{headers:headers})
      return this._http.get("https://min-api.cryptocompare.com/data/all/coinlist")
    .pipe(map(result => this.result=result));
  }
}
