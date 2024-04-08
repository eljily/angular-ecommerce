import { Component,OnInit } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { AuthService } from '../service/auth.service';
import { RegisterDto } from '../../profile/model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HeaderComponent,FormsModule,ReactiveFormsModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup; 

  constructor(private formBuilder: FormBuilder, private authService: AuthService,private router: Router) {}

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
    console.log('Form submitted.'); // Ajoutez ce log pour vérifier si la méthode onSubmit est appelée
    if (this.registerForm.invalid) {
      console.log("Form is not valid. Cannot submit.");
      return; // Arrêtez l'exécution de la fonction si le formulaire n'est pas valide
    }
  
    // Si le formulaire est valide, continuez avec la soumission
    const formData = this.registerForm.value;
    const registerData: RegisterDto = {
      data: {
        id: 0, // Vous devez peut-être générer l'ID autrement
        name: formData.name,
        firstName: formData.firstName,
        lastName: formData.lastName,
        address: formData.address,
        birthDate: formData.birthDate,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        email: formData.email,
        profilePhoto: formData.profilePhoto,
        profileUrl: formData.profileUrl
      }
    };
    
   // console.log("Form data:", formData); // Ajoutez ce log pour vérifier les données envoyées au service
  
    console.log("Form is valid. Submitting...");
  
    this.authService.signup(formData).subscribe(
      response => {
        console.log('Signup response:', response); // Ajoutez ce log pour vérifier la réponse du service
        alert("Account Created!");
        // Gérez la réponse de réussite ici, par exemple : rediriger l'utilisateur vers une page de connexion
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Erreur lors de l\'inscription', error);
        // Gérez l'erreur ici, par exemple : afficher un message d'erreur à l'utilisateur
      }
    );
  }
}