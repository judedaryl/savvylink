import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router } from '@angular/router/';
import { UserdataService } from './../../services/userdata.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './../../services/authentication.service';
import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
declare var $: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {

  constructor(private auth: AuthenticationService, private route: ActivatedRoute, private userData: UserdataService,
    private router: Router) { }

  ngOnInit() {
    if (this.route.snapshot.data.content === undefined) {
      this.router.navigateByUrl('/login');
    } else {
      this.userData.setData(this.route.snapshot.data.content);
    }
  }

  ngAfterViewInit() {
    this.searchUsers();
  }

  logoutmodal() {
    $('.logout_modal').modal('show');
  }

  logout() {
    this.auth.logout();
  }

  get authenticated() {
    return this.auth.isAuthenticated;
  }

  get name() {
    return this.userData.name;
  }

  get username() {
    return this.userData.username;
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
                routerLink: '/contributions/' + item.username,
                // url: '/contributions/' + item.username,
              });
            });
            return response;
          },
          beforeXHR: (xhr) => {
            xhr.setRequestHeader('Authorization', 'Bearer ' + this.auth.getToken);
            return xhr;
          },
          url: environment.findUserApi + '?query={query}'
        },
        onSelect: (result, response) => {
          this.router.navigateByUrl(result['routerLink']);
        },
      });
  }

}
