import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, tap} from "rxjs";
import {environment} from "../../../environments/environment";
import {CartType} from "../../../types/cart.type";

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private count: number = 0;
  public count$: Subject<number> = new Subject<number>();

  constructor(private http: HttpClient) { }

  getCart(): Observable<CartType> {
    return this.http.get<CartType>(environment.api + 'cart', {withCredentials: true});
  }

  updateCart(productId: string, quantity: number): Observable<CartType> {
    return this.http.post<CartType>(environment.api + 'cart', {productId, quantity}, {withCredentials: true})
      .pipe(
        tap(data => {
          this.count = 0;
          data.items.forEach(item => {
            this.count += item.quantity;
          });
          this.count$.next(this.count);
        })
      );
  }

  getCartCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(environment.api + 'cart/count', {withCredentials: true})
      .pipe(
      tap(data => {
        this.count = data.count;
        this.count$.next(this.count);
      })
    );
  }
}
