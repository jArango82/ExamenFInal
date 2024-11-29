import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError } from 'rxjs';

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    nombre: string;
    apellido: string;
    email: string;
    rol: boolean;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api';
  private tokenKey = 'auth_token';
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();
  private loggedInUserId: string | null = null;

  constructor(private http: HttpClient) {
    this.checkToken();
  }

  private checkToken() {
    const token = localStorage.getItem(this.tokenKey);
    if (token) {
      try {
        const payload = this.decodeToken(token);
        this.userSubject.next(payload.user);
      } catch (error) {
        this.logout();
      }
    }
  }

  private decodeToken(token: string): any {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      return JSON.parse(window.atob(base64));
    } catch (error) {
      return null;
    }
  }

  getUserId(): string | null {
    const user = this.getUserData(); // Obtén los datos del usuario
    return user ? user.id : null;   // Retorna el ID del usuario o null si no está definido
  }

  register(data: RegisterData): Observable<any> {
    const formattedData = {
      ...data
    };
    return this.http.post(`${this.apiUrl}/registro`, formattedData);
  }

  login(email: string, password: string): Promise<boolean> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap(response => {
          if (response?.token) {
            console.log('Usuario logueado', response.user);
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem('usuario', JSON.stringify(response.user));
          }
        }),
        catchError(error => {
          console.error('Error de inicio de sesión:', error);
          throw error.error.message || 'Error desconocido';
        })
      )
      .toPromise()
      .then(response => !!response)
      .catch(() => false);
  }
  
  getUserData(){
    const usuario = localStorage.getItem('usuario');
    return usuario ? JSON.parse(usuario) : null;
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem(this.tokenKey);
    if (!token) return false;
    
    try {
      const payload = this.decodeToken(token);
      return payload && payload.exp > Date.now();
    } catch (error) {
      return false;
    }
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }
}

/*nuevo*/

@Injectable({
  providedIn: 'root',
})
export class ResenasService {
  private apiUrl = 'http://localhost:5000/api/resenas';

  constructor(private http: HttpClient) {}

  crearResena(resena: any): Observable<any> {
    return this.http.post(this.apiUrl, resena, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
 // Envía el token en los headers
      },
    });
  }

  obtenerResenas(): Observable<any> {
    return this.http.get(this.apiUrl, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
 // Envía el token en los headers
      },
    });
  }

  eliminarResena(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
, // Envía el token en los headers
      },
    });
  }
}
/*fin nuevo*/
