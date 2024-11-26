export interface Restaurant {
    id: number;
    nombre: string;
    descripcion: string;
    direccion: string;
    imagen: string;
    resenas: Review[];
  }
  
  export interface Review {
    id: number;
    restaurantId: number;
    comentario: string;
    fecha: Date;
  }