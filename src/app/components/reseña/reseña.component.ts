import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Review {
  id: number;
  comentario: string;
  fecha: Date;
}

interface Restaurant {
  id: number;
  nombre: string;
  descripcion: string;
  direccion: string;
  imagen: string;
  resenas: Review[];
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reseña.component.html',
  styleUrls: ['./reseña.component.css']
})
export class reseñas {
  restaurants: Restaurant[] = [
    {
      id: 1,
      nombre: 'Pico Rico',
      descripcion: '44 Años de tradición y servicio',
      direccion: 'CR 50 N 130 sur 69, Medellín, Antioquia 055440',
      imagen: 'https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808-6/300852965_447209110760327_4741523203157338439_n.jpg?_nc_cat=101&ccb=1-7&_nc_sid=6ee11a&_nc_eui2=AeHtAOSHGCgU7deHXq-m80gaedzu2TdVvuN53O7ZN1W-44mry_n0BkVbCAsMSZobGgB05EXADSXAGk0WS953VxjJ&_nc_ohc=KGuLt9sQqT8Q7kNvgE_amRK&_nc_zt=23&_nc_ht=scontent.feoh1-1.fna&_nc_gid=A3VK_nQnC9-C9fK7RiTe9KB&oh=00_AYB53BwjrT1VA22TJorg6l2K79E1ss0MgQHWnkBIECymsw&oe=674AD4D5',
      resenas: []
    },
    {
      id: 2,
      nombre: 'Sazones',
      descripcion: 'Todo el sabor a tradicion',
      direccion: 'Cra. 50 #125 Sur 166, Caldas, Antioquia',
      imagen: 'https://scontent.feoh1-1.fna.fbcdn.net/v/t39.30808-6/300172994_199283235784300_6767840845295092706_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=cc71e4&_nc_eui2=AeG7uQnQmZG7-uQLuCbmwHnb_Bf6_IqLp8f8F_r8iounx4ihTD-HBWLd49WnAj7fPO7EpD11UWWAQOJKC_3fvEhv&_nc_ohc=YbqDgh8lBEoQ7kNvgGraFXj&_nc_zt=23&_nc_ht=scontent.feoh1-1.fna&_nc_gid=AQTKidQhI3hRLReT4QiMFW5&oh=00_AYDIATVVLeM1y6xM3vc-f1fDWx-j9uhN6BMXkqpSrejhjA&oe=674AD40B',
      resenas: []
    },
    {
      id: 3,
      nombre: 'Burdeos',
      descripcion: 'Parrilla y vino',
      direccion: 'Cl. 131 Sur #49-52, Caldas, Antioquia',
      imagen: 'https://lh3.googleusercontent.com/p/AF1QipP9UhvvcK8YuWFXLLTrdKlFhprfsyB7DM320SOC=s680-w680-h510',
      resenas: []
    },
    {
      id: 4,
      nombre: 'Cheche',
      descripcion: 'Resturante, café y bar',
      direccion: 'Cra 47 #50-40, Caldas, Antioquia',
      imagen: 'https://lh3.googleusercontent.com/p/AF1QipPTmwLTAENqiV5TLUEWsd6rWrYFHRcEwVzDpLvV=s680-w680-h510',
      resenas: []
    },
    {
      id: 5,
      nombre: 'La abuela',
      descripcion: 'Variedad al menú por un excelente precio',
      direccion: 'Cra, 48, #128 Sur, 94, a 128 Sur, 48, Caldas, Antioquia',
      imagen: 'https://lh3.googleusercontent.com/p/AF1QipPF4orCC0jNKDtJOUyuxnq65WMR-B5EK6bKFcTe=s680-w680-h510',
      resenas: []
    }
  ];

  selectedRestaurant: Restaurant | null = null;
  editingReview: Review | null = null;
  newReview = {
    comentario: ''
  };

  showReviewForm(restaurant: Restaurant): void {
    this.selectedRestaurant = restaurant;
    this.editingReview = null;
    this.newReview.comentario = '';
  }

  submitReview(): void {
    if (this.selectedRestaurant && this.newReview.comentario.trim()) {
      if (this.editingReview) {
        // Actualizar reseña existente
        const index = this.selectedRestaurant.resenas.findIndex(r => r.id === this.editingReview!.id);
        if (index !== -1) {
          this.selectedRestaurant.resenas[index] = {
            ...this.editingReview,
            comentario: this.newReview.comentario,
            fecha: new Date()
          };
        }
      } else {
        // Crear nueva reseña
        const review: Review = {
          id: Math.random() * 1000000,
          comentario: this.newReview.comentario,
          fecha: new Date()
        };
        this.selectedRestaurant.resenas.push(review);
      }
      
      this.selectedRestaurant = null;
      this.editingReview = null;
      this.newReview.comentario = '';
    }
  }

  editReview(restaurant: Restaurant, review: Review): void {
    this.selectedRestaurant = restaurant;
    this.editingReview = review;
    this.newReview.comentario = review.comentario;
  }

  deleteReview(restaurant: Restaurant, reviewId: number): void {
    const index = restaurant.resenas.findIndex(r => r.id === reviewId);
    if (index !== -1) {
      restaurant.resenas.splice(index, 1);
    }
  }

  cancelReview(): void {
    this.selectedRestaurant = null;
    this.editingReview = null;
    this.newReview.comentario = '';
  }
}