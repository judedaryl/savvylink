import { LoginResponse } from './../login-addon/models/response';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AfterViewInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { User } from '../models/user';
import { AuthService } from '../auth/auth.service';
import { config } from '../../../config/app';


declare var $: any;
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  response = LoginResponse;
  returnURL: string;
  test = 'asdasd';
  ngOnInit() {
    console.log(this.route);
    this.returnURL = this.route.snapshot.queryParams['returnURL'] || '/';
  }


  constructor(public auth: AuthService, private builder: FormBuilder, private router: Router, private route: ActivatedRoute) {
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
        window.location.href = this.returnURL;
        this.auth.saveToken(param['data']);
      }
    }
  }

  get livedata() { return JSON.stringify(this.loginForm.value); }
  get linkedin() { return config.linkedin; }

}
