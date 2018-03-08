import { CurrentUser } from './../models/currentuser';
import {
  ActivatedRoute, RouterEvent, Router, NavigationStart,
  NavigationEnd, NavigationCancel, NavigationError,
  RoutesRecognized, GuardsCheckStart, ChildActivationStart,
  ActivationStart, GuardsCheckEnd, ResolveStart, ResolveEnd,
  ActivationEnd
} from '@angular/router/';
import { fadeAnimation } from './../animations/fade.animation';
import { Component, OnInit } from '@angular/core';


declare var $: any;
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css'],
  animations: [fadeAnimation]
})
export class MainPageComponent implements OnInit {
  user = CurrentUser;
  content: Object;
  progress_start = false;
  constructor(private route: ActivatedRoute, private router: Router) {
    router.events.subscribe((event: RouterEvent) => {
      $('.pjax-loader-bar .progress').css('width', '0');
      this.progressInterceptor(event);
      this.navigationInterceptor(event);
    });
  }

  progressInterceptor(event: RouterEvent): void {
    const pdiv = $('.pjax-loader-bar');
    const progress = $('.pjax-loader-bar .progress');
    let pnum = 0;

    progress.css('transition', '');
    progress.css('width', '0%');
    if (event instanceof NavigationStart) {
      pdiv.addClass('is-loading');
      progress.css('transition', 'transition: width 0.4s ease 0s;');
      this.progress_start = true;
      pnum = 0;
    }
    if (this.progress_start) {
      if (event instanceof RoutesRecognized) {
        pnum = 12.5;
      }
      if (event instanceof GuardsCheckStart) {
        pnum = 25;
      }
      if (event instanceof ChildActivationStart) {
        pnum = 37.5;
      }
      if (event instanceof ActivationStart) {
        pnum = 50;
      }
      if (event instanceof GuardsCheckEnd) {
        pnum = 62.5;
      }
      if (event instanceof ResolveStart) {
        pnum = 75;
      }
      if (event instanceof ActivationEnd) {
        pnum = 87.5;
      }
    }
    progress.css('width', pnum + '%');

    if (event instanceof NavigationEnd) {

      pdiv.removeClass('is-loading');
      this.progress_start = false;
      progress.css('width', '100%').delay(600)
        .queue(function (nxt) {
          progress.css('width', '0%');
          nxt();
        });
    }
  }

  // Shows and hides the loading spinner during RouterEvent changes
  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      $('.main-loader').addClass('active');
    }
    if (event instanceof NavigationEnd) {
      $('.main-loader').removeClass('active');
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      $('.main-loader').removeClass('active');
    }
    if (event instanceof NavigationError) {
      $('.main-loader').removeClass('active');
    }
  }

  ngOnInit() {
    this.content = this.route.snapshot.data.content;
    if (this.content !== null) {
      this.user['id'] = this.content['id'];
      this.user['displayname'] = this.content['name'];
      this.user['photo'] = this.content['photo'];
      this.user['email'] = this.content['email'];
      this.user['username'] = this.content['username'];
    }
  }

  public getRouterOutletState(outlet) {
    return outlet.isActivated ? outlet.activatedRoute : '';
  }
}
