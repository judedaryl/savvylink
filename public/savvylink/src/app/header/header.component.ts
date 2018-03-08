import { ProfileService } from './../profile.service';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './../auth/auth.service';
import { Router } from '@angular/router/';
import { Component, OnInit, AfterViewInit, Inject, ElementRef, ChangeDetectorRef } from '@angular/core';
import { CurrentUser } from '../models/currentuser';
import { config } from '../../../config/app';
import { UsersService } from '../users.service';
import { SemanticService } from '../semantic.service';

declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  user = CurrentUser;
  hasHeader_ = true;
  isLoggedIn_ = false;
  constructor(@Inject(ElementRef) private elementRef: ElementRef, @Inject(ChangeDetectorRef) private changeDetectorRef: ChangeDetectorRef,
    private router: Router, private userService: UsersService, private auth: AuthService, private semantic: SemanticService,
    private profile: ProfileService) {
    this.Subscriptions();
    if (this.auth.getToken !== null) { this.isLoggedIn = true; } else { this.isLoggedIn = false; }
  }
  ngOnInit() {
  }

  ngAfterViewInit() {
    // this.semantic.initDropdown();
    $('.user-options').dropdown();
    $('#mainheader')
      .on('click', '.item', function () {
        if (!$(this).hasClass('dropdown')) {
          $(this)
            .addClass('active')
            .siblings('.item')
            .removeClass('active');
        }
      });
    this.searchUsers();
    this.user = CurrentUser;
  }

  get live() { return JSON.stringify(this.user); }

  Subscriptions() {
    this.auth.WatchAuthenticated.subscribe(data => {
      this.isLoggedIn = data;
      // this.changeDetectorRef.detectChanges();
      const child = this.elementRef.nativeElement.querySelector('.ui.dropdown');
      const dropdown = $(child);
      dropdown.dropdown();

    });

    this.router.events.subscribe(event => {
      const s = event['url'] === '/login';
      this.hasHeader = !s;
      this.changeDetectorRef.detectChanges();
      const child = this.elementRef.nativeElement.querySelector('.user-options');
      const dropdown = $(child);
      dropdown.dropdown();
    });

    this.profile.profileData.subscribe( profile => {
      this.user = profile;
      console.log(this.user);
    });

  }

  signOut(): void {
    $('.transition').stop(true, true);
    this.auth.removeToken();
    $('.transition').stop(true, true);
  }
  get hasHeader(): boolean { return this.hasHeader_; }
  set hasHeader(value: boolean) {
    this.hasHeader_ = value;
  }

  get isLoggedIn(): boolean {
    return this.isLoggedIn_;
  }
  set isLoggedIn(value: boolean) {
    this.isLoggedIn_ = value;
  }

  searchUsers() {
    $('.user_search_header')
      .search({
        minCharacters: 3,
        apiSettings: {
          onResponse: function (apiresponse) {
            const response = {
              results: []
            };
            $.each(apiresponse.result, function (index, item) {
              const
                maxResults = 8
                ;

              if (index >= maxResults) {
                return false;
              }


              // add result to category
              response['results'].push({
                title: item.name,
                description: item.email,
                url: '/contributions/' + item.username,
              });
            });
            return response;
          },
          beforeXHR: (xhr) => {
            xhr.setRequestHeader('Authorization', 'Bearer ' + this.auth.getToken);
            return xhr;
          },
          url: config.findUserApi + '?query={query}'
        },
       /** onSelect: (result, response) => {
          this.router.navigateByUrl(result['routerLink']);
        }, */
      });
  }

}
