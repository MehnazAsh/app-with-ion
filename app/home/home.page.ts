import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { DataService } from '../data.service';
import { Storage } from '@ionic/storage';
import { Chart } from 'chart.js';
import { LoadingController } from '@ionic/angular';




@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  detailToggle = [];
  likedCoins = [];
  objectKeys = Object.keys;
  coins: Object;
  details: Object;
  chart = [];

  constructor(public navCtrl: NavController, private _data: DataService, private storage: Storage,public loadingCtrl: LoadingController) {
    this.storage.remove('likedCoins');
   
  }

  

  ionViewDidEnter() {

  }

  ionViewWillEnter() {
   
    this.refreshCoins();
  }

  async refreshCoins() {

    const loader = await this.loadingCtrl.create({

      message: 'Refreshing..',
      spinner: 'bubbles'
    });

   await loader.present().then(() => {
      
      this.storage.get('likedCoins').then((val) => {
        console.log(val);
        
        //if thevalue is not set, then
        if (!val) {

          this.likedCoins.push('BTC', 'ETH', 'IOT');
          this.storage.set('likedCoins', this.likedCoins);
          this._data.getCoins(this.likedCoins)
            .subscribe(res => {
              this.coins = res;
              loader.dismiss();

            })
        } 

        //else its set
        else {

          this.likedCoins = val;

          this._data.getCoins(this.likedCoins)
          
            .subscribe(res => {
              
              this.coins = res;
              loader.dismiss();
            })
        }
      });

    });
  }
  coinDetails(coin: any, index: any) {
    if (this.detailToggle[index])
      this.detailToggle[index] = false;
    else {
      this.detailToggle.fill(false);

      this._data.getCoin(coin)
        .subscribe(res => {
          this.details = res['DISPLAY'][coin]['USD'];
          this.detailToggle[index] = true;
          console.log(res);

          this._data.getChart(coin)
            .subscribe(res => {
              console.log(res);
              let coinHistory = res['Data']['Data'].map((a) => (a.close));

              setTimeout(() => {
                this.chart[index] = new Chart('canvas' + index, {
                  type: 'line',
                  data: {
                    labels: coinHistory,
                    datasets: [{
                      data: coinHistory,
                      borderColor: "#3cba9f",
                      fill: false
                    }
                    ]
                  },
                  options: {
                    tooltips: {
                      callbacks: {
                        label: function (tooltipItems, data) {
                          return "$" + tooltipItems.yLabel.toString();
                        }
                      }
                    },
                    responsive: true,
                    legend: {
                      display: false
                    },
                    scales: {
                      xAxes: [{
                        display: false
                      }],
                      yAxes: [{
                        display: false
                      }],
                    }
                  }
                });
              }, 250);
            })
        })
    }
  }

  swiped(index) {

    this.detailToggle[index] = false;
  }

  removeCoin(coin) {
    this.detailToggle.fill(false);
    this.likedCoins = this.likedCoins.filter(function (item) {
      return item !== coin

    });
    this.storage.set('likedCoins', this.likedCoins);

    setTimeout(() => {

      this.refreshCoins();
    }, 300);
  }
  showSearch(){
    this.navCtrl.navigateForward('/search');
  }
}
