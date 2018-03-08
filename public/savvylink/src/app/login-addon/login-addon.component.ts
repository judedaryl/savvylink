import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { ProfileService } from './../profile.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { User } from '../models/user';
import { AuthService } from '../auth/auth.service';
import { config } from '../../../config/app';
import { LoginResponse } from './models/response';
import { CurrentUser } from '../models/currentuser';

declare var $: any;
@Component({
  selector: 'app-login-addon',
  templateUrl: './login-addon.component.html',
  styleUrls: ['./login-addon.component.css']
})
export class LoginAddonComponent implements OnInit {
  user = CurrentUser;
  loginForm: FormGroup;
  response = LoginResponse;
  test = 'asdasd';
  ngOnInit() {
  }


  constructor(public profile: ProfileService, public auth: AuthService,
    private builder: FormBuilder, private router: Router, private route: ActivatedRoute) {
    this.route.params.subscribe(params => {
      if (params['status']) {

      }
    });
    this.generateForm();
  }

  generateForm() {
    this.loginForm = this.builder.group({
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async onSubmit() {
    this.response['HasError'] = false;
    $('#email').removeClass('ng-invalid');
    $('.ui.form').addClass('loading');
    const user = new User(this.loginForm.value);
    this.observeResponse(user.login());
  }


  observeResponse(obs) {
    obs.subscribe(
      data => {
        this.handleResponse(data);
      },
      err => {
        if (err.status === 400) {
          this.handleResponse(err.error);
        }
      }
    );
  }

  handleResponse(param) {
    $('.ui.form').removeClass('loading');
    if (param !== null) {
      if (param['status'] === 'bad') {
        this.response['Error'] = param['data'];
        this.response['HasError'] = true;
        $('#email').addClass('ng-invalid');
      }
      if (param['status'] === 'ok') {
        this.response['mess'] = 'User logged in';
        this.response['HasError'] = false;
        this.auth.saveToken(param['data']);
        this.profile.profile().subscribe(data => {
          this.user['id'] = data['id'];
          this.user['displayname'] = data['displayname'];
          this.user['photo'] = data['photo'];
          this.user['email'] = data['email'];
          this.user['username'] = data['username'];
          const userobject: Object = {
            displayname: data['name'],
            email: data['email'],
            photo: data['photo'],
            username: data['username'],
            id: data['id']
          };

          this.profile.profileData = userobject;
        });

        this.router.navigateByUrl('/organizations');
      }
    }
  }



}
