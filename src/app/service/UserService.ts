import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { RegisterDto, ResponseMessage } from '../profile/model';
import { environment } from '../../environement/environement';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {}

  getUserById(userId: number): Observable<ResponseMessage<RegisterDto>> {
    return this.http.get<RegisterDto>(`${this.apiUrl}/${userId}`).pipe(
      map((data: RegisterDto) => {
        return {
          status: 200,
          message: 'User retrieved successfully',
          data: data,
          meta: null
        };
      }),
      catchError(this.handleError)
    );
  }

  saveUser(formData: FormData, id: number | null, token: string): Observable<RegisterDto> {
    const saveUrl = `${this.apiUrl}/update`;
    
    // Ajout de l'ID à formData si nécessaire
    if (id !== null) {
      formData.append('id', id.toString());
    }
  
    // Logging formData content for debugging
    console.log('formData content before sending:', formData);
  
    // Création des headers avec le token
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    // Envoi de la requête POST avec les headers
    return this.http.post<RegisterDto>(saveUrl, formData, { headers }).pipe(
      catchError(this.handleError)
    );
  }
  
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}