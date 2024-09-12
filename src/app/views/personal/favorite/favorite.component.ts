import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteType} from "../../../../types/favorite.type";
import {environment} from "../../../../environments/environment";
import {CartType} from "../../../../types/cart.type";
import {CartService} from "../../../shared/services/cart.service";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {
  public products: FavoriteType[] = [];
  public serverStaticPath: string = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService,
              private cartService: CartService) {
  }

  ngOnInit(): void {
    this.favoriteService.getFavorites().subscribe((data: FavoriteType[] | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        const error = (data as DefaultResponseType).message;
        throw new Error(error);
      }

      this.products = data as FavoriteType[];

      this.cartService.getCart()
        .subscribe((cartData: CartType | DefaultResponseType) => {
          if ((cartData as DefaultResponseType).error !== undefined) {
            throw new Error((cartData as DefaultResponseType).message);
          }

          const cartDataResponse = cartData as CartType;
          if (cartDataResponse) {
            this.products.forEach(product => {
              const productInCart = cartDataResponse.items.find(item => item.product.id === product.id);
              if (productInCart) {
                product.countInCart = productInCart.quantity;
              }
            });
          }
        });
    });
  }

  removeFromFavorites(id: string): void {
    this.favoriteService.removeFavorites(id).subscribe((data: DefaultResponseType) => {
      if (data.error) {
        throw new Error(data.message);
      }

      this.products = this.products.filter((item: FavoriteType) => item.id !== id);
    });
  }

  addToCart(product: FavoriteType): void {
    this.cartService.updateCart(product.id, 1)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        product.countInCart = 1;
      });
  }

  removeFromCart(product: FavoriteType): void {
    this.cartService.updateCart(product.id, 0)
      .subscribe((data: CartType | DefaultResponseType) => {
        if ((data as DefaultResponseType).error !== undefined) {
          throw new Error((data as DefaultResponseType).message);
        }

        product.countInCart = 0;
      });
  }

  updateCount(product: FavoriteType, count: number): void {
      this.cartService.updateCart(product.id, count)
        .subscribe((data: CartType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          product.countInCart = count;
        });
  }
}
