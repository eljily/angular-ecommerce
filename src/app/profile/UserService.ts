import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RegisterDto, ResponseMessage } from './model';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = 'http://localhost:8081/api/users';

  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<ResponseMessage<RegisterDto>> {
    return this.http.get<RegisterDto>(`${this.baseUrl}/${userId}`).pipe(
      map((data: RegisterDto) => {
        return {
          status: 200,
          message: 'User retrieved successfully',
          data: data,
          meta: null
        };
      }),


      

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
  

  saveUser(user: RegisterDto): Observable<ResponseMessage<any>> {
    if (user.data.id) {
      // Si l'identifiant de l'utilisateur est défini, envoyez une requête de mise à jour
      return this.http.put<ResponseMessage<any>>(`http://localhost:8081/api/${user.data.id}`, user)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            // Gérez l'erreur ici, par exemple en affichant un message d'erreur à l'utilisateur
            console.error('Une erreur s\'est produite lors de la mise à jour de l\'utilisateur :', error);
            return throwError('Erreur lors de la mise à jour de l\'utilisateur. Veuillez réessayer.');
          })
        );
    } else {
      // Sinon, envoyez une requête d'ajout
      return this.http.post<ResponseMessage<any>>('http://localhost:8081/api/users', user)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            // Gérez l'erreur ici, par exemple en affichant un message d'erreur à l'utilisateur
            console.error('Une erreur s\'est produite lors de l\'ajout de l\'utilisateur :', error);
            return throwError('Erreur lors de l\'ajout de l\'utilisateur. Veuillez réessayer.');
          })
        );
    }
  
  }
}
