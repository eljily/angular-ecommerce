import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../service/auth.service';
import { RegisterDto, ResponseMessage } from './model';
import { UserService } from '../service/UserService';
import { TranslateMessageFormatDebugCompiler } from 'ngx-translate-messageformat-compiler';
import { TranslateModule } from '@ngx-translate/core';



@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [  FormsModule ,CommonModule,TranslateModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})

export class ProfileComponent implements OnInit {
  user: RegisterDto | null = null;
  token: string | null = null;
  userProfilePhoto: string = 'http://bootdey.com/img/Content/avatar/avatar1.png';
  selectedProfilePhoto: File | null = null;

  constructor(private authService: AuthService, private userService: UserService) {}

  ngOnInit(): void {
    this.authService.currentUser.subscribe(user => {
      if (user && user.userId) {
        this.userService.getUserById(user.userId).subscribe((response: ResponseMessage<RegisterDto>) => {
          if (response && response.data) {
            this.user = response.data;
            this.updateUserProfilePhoto();
            this.formatBirthDate();
            console.log('Détails de l\'utilisateur reçus :', this.user);
          } else {
            console.error('Erreur lors de la récupération des détails de l\'utilisateur : Données manquantes dans la réponse.');
          }
        });
      }
    });

    // Récupérez le token d'authentification du service d'authentification
    this.token = this.authService.getToken();
    console.log('Token in ngOnInit:', this.token);
  }


  formatBirthDate(): void {
    if (this.user && this.user.data.birthDate) {
      const birthDate = new Date(this.user.data.birthDate);
      const year = birthDate.getFullYear();
      const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
      const day = birthDate.getDate().toString().padStart(2, '0');
      this.user.data.birthDate = `${year}-${month}-${day}`;
    }
  }


  updateUserProfilePhoto(): void {
    if (this.user && this.user.data.profileUrl) {
      this.userProfilePhoto = this.user.data.profileUrl; // Utilisez le champ approprié pour l'URL de l'image de profil
    } else {
      this.userProfilePhoto = 'http://bootdey.com/img/Content/avatar/avatar1.png';
    }
  }

  saveChanges(): void {
    // Assurez-vous que vous avez le token et l'utilisateur avant de continuer
    if (this.token && this.user) {
      const formData = new FormData();

      // Log user details
      console.log('ID is:', this.user.data.id);
      console.log('Name is:', this.user.data.name);
      console.log('Email is:', this.user.data.email);
      console.log('Phone Number is:', this.user.data.phoneNumber);
      console.log('Birth Date is:', this.user.data.birthDate);

      let birthDateFormatted = '';
      if (this.user.data.birthDate) {
        const birthDate = new Date(this.user.data.birthDate);
        const month = (birthDate.getMonth() + 1).toString().padStart(2, '0');
        const day = birthDate.getDate().toString().padStart(2, '0');
        const year = birthDate.getFullYear();
        birthDateFormatted = `${month}/${day}/${year}`;
        console.log('Birth Date is:', birthDateFormatted);
      }


      // Check and add user ID to FormData
      if (this.user.data.id) {
        formData.append('userId', this.user.data.id.toString());
      } else {
        console.log('User ID is missing.');
        return; // Exit method if ID is missing
      }

      // Check and add user name to FormData
      if (this.user.data.name) {
        formData.append('name', this.user.data.name);
      } else {
        console.log('User name is missing.');
        return; // Exit method if name is missing
      }

      // Check and add user email to FormData
      if (this.user.data.email) {
        formData.append('email', this.user.data.email);
      } else {
        console.log('User email is missing.');
        return; // Exit method if email is missing
      }

      // Check and add user phone number to FormData
      if (this.user.data.phoneNumber) {
        formData.append('phoneNumber', this.user.data.phoneNumber);
      } else {
        console.log('User phone number is missing.');
        return; // Exit method if phone number is missing
      }

      // Check and add other fields if necessary
      if (this.user.data.firstName) {
        formData.append('firstName', this.user.data.firstName);
      }
      if (this.user.data.lastName) {
        formData.append('lastName', this.user.data.lastName);
      }
      if (this.user.data.address) {
        formData.append('address', this.user.data.address);
      }
      if (birthDateFormatted) {
        formData.append('birthDate', birthDateFormatted);
        console.log('Adding birthDate to formData:', birthDateFormatted);
      }
      if (this.selectedProfilePhoto) {
        formData.append('profilePhoto', this.selectedProfilePhoto);
      }
      if (this.user.data.profileUrl) {
        formData.append('profileUrl', this.user.data.profileUrl);
      }
      if (this.user.data.whatsAppNumber) {
        formData.append('whatsAppNumber', this.user.data.whatsAppNumber);
      }

      // Save user changes by calling the UserService service
      this.userService.saveUser(formData, this.user.data.id, this.token).subscribe(
        (response: any) => {
          console.log('User details updated successfully.', response);
          if (this.selectedProfilePhoto) {
            // Mettre à jour l'image de profil uniquement si une nouvelle image a été téléchargée
            this.userProfilePhoto = URL.createObjectURL(this.selectedProfilePhoto);
            this.selectedProfilePhoto = null;
          }
          // Implement additional logic after successful save if needed
        },
        (error: any) => {
          console.log('An error occurred while updating user details.', error);
          // Implement logic to handle errors if needed
        }
      );
    } else {
      console.log('Unable to update user details: token or user is missing.');
    }
  }

  onProfilePhotoChange(event: any) {
    const file = event.target.files[0];
    // Récupérer le fichier sélectionné
    // Vérifier si un fichier a été sélectionné
    if (file) { 
      // Mettre à jour la variable userProfilePhoto avec l'URL de l'image sélectionnée
      const reader = new FileReader(); 
      reader.readAsDataURL(file); 
      reader.onload = () => { 
        this.userProfilePhoto = reader.result as string; 
      };
      this.selectedProfilePhoto = file;
    } else { 
      // Utiliser l'image par défaut si aucun fichier n'a été sélectionné
      this.userProfilePhoto = 'http://bootdey.com/img/Content/avatar/avatar1.png'; 
      this.selectedProfilePhoto = null;
    } 
  }
}
