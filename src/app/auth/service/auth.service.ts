import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, switchMap, tap } from 'rxjs/operators';
import { RegisterDto, AuthRequestDto, ResponseMessage, AuthResponseDto , } from '../../profile/model'; 
import { isPlatformBrowser } from '@angular/common';
import { JwtDecoderService } from './jwt.service';
import { UserService } from '../../profile/UserService';
import { environment } from '../../../environement/environement';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl + '/auth';
  private currentUserSubject: BehaviorSubject<AuthResponseDto | null>;
  public currentUser: Observable<AuthResponseDto | null>;
  private redirectUrl: string | null = null;
  private isconnected: boolean = false;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private jwtDecoderService: JwtDecoderService,
    private userService: UserService
  ) {
    const currentUser = isPlatformBrowser(this.platformId) ? localStorage.getItem('currentUser') : null;
    this.currentUserSubject = new BehaviorSubject<AuthResponseDto | null>(currentUser ? JSON.parse(currentUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
    this.isconnected = !!currentUser;   //
  }

  isAuthenticated(): boolean {
    return this.isconnected;
  }

  setAuthenticated(): void {
    this.isconnected = true;
  }

  setRedirectUrl(redirectUrl: string): void {
    this.redirectUrl = redirectUrl;
    console.log('URL de redirection stockée dans AuthService:', this.redirectUrl);
  }

  getRedirectUrl(): string | null {
    console.log('URL récupérée du service AuthService:', this.redirectUrl);
    return this.redirectUrl;
  }

  clearRedirectUrl(): void {
    this.redirectUrl = null;
  }

  isTokenAvailable(): boolean {
    const token = localStorage.getItem('token');
    console.log('Token in isTokenAvailable:', token);
    return !!token;
  }

  getToken(): string | null {
    const token = localStorage.getItem('token');
    console.log('Token in getToken:', token);
    return token;
  }

  getCurrentUserFromLocalStorage(): AuthResponseDto | null {
    if (typeof localStorage !== 'undefined') {
      const currentUser = localStorage.getItem('currentUser');
      return currentUser ? JSON.parse(currentUser) : null;
    } else {
      return null;
    }
  }

  public get currentUserValue(): AuthResponseDto | null {
    return this.currentUserSubject.value;
  }

  signup(registerDto: RegisterDto): Observable<ResponseMessage<AuthResponseDto>> {
    return this.http.post<ResponseMessage<AuthResponseDto>>(`${this.apiUrl}/signup`, registerDto)
      .pipe(
        catchError(this.handleError)
      );
  }

  login(authRequestDto: AuthRequestDto): Observable<AuthResponseDto> {
    return this.http.post<AuthResponseDto>(`${this.apiUrl}/login`, authRequestDto).pipe(
      tap((response: AuthResponseDto) => {
        const decodedToken = this.jwtDecoderService.decodeToken(response.jwt);
        const currentUser: AuthResponseDto = { ...response, decodedToken };

        console.log('Connexion réussie', response);
        console.log('Informations décodées du JWT:', decodedToken);

        if (isPlatformBrowser(this.platformId)) {
          this.storeAuthData(currentUser);
        }

        this.userService.getUserById(response.userId).subscribe(
          (userDetailsResponse: ResponseMessage<RegisterDto>) => {
            const userDetails = userDetailsResponse.data;
            if (userDetails) {
              currentUser.decodedToken.name = userDetails.data.name;
              this.isconnected = true;
              this.currentUserSubject.next(currentUser);
            } else {
              console.error('Détails de l\'utilisateur introuvables dans la réponse.');
            }
          },
          (error: any) => {
            console.error('Erreur lors de la récupération des détails de l\'utilisateur:', error);
          }
        );
      }),
      catchError(this.handleError)
    );
  }

  private storeAuthData(authResponse: AuthResponseDto): void {
    console.log('Storing token:', authResponse.jwt);
    localStorage.setItem('token', authResponse.jwt);
    localStorage.setItem('currentUser', JSON.stringify(authResponse));
    this.isconnected = true;  // Mise à jour de l'état de connexion
  }


  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
  }


  verifyCurrentPassword(currentPassword: string): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return throwError('Token not found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      currentPassword: currentPassword
    };

    return this.http.post<any>(`${this.apiUrl}/verify-current-password`, body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Erreur lors de la vérification du mot de passe actuel', error);
          let errorMsg = 'Une erreur est survenue lors de la vérification du mot de passe actuel';
          if (error.status === 401) {
            errorMsg = 'Mot de passe actuel incorrect.';
          }
          return throwError(errorMsg);
        })
      );
  }

  // Méthode pour changer le mot de passe
  changePassword(currentPassword: string, newPassword: string, retypedPassword: string): Observable<any> {
    // Effectuer directement la demande de changement de mot de passe
    const token = this.getToken();
    if (!token) {
      return throwError('Token not found');
    }
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      oldPassword: currentPassword,
      newPassword: newPassword,
      retypedPassword: retypedPassword
    };
  
    return this.http.post(`${this.apiUrl}/change-password`, body, { headers })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Erreur lors du changement de mot de passe', error);
          let errorMsg = 'Une erreur est survenue lors du changement de mot de passe';
          if (error.status === 400) {
            errorMsg = 'Mot de passe actuel incorrect';
          } else if (error.status === 401) {
            errorMsg = 'Requête invalide. Vérifiez les données fournies.';
          } else if (error.status === 500) {
            errorMsg = 'Erreur serveur. Réessayez plus tard.';
          }
          return throwError(errorMsg);
        })
      );
  }
  


  private handleError(error: HttpErrorResponse): Observable<any> {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if (error.status === 401 || error.status === 403) {
      errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}