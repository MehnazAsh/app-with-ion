import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Storage } from '@ionic/storage';

import { LoadingController, NavController, NavParams } from '@ionic/angular';


@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {

  objectKeys = Object.keys;
  likedCoins = [];
  raw = [];
  allcoins: any;
  liked = [];
  constructor(private storage: Storage, private _data: DataService, public loadingCtrl: LoadingController, public navCtrl: NavController) { }

  ngOnInit() {

  }

  async ionViewDidEnter() {


    const loader = await this.loadingCtrl.create({

      message: 'Refreshing..',
      spinner: 'bubbles'
    });

    await loader.present().then(() => {
      this.storage.get('likedCoins').then((val) => {

        this.likedCoins = val;
      });
      this._data.allCoins()
        .subscribe(res => {
          console.log(res);
          this.raw = res['Data'];
          this.allcoins = res['Data'];
          loader.dismiss();
          this.storage.get('likedCoins').then((val) => {

            this.liked = val;
          })
        })
    });
  }

  addCoin(coin) {

    this.likedCoins.push(coin);
    this.storage.set('likedCoins',this.likedCoins);
    console.log(this.likedCoins);

  }
  searchCoins(ev:any){
    let val = ev.target.value;
    this.allcoins=this.raw;
    if(val && val.trim() !=''){

      const filtered=Object.keys(this.allcoins)
        .filter(key => val.toUpperCase().includes(key))
        .reduce((obj,key) => {

            obj[key]= this.allcoins[key];
            return obj;
        }, {});

        this.allcoins=filtered;
    }
  }
}
