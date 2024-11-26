import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Restaurant, Review } from '../models/restaurante.model';

@Injectable({
  providedIn: 'root'
})
export class RestaurantService {
  private restaurants: Restaurant[] = [
    {
      id: 1,
      nombre: 'La Casa del Sabor',
      descripcion: 'Auténtica cocina española con un toque moderno',
      direccion: 'Calle Mayor 123, Madrid',
      imagen: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      resenas: [
        {
          id: 1,
          restaurantId: 1,
          comentario: '¡Increíble experiencia! La paella fue espectacular y el servicio muy atento. Los sabores son auténticos y el ambiente es muy acogedor. Definitivamente volveré.',
          fecha: new Date('2024-01-15')
        },
        {
          id: 2,
          restaurantId: 1,
          comentario: 'Muy buen ambiente y comida deliciosa. Los postres son excepcionales. El chef se acercó a nuestra mesa para asegurarse de que todo estaba a nuestro gusto.',
          fecha: new Date('2024-01-10')
        }
      ]
    },
    {
      id: 2,
      nombre: 'El Rincón Mexicano',
      descripcion: 'Los mejores tacos y enchiladas de la ciudad',
      direccion: 'Avenida Principal 456, Barcelona',
      imagen: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      resenas: [
        {
          id: 3,
          restaurantId: 2,
          comentario: 'Los tacos al pastor son auténticos y el guacamole está muy bien preparado. Me encantó la salsa habanera casera. El servicio es rápido y el personal muy amable.',
          fecha: new Date('2024-01-12')
        }
      ]
    },
    {
      id: 3,
      nombre: 'Mediterráneo',
      descripcion: 'Pescados y mariscos frescos del día',
      direccion: 'Paseo Marítimo 789, Valencia',
      imagen: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      resenas: [
        {
          id: 4,
          restaurantId: 3,
          comentario: 'Pescado fresco y bien preparado. La vista al mar es espectacular. Los mariscos son de primera calidad y la carta de vinos es excelente.',
          fecha: new Date('2024-01-08')
        }
      ]
    },
    {
      id: 4,
      nombre: 'La Parrilla Argentina',
      descripcion: 'Las mejores carnes a la brasa',
      direccion: 'Plaza Central 321, Sevilla',
      imagen: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      resenas: [
        {
          id: 5,
          restaurantId: 4,
          comentario: '¡La mejor carne que he probado en España! El chimichurri es auténtico y las guarniciones son generosas. El servicio es impecable.',
          fecha: new Date('2024-01-14')
        }
      ]
    },
    {
      id: 5,
      nombre: 'Sushi Fusion',
      descripcion: 'Cocina japonesa contemporánea',
      direccion: 'Calle Nueva 654, Bilbao',
      imagen: 'https://images.unsplash.com/photo-1553621042-f6e147245754?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      resenas: [
        {
          id: 6,
          restaurantId: 5,
          comentario: 'Rolls muy creativos y frescos. El servicio es excelente y la presentación de los platos es espectacular. Los cócteles japoneses son muy originales.',
          fecha: new Date('2024-01-11')
        }
      ]
    }
  ];

  private restaurantsSubject = new BehaviorSubject<Restaurant[]>(this.restaurants);

  getRestaurants(): Observable<Restaurant[]> {
    return this.restaurantsSubject.asObservable();
  }

  addReview(restaurantId: number, review: Omit<Review, 'id'>): void {
    const restaurant = this.restaurants.find(r => r.id === restaurantId);
    if (restaurant) {
      const newReview = {
        ...review,
        id: Math.random() * 1000000
      };
      restaurant.resenas.push(newReview);
      this.restaurantsSubject.next([...this.restaurants]);
    }
  }
}