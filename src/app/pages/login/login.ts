import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})

export class LoginComponent {
  username = "";
  password = "";
  loginSuccess = false;
  loginError = false;
  clickedLogin = false;

  constructor(private router: Router){}

  // login puramente ficticio :P
  login(){
    this.clickedLogin = true;
    var clickedTs = Date.now()

    if (this.username == "caioba" && this.password == "12345") {
      this.loginSuccess = true;
      this.loginError = false;

        setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);
    } else {
      this.loginError = true;
      this.loginSuccess = false;

      console.log(Date.now() - clickedTs)
        
      setTimeout(() => {

        if (Date.now() - clickedTs >= 2){
          this.loginError = false;
        }
      }, 3000);
    }
  }
}
