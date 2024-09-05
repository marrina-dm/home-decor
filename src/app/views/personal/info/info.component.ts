import {Component, OnInit} from '@angular/core';
import {DeliveryType} from "../../../../types/delivery.type";
import {PaymentType} from "../../../../types/payment.type";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../shared/services/user.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {UserInfoType} from "../../../../types/user-info.type";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrl: './info.component.scss'
})
export class InfoComponent implements OnInit {
  public userInfoForm: FormGroup = this.fb.group({
    deliveryType: [DeliveryType.delivery],
    firstName: [''],
    lastName: [''],
    phone: [''],
    fatherName: [''],
    paymentType: [PaymentType.cashToCourier],
    email: ['', Validators.required],
    street: [''],
    house: [''],
    entrance: [''],
    apartment: ['']
  });
  public deliveryTypes = DeliveryType;
  public paymentTypes = PaymentType;

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.userService.getUserInfo()
      .subscribe((data: UserInfoType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        const userInfo = data as UserInfoType;
        const paramsToUpdate = {
          deliveryType: userInfo.deliveryType ? userInfo.deliveryType : DeliveryType.delivery,
          firstName: userInfo.firstName ? userInfo.firstName : '',
          lastName: userInfo.lastName ? userInfo.lastName : '',
          phone: userInfo.phone ? userInfo.phone : '',
          fatherName: userInfo.fatherName ? userInfo.fatherName : '',
          paymentType: userInfo.paymentType ? userInfo.paymentType : PaymentType.cashToCourier,
          email: userInfo.email,
          street: userInfo.street ? userInfo.street : '',
          house: userInfo.house ? userInfo.house : '',
          entrance: userInfo.entrance ? userInfo.entrance : '',
          apartment: userInfo.apartment ? userInfo.apartment : ''
        }
        this.userInfoForm.setValue(paramsToUpdate);
      });
  }

  changeDeliveryType(type: DeliveryType): void {
    this.userInfoForm.get('deliveryType')?.setValue(type);
    this.userInfoForm.markAsDirty();
  }

  updateUserInfo(): void {
    if (this.userInfoForm.valid) {
      const paramsObject: UserInfoType = {
        deliveryType: this.userInfoForm.value.deliveryType,
        paymentType: this.userInfoForm.value.paymentType,
        email: this.userInfoForm.value.email
      };
      if (this.userInfoForm.value.firstName) {
        paramsObject.firstName = this.userInfoForm.value.firstName;
      }
      if (this.userInfoForm.value.lastName) {
        paramsObject.lastName = this.userInfoForm.value.lastName;
      }
      if (this.userInfoForm.value.phone) {
        paramsObject.phone = this.userInfoForm.value.phone;
      }
      if (this.userInfoForm.value.fatherName) {
        paramsObject.fatherName = this.userInfoForm.value.fatherName;
      }
      if (this.userInfoForm.value.street) {
        paramsObject.street = this.userInfoForm.value.street;
      }
      if (this.userInfoForm.value.street) {
        paramsObject.street = this.userInfoForm.value.street;
      }
      if (this.userInfoForm.value.house) {
        paramsObject.house = this.userInfoForm.value.house;
      }
      if (this.userInfoForm.value.entrance) {
        paramsObject.entrance = this.userInfoForm.value.entrance;
      }
      if (this.userInfoForm.value.apartment) {
        paramsObject.apartment = this.userInfoForm.value.apartment;
      }

      this.userService.updateUserInfo(paramsObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if (data.error) {
              this._snackBar.open(data.message);
              throw new Error(data.message);
            }

            this._snackBar.open('Данные успешно сохранены');
            this.userInfoForm.markAsPristine();
          },
          error: (error: HttpErrorResponse) => {
            if (error.error && error.error.message) {
              this._snackBar.open(error.error.message);
            } else {
              this._snackBar.open('Ошибка сохранения');
            }
          }
        });
    }
  }
}
