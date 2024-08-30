import {Component, OnInit} from '@angular/core';
import {FavoriteService} from "../../../shared/services/favorite.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {FavoriteType} from "../../../../types/favorite.type";
import {environment} from "../../../../environments/environment";

@Component({
  selector: 'app-favorite',
  templateUrl: './favorite.component.html',
  styleUrl: './favorite.component.scss'
})
export class FavoriteComponent implements OnInit {
  public products: FavoriteType[] = [];
  public serverStaticPath: string = environment.serverStaticPath;

  constructor(private favoriteService: FavoriteService) {
  }

  ngOnInit(): void {
    this.favoriteService.getFavorites().subscribe((data: FavoriteType[] | DefaultResponseType) => {
      if ((data as DefaultResponseType).error !== undefined) {
        const error = (data as DefaultResponseType).message;
        throw new Error(error);
      }

      this.products = data as FavoriteType[];
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
}
