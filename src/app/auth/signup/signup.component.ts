import { Component,OnInit } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { AuthService } from './auth.service';
import { RegisterDto } from '../models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HeaderComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup; 

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    // Initialisez le formulaire avec FormBuilder
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phone: ['', Validators.required] // Ajoutez le champ de numéro de téléphone au formulaire
    });
    console.log("Form initialized successfully!");
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      console.log("Form is not valid. Cannot submit.");
      return; // Arrêtez l'exécution de la fonction si le formulaire n'est pas valide
    }
  
    // Si le formulaire est valide, continuez avec la soumission
    const formData: RegisterDto = {
      name: this.registerForm.value.name,
      email: this.registerForm.value.email,
      password: this.registerForm.value.password,
      phoneNumber: this.registerForm.value.phone // Ajoutez le numéro de téléphone à formData
    };
    console.log("Form is valid. Submitting...");
  
    this.authService.signup(formData).subscribe(
      response => {
        console.log('Inscription réussie', response);
        alert("Account Created!");
        // Gérez la réponse de réussite ici, par exemple : rediriger l'utilisateur vers une page de connexion
      },
      error => {
        console.error('Erreur lors de inscription', error);
        // Gérez l'erreur ici, par exemple : afficher un message d'erreur à l'utilisateur
      }
    );
  }
}