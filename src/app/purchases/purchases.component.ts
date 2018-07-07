import { Component, OnInit } from '@angular/core';
import { Purchases } from './../_models/purchases';
import { ToasterService } from './../_services/toaster.service';
import { UserService } from './../_services/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-purchases',
  templateUrl: './purchases.component.html',
  styleUrls: ['./purchases.component.scss']
})
export class purchasesComponent implements OnInit {

  newPurchases = { title : '', url : '', fullName : '', email : '', value : 0, tablenumber : '', addedon : '', addedBy : '', }
  

  purchases: FirebaseListObservable<any[]>;

  couponsRef: firebase.database.Reference;
  couponsList: Array<any>;
  
  usersRef: firebase.database.Reference;
  usersList: Array<any>;

  purchasesRef: firebase.database.Reference;
  purchasesList: Array<any>;
  loadedPurchasesList: Array<any>;

  searchTerm = '';
  errorMessage = '';

  selectize: any = {
    Coupontitle : ''
  }

config = {
  persist: true,
  maxPurchases: 1,
  valueField: 'id',
  labelField: 'name',
  searchField: ['name'],
  openOnFocus: true,
  closeAfterSelect: true,
  allowEmptyOption: false,
  preload: true,
  plugins: ['dropdown_direction', 'remove_button']
};

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToasterService,
    private afDatabase: AngularFireDatabase
  ) { 
    this.purchases = afDatabase.list('purchases');
    this.couponsRef = firebase.database().ref('/coupons');
    this.usersRef = firebase.database().ref('/User');
    this.purchasesRef = firebase.database().ref('/purchases');

    this.purchasesRef.on('value', purchasesList => {
      const purchases = [];

      purchasesList.forEach(purchase => {
        purchases.push({
          purchaseId: purchase.key,
          title: purchase.val().title,
          url: purchase.val().url,
          fullName: purchase.val().UserfullName,
          email: purchase.val().email,
          value: purchase.val().Couponvalue,
          tablenumber: purchase.val().tablenumber,
          addedon: purchase.val().addedOn,
          addedBy: purchase.val().addedBy
        });
        return false;
      });
      this.purchasesList = purchases;
    });
  }

  ngOnInit() {
    this.couponList();
    this.userList();
  }
  couponList() {
    this.couponsRef.on('value', couponsList => {
      const coupons = [];

      couponsList.forEach(Coupon => {
        coupons.push({
          id: Coupon.key,
          title: Coupon.val().Coupontitle,
        });
        return false;
      });
      this.couponsList = coupons;
    });
  }
  userList() {
    this.usersRef.on('value', usersList => {
      const users = [];

      usersList.forEach(user => {
        users.push({
          id: user.key,
          name: user.val().userfullName,
        });
        return false;
      });
      this.usersList = users;
    });
  }
  onValueChangeCoupon($event) {
    this.newPurchases.title = $event;

    const coupon = this.afDb.object('coupons/' + this.newPurchases.title, {preserveSnapshot: true});

    coupon.subscribe(snapshot => {
      this.newPurchases.url = snapshot.val().url
    });
  }
  onValueChangeUser($event) {
    this.newPurchases.fullName = $event;

    const user = this.afDb.object('user/' + this.newPurchases.fullName, {preserveSnapshot: true});

  }
  addpurchases(purchase: NgForm) {
    this.newPurchases.addedon = new Date().toISOString();
    this.newPurchases.addedBy = this.userService.getUser().fullName;

    this.purchases.push(this.newPurchases).then((addedpurchases) => {
      this.toaster.addToastSuccess('Added Purchase Successfully', '');

      purchase.resetForm({
        title: '',
        url: '',
        UserfullName: '',
        email: '',
        value: 0,
        tablenumber: '',
        addedOn: '',
        addedBy: ''
      });
    });
}

deletepurchase(purchase) {
  const dbPurchases = this.afDatabase.list('/items');

  dbPurchases.remove(purchase.key).then(() => {
    this.toaster.addToastSuccess('Purchase deleted', '');
  });

}

}
