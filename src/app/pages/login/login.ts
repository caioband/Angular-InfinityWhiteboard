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
  clickedTs = Date.now()
  
  constructor(private router: Router){}

  // login puramente ficticio :P
  login(){
    this.clickedLogin = true;

    if (this.username == "caioba" && this.password == "12345") {
      this.loginSuccess = true;
      this.loginError = false;

        setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 1000);
    } else {
      this.loginError = true;
      this.loginSuccess = false;

      console.log(Date.now() - this.clickedTs)

      setTimeout(() => {
        if (Date.now() - this.clickedTs > 200){
          this.loginError = false;
        }else{
          return
        }
      }, 3000);
      this.clickedTs = Date.now()
    }
  }
}
