import { Injectable } from '@angular/core';

declare var $: any;
@Injectable()
export class SemanticService {

  constructor() { }

  public initDropdown() {
    $('.ui.dropdown').dropdown();
  }
}
