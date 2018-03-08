import { trigger, animate, transition, style, query, state } from '@angular/animations';

export const fadeAnimation =

    trigger('fadeAnimation', [
        transition(':enter', [style({ opacity: 0 }), animate('0.4s ease', style({ opacity: 1 }))]),
        transition(':leave', [style({ opacity: 1 }), animate('0.4s ease', style({ opacity: 0 }))])

    ]);

    /*
    trigger('fadeInAnimation', [
 
        // route 'enter' transition
        transition(':enter', [
 
            // css styles at start of transition
            style({ opacity: 0 }),
 
            // animation and styles at end of transition
            animate('.3s', style({ opacity: 1 }))
        ]),
    ]);
    */