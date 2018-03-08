import { HttpClient } from '@angular/common/http';
import {Injector} from '@angular/core';


export let HttpService: HttpClient;

export function setHttpClient(hc: HttpClient) {
    if (HttpService) {
    } else {
        HttpService = hc;
    }
}
