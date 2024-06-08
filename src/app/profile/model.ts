// RegisterDto pour les données d'inscription
export interface RegisterDto {

data:{
    id: number;
    name: string;
    firstName: string;
    lastName: string;
    address: string;
    birthDate: string;
    phoneNumber: string;
    password: string;
    email: string;
    profilePhoto: File;
    profileUrl: string | null;
    whatsAppNumber: string;
}
  }
  


  export interface ResponseMessage<T> {
    status: number;
    message?: string;
    data?: T;
    meta: any;
  }
  
  

  
  // AuthRequestDto pour les données d'authentification
  export interface AuthRequestDto {
    phoneNumber: string; 
    password: string;
  }
  
  // OtpLoginDto pour les données de connexion avec OTP
  export interface OtpLoginDto {
    phoneNumber: string;
    otp: string;
  }
  
  // ResponseMessage pour la structure des messages de réponse du serveur
  export interface ResponseMessage<T> {
    status: number;
    message?: string;
    data?: T;
  }
  // AuthResponseDto pour la structure des réponses d'authentification
  export interface AuthResponseDto {
    jwt: string;
    userId: number;
    
    decodedToken: {
      sub: string;
      userId: number;
      role: string;
      email: string;
      name: string;
      // Ajoutez d'autres propriétés du token si nécessaire
    };
  }