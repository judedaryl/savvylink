import { AuthService } from './../auth/auth.service';
import { RegisterResponse } from './models/response';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router/';
import { User } from '../models/user';
import { config } from '../../../config/app';
import { UsersService } from '../users.service';
import { HttpClient } from '@angular/common/http';
declare var $: any;
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})

export class RegisterComponent implements OnInit {
  response = RegisterResponse;
  user = User;
  registrationForm: FormGroup;

  ngOnInit() {

  }
  constructor(private builder: FormBuilder, public router: Router, private http: HttpClient,
    private auth: AuthService, private userService: UsersService) {
    this.generateForm();
  }

  generateForm() {
    this.registrationForm = this.builder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      password: ['', [Validators.minLength(5), Validators.required]],
    });
    let count = 0;
    this.registrationForm.get('email').valueChanges.subscribe(value => {
      // this.response['EmailUsed'] = true;
      if (value.length >= 4) {
        count = count + 1;
        $('.login-email').addClass('loading');
        this.http.get(config.checkEmailApi + '?email=' + value).subscribe(resp => {
          count--;
          if (count === 0) {
            console.log(count);
            $('.login-email').removeClass('loading');
            $('.email-icon').removeClass('remove red check green open envelope outline');
            if (!resp['success']) {
              $('.email-icon').addClass('check green');
            } else {
              $('.email-icon').addClass('remove red');
            }
            this.response['EmailUsed'] = resp['success'];
          }
        });
      } else {
        $('.login-email').removeClass('loading');
        this.response['EmailUsed'] = false;
      }
    });

    this.registrationForm.get('username').valueChanges.subscribe(value => {
      // this.response['UsernameUsed'] = true;
      console.log(value);
      if (value.length >= 4) {
        count = count + 1;
        $('.login-username').addClass('loading');
        this.http.get(config.checkUsernameApi + '?uname=' + value).subscribe(resp => {
          count--;
          if (count === 0) {
            $('.login-username').removeClass('loading');
            $('.username-icon').removeClass('remove red check green user outline');
            if (!resp['success']) {
              $('.username-icon').addClass('check green');
            } else {
              $('.username-icon').addClass('remove red');
            }
            this.response['UsernameUsed'] = resp['success'];
          }
        });
      } else {
        $('.login-username').removeClass('loading');
        this.response['UsernameUsed'] = false;
      }
    });
  }

  async onSubmit() {
    this.response['HasError'] = false;
    $('#email').removeClass('ng-invalid');
    $('.ui.form').addClass('loading');
    const user = new User(this.registrationForm.value);
    this.observeResponse(user.register());
  }


  observeResponse(obs) {
    console.log(obs);
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
      if (param['error']) {
        this.response['Error'] = param['error'];
        this.response['HasError'] = true;
        $('#email').addClass('ng-invalid');
      }
      if (param['success'] === true) {
        this.response['mess'] = 'Registration success';
        this.response['HasError'] = false;
        this.login();
      }
    }
  }

  login() {
    this.response['HasError'] = false;
    $('#email').removeClass('ng-invalid');
    $('.ui.form').addClass('loading');
    const user = new User(this.registrationForm.value);
    this.observeResponseL(user.login());
  }


  observeResponseL(obs) {
    obs.subscribe(
      data => {
        this.handleResponseL(data);
      },
      err => {
        if (err.status === 400) {
          this.handleResponseL(err.error);
        }
      }
    );
  }

  handleResponseL(param) {
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
        window.location.href = '/';
        this.auth.saveToken(param['data']);

      }
    }
  }

  get livedata() { return JSON.stringify(this.registrationForm.value); }
  get linkedin() { return config.linkedin; }
  get disablebutton() { return this.registrationForm.valid && !this.response['EmailUsed'] && !this.response['UsernameUsed']; }
}

