import { Component,OnInit } from '@angular/core';
import { HeaderComponent } from '../../layouts/header/header.component';
import { AuthService } from '../../service/auth.service';
import { RegisterDto } from '../../profile/model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [HeaderComponent,FormsModule,ReactiveFormsModule,CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit {
  registerForm!: FormGroup; 
  errorMessage: string = '';


  constructor(private formBuilder: FormBuilder, private authService: AuthService,private router: Router, private toastr: ToastrService) {}

  ngOnInit(): void {
    // Initialisez le formulaire avec FormBuilder
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required] // Ajoutez le champ de numéro de téléphone au formulaire
    });
    console.log("Form initialized successfully!");
  }

  onSubmit(): void {
    console.log('Form submitted.'); 
    if (this.registerForm.invalid) {
      console.log("Form is not valid. Cannot submit.");
      this.errorMessage = "Veuillez remplir tous les champs correctement.";
      this.showErrorToast("l\'un des champs n\'est pas rempli ")
      return;
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
        this.showSuccessToast("Compte créé avec succes");
        // Gérez la réponse de réussite ici, par exemple : rediriger l'utilisateur vers une page de connexion
        this.router.navigate(['/login']);
      },
      error => {
        console.error('Erreur lors de l\'inscription', error);
        this.showErrorToast("Erreur lors de l\'inscription")
        // Gérez l'erreur ici, par exemple : afficher un message d'erreur à l'utilisateur
      }
    );
  }


  showSuccessToast(message: string) {
    this.toastr.success(message, 'Succès');
  }

  showErrorToast(message: string) {
    this.toastr.error(message, 'Erreur');
  }
}