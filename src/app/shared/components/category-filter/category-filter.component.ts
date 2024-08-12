import {Component, Input} from '@angular/core';
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrl: './category-filter.component.scss'
})
export class CategoryFilterComponent {
  @Input() category: CategoryWithTypeType | null = null;
  @Input() type: string | null = null;
  open: boolean = false;
  activeParams: ActiveParamsType = {types: []};

  constructor(private router: Router) {
  }

  get title(): string {
    if (this.category) {
      return this.category.name;
    } else if (this.type) {
      if (this.type === 'height') {
        return 'Высота';
      }else if (this.type === 'diameter') {
        return 'Диаметр';
      }
    }

    return '';
  }

  toggle(): void {
    this.open = !this.open;
  }

  updateFilterParam(url: string, checked: boolean): void {
    if (this.activeParams.types && this.activeParams.types.length > 0) {
      const existingTypeInParams = this.activeParams.types.find(item => item === url);
      if (existingTypeInParams && !checked) {
        this.activeParams.types = this.activeParams.types.filter(item => item !== url);
      } else if (!existingTypeInParams && checked) {
        this.activeParams.types.push(url);
      }
    } else if (checked) {
      this.activeParams.types = [url];
    }
    this.router.navigate(['/catalog'], {
      queryParams: {types: url}
    }).then();
  }
}
