import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RegisterDto, AuthRequestDto, OtpLoginDto, ResponseMessage, AuthResponseDto } from './models'; 
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth';
  private currentUserSubject: BehaviorSubject<AuthResponseDto | null>;
  public currentUser: Observable<AuthResponseDto | null>;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    const currentUser = isPlatformBrowser(this.platformId) ? localStorage.getItem('currentUser') : null;
    this.currentUserSubject = new BehaviorSubject<AuthResponseDto | null>(currentUser ? JSON.parse(currentUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): AuthResponseDto | null {
    return this.currentUserSubject.value;
  }
  
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
    return this.http.post<AuthResponseDto>(`${this.baseUrl}/login`, authRequestDto).pipe(
      tap((response: AuthResponseDto) => {
        console.log('Type de jwt:', typeof response.jwt);
        console.log('Type de userId:', typeof response.userId);
        console.log('Nom de l\'utilisateur:', response.name);
        if (isPlatformBrowser(this.platformId)) {
          this.storeAuthData(response.jwt, response.userId); // Stocker le jeton JWT et l'ID de l'utilisateur
        }
        this.currentUserSubject.next(response);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          console.error('Mauvaises informations d\'identification');
          return throwError('Mauvaises informations d\'identification');
        }
        return throwError('Erreur lors de la tentative de connexion');
      })
    );
  }
  

  storeAuthData(jwt: string, userId: number): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('currentUser', JSON.stringify({ jwt, userId }));
    }
  }

  
  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }
  
  verifyOTP(otpLogin: OtpLoginDto): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${this.baseUrl}/verify-otp`, otpLogin).pipe(
      catchError(this.handleError)
    );
  }

  resendOTP(phoneNumber: string): Observable<ResponseMessage> {
    return this.http.post<ResponseMessage>(`${this.baseUrl}/send-otp?phoneNumber=${phoneNumber}`, {}).pipe(
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 401 || error.status === 403) {
      // Erreur d'authentification
      errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
    } else {
      // Autre erreur côté serveur
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }

}
