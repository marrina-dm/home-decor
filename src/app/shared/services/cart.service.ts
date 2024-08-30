import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {CartType} from "../../../types/cart.type";
import {DefaultResponseType} from "../../../types/default-response.type";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private count: number = 0;
  public count$: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) { }

  getCart(): Observable<CartType | DefaultResponseType> {
    return this.http.get<CartType | DefaultResponseType>(environment.api + 'cart', {withCredentials: true});
  }

  updateCart(productId: string, quantity: number): Observable<CartType | DefaultResponseType> {
    return this.http.post<CartType | DefaultResponseType>(environment.api + 'cart', {productId, quantity}, {withCredentials: true})
      .pipe(
        tap(data => {
          if (!data.hasOwnProperty("error")) {
            this.count = 0;
            (data as CartType).items.forEach(item => {
              this.count += item.quantity;
            });
            this.count$.next(this.count);
          }
        })
      );
  }

  getCartCount(): Observable<{ count: number } | DefaultResponseType> {
    return this.http.get<{ count: number }>(environment.api + 'cart/count', {withCredentials: true})
      .pipe(
      tap(data => {
        if (!data.hasOwnProperty("error")) {
          this.count = (data as { count: number }).count;
          this.count$.next(this.count);
        }
      })
    );
  }
}
