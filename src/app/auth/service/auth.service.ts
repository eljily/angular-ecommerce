import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { RegisterDto, AuthRequestDto, ResponseMessage, AuthResponseDto , } from '../../profile/model'; 
import { isPlatformBrowser } from '@angular/common';
import { JwtDecoderService } from './jwt.service';
import { UserService } from '../../profile/UserService';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private baseUrl = 'http://localhost:8081/api/auth';
  private currentUserSubject: BehaviorSubject<AuthResponseDto | null>;
  public currentUser: Observable<AuthResponseDto | null>;
  
  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object,
    private jwtDecoderService: JwtDecoderService,
    private userService: UserService
  ) {
    const currentUser = isPlatformBrowser(this.platformId) ? localStorage.getItem('currentUser') : null;
    this.currentUserSubject = new BehaviorSubject<AuthResponseDto | null>(currentUser ? JSON.parse(currentUser) : null);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  // Méthode pour récupérer les informations de l'utilisateur depuis le localStorage
  getCurrentUserFromLocalStorage(): AuthResponseDto | null {
    if (typeof localStorage !== 'undefined') {
        const currentUser = localStorage.getItem('currentUser');
        return currentUser ? JSON.parse(currentUser) : null;
    } else {
        return null; // Gérer le cas où localStorage n'est pas disponible
    }
}
  public get currentUserValue(): AuthResponseDto | null {
    return this.currentUserSubject.value;
  }



  signup(registerDto: RegisterDto): Observable<ResponseMessage<AuthResponseDto>> {
    return this.http.post<ResponseMessage<AuthResponseDto>>('http://localhost:8081/api/auth/signup', registerDto)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Unknown error occurred';
          if (error.error instanceof ErrorEvent) {
            errorMessage = `Error: ${error.error.message}`;
          } else {
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
        const decodedToken = this.jwtDecoderService.decodeToken(response.jwt);
        const currentUser: AuthResponseDto & { user?: RegisterDto } = { ...response, user: undefined };
        currentUser.decodedToken = decodedToken;
  
        if (isPlatformBrowser(this.platformId)) {
          this.storeAuthData(response.jwt, response.userId);
        }
  
        this.userService.getUserById(response.userId).subscribe(
          (userDetailsResponse: ResponseMessage<RegisterDto>) => {
            const userDetails = userDetailsResponse.data; // Extract the RegisterDto from the response
            if (userDetails) {
              currentUser.user = userDetails;
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
  

  private storeAuthData(jwt: string, userId: number): void {
    localStorage.setItem('currentUser', JSON.stringify({ jwt, userId }));
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('currentUser');
    }
    this.currentUserSubject.next(null);
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
