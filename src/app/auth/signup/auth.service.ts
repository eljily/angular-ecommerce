import { Injectable } from '@angular/core';
import { HttpClient , HttpErrorResponse } from '@angular/common/http';
import { Observable ,throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { RegisterDto, AuthRequestDto, OtpLoginDto, ResponseMessage, AuthResponseDto } from '../models'; // Assurez-vous d'avoir des modèles appropriés pour les données envoyées et reçues depuis le backend

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8081/api/auth'; // Assurez-vous que l'URL correspond à celle de votre backend

  constructor(private http: HttpClient) { }

  signup(registerDto: RegisterDto): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${this.baseUrl}/signup`, registerDto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Unknown error occurred';
          if (error.error instanceof ErrorEvent) {
            // Erreur côté client
            errorMessage = `Error: ${error.error.message}`;
          } else {
            // Erreur côté serveur
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
          }
          console.error(errorMessage);
          return throwError(errorMessage);
        })
      );
  }

  login(authRequestDto: AuthRequestDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.baseUrl}/login`, authRequestDto);
  }

  verifyOTP(otpLogin: OtpLoginDto): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${this.baseUrl}/verify-otp`, otpLogin);
  }

  resendOTP(phoneNumber: string): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${this.baseUrl}/send-otp?phoneNumber=${phoneNumber}`, {});
  }
}
