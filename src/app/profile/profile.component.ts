import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth/service/auth.service';
import { RegisterDto, ResponseMessage } from './model';
import { UserService } from './UserService';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [  FormsModule ,CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  user: RegisterDto | null = null;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user && user.userId) {
        this.userService.getUserById(user.userId).subscribe((response: ResponseMessage<RegisterDto>) => {
          if (response && response.data) {
            this.user = response.data;
            console.log('Détails de l\'utilisateur :', this.user);
          } else {
            console.error('Erreur lors de la récupération des détails de l\'utilisateur : Données manquantes dans la réponse.');
          }
        });
      }
    });
  }
  
  

  updateUserName(event: any): void {
    if (event && event.target && event.target.value && this.user) {
      this.user!.data.name = event.target.value; // Mettez à jour le nom de l'utilisateur
    }
  }
  
  
  
  updateFirstName(event: any): void {
    if (event && event.target && event.target.value) {
      this.user!.data.firstName = event.target.value;
    }
  }
  
  updateLastName(event: any): void {
    if (event && event.target && event.target.value) {
      this.user!.data.lastName = event.target.value;
    }
  }
  
  updateLocation(event: any): void {
    if (event && event.target && event.target.value) {
      this.user!.data.address = event.target.value;
    }
  }
  
  updateEmailAddress(event: any): void {
    if (event && event.target && event.target.value) {
      this.user!.data.email = event.target.value;
    }
  }
  
  updatePhoneNumber(event: any): void {
    if (event && event.target && event.target.value) {
      this.user!.data.phoneNumber = event.target.value;
    }
  }
  
  updateBirthDate(event: any): void {
    if (event && event.target && event.target.value) {
      this.user!.data.birthDate = new Date(event.target.value);
    }
  }
  

  saveChanges(): void {
    if (this.user) {
      this.userService.saveUser(this.user).subscribe(
        (response: any) => {
          console.log('Les détails de l\'utilisateur ont été mis à jour avec succès.', response);
        },
        (error: any) => {
          console.error('Une erreur s\'est produite lors de la mise à jour des détails de l\'utilisateur.', error);
        }
      );
    }
  }
}
