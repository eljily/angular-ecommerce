// RegisterDto pour les données d'inscription
export interface RegisterDto {
    name: string;
    email: string;
    password: string;
    phoneNumber: string;
  }
  
  // AuthRequestDto pour les données d'authentification
  export interface AuthRequestDto {
    email: string;
    password: string;
  }
  
  // OtpLoginDto pour les données de connexion avec OTP
  export interface OtpLoginDto {
    phoneNumber: string;
    otp: string;
  }
  
  // ResponseMessage pour la structure des messages de réponse du serveur
  export interface ResponseMessage {
    status: number;
    message?: string;
    data?: any;
  }
  
  // AuthResponseDto pour la structure des réponses d'authentification
  export interface AuthResponseDto {
    token: string;
    user: any; // Vous pouvez définir la structure de l'objet utilisateur ici
    // Ajoutez d'autres propriétés nécessaires à la réponse de l'authentification
  }
  