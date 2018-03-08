import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class ArraySortPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    return Object.keys(value).map(key => ({ key, value: value[key] }))
      .sort((a, b) => a.key.localeCompare(b.key));
  }

}
