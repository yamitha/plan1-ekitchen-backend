import { NgForm } from '@angular/forms';
import { ToasterService } from './../_services/toaster.service';
import { Kitchen } from './../_models/kitchen';
import { UserService } from './../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';

@Component({
  selector: 'app-coupons',
  templateUrl: './coupons.component.html',
  styleUrls: ['./coupons.component.scss']
})
export class CouponsComponent implements OnInit {

  coupon = {
    title: '',
    url: '',
    description: '',
    showOnFront: true,
    transactionPercentage: 0,
    whatsappNumber: '',
    addedBy: '',
    addedOn: '',
    forDate: '',
    value: 0,
    artWorkLink: ''
  };

  public editor;
  // public editorContent = `<h3>Insert coupon content...</h3>`;
  public editorOptions = {
    theme: 'snow',
    placeholder: 'Insert coupon content...'
  };

  coupons: FirebaseListObservable<any[]>;
  couponsRef: firebase.database.Reference;
  couponsList: Array<any>;

  constructor(
    private userService: UserService,
    private afAuth: AngularFireAuth,
    private afDb: AngularFireDatabase,
    private route: ActivatedRoute,
    private router: Router,
    private toaster: ToasterService
  ) {
    this.coupons = afDb.list('coupons');
    this.couponsRef = firebase.database().ref('/coupons');

    this.couponsRef.on('value', couponsList => {
      const coupons = [];
      couponsList.forEach(coupon => {
        coupons.push({
          couponId: coupon.key,
          title: coupon.val().title,
          whatsappNumber: coupon.val().whatsappNumber,
          addedOn: coupon.val().addedOn,
          addedBy: coupon.val().addedBy,
          artWorkLink: coupon.val().artWorkLink,
          value: coupon.val().value,
          url: coupon.val().url,
          description: coupon.val().description,
        });
        return false;
      })
      this.couponsList = coupons;
    })
  }

  ngOnInit() {
  }

  // onEditorBlured(quill) {
  //   console.log('editor blur!', quill);
  // }

  // onEditorFocused(quill) {
  //   console.log('editor focus!', quill);
  // }

  // onEditorCreated(quill) {
  //   this.editor = quill;
  //   console.log('quill is ready! this is current quill instance object', quill);
  // }

  // onContentChanged({ quill, html, text }) {
  //   console.log('quill content is changed!', quill, html, text);
  // }

  addCoupon(couponForm: NgForm) {
    // phone number validation
    let valid = false;
    let error = '';

    // check if theres any strings
    if (/^\d+$/.test(this.coupon.whatsappNumber)) {
      if (this.coupon.whatsappNumber.startsWith('0')) {
        if (this.coupon.whatsappNumber.length === 10) {
          valid = true;
        } else {
          error = 'Invalid Whatsapp number';
        }
      } else {
        if (this.coupon.whatsappNumber.length === 9) {
          valid = true;
        } else {
          error = 'Invalid Whatsapp number';
        }
      }
      // check if the length is between range
    } else {
      error = 'Please enter a valid Whatsapp number';
    }

    if (error && !valid) {
      this.toaster.addToastError('Error', error);
    }

    if (valid) {
      // generating url
      this.coupon.url = this.coupon.title;
      this.coupon.url = this.coupon.url.replace(/\s+/g, '-').replace('\'', '').toLowerCase();
      this.coupon.addedOn = new Date().toISOString();
      this.coupon.addedBy = this.userService.getUser().fullName;
      this.coupon.whatsappNumber = '94' + this.coupon.whatsappNumber;

      this.coupons.push(this.coupon).then(coupon => {
        this.toaster.addToastSuccess('Added Coupon SuccessFully', '');
        couponForm.resetForm({
          title: '',
          url: '',
          description: '',
          showOnFront: true,
          transactionPercentage: 0,
          whatsappNumber: '',
          addedBy: '',
          addedOn: '',
          forDate: '',
          value: 0,
          artWorkLink: ''
        });
      })
    }
  }

  deleteCoupon(coupon) {
    const dbCoupons = this.afDb.list('/coupons');

    dbCoupons.remove(coupon.key).then(() => {
      this.toaster.addToastSuccess('Coupon deleted', '');
    });

  }
}
