import { HttpClient } from '@angular/common/http';
import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

interface CustomImageData {
  image: string;
  x: number;
  y: number;
  offsetX?: number;
  offsetY?: number;
}

@Component({
  selector: 'app-gestion-sala',
  templateUrl: 'gestion-sala.page.html',
  styleUrls: ['gestion-sala.page.scss'],
})
export class GestionSalaPage implements AfterViewInit {
  @ViewChild('myCanvas', { static: false }) canvas!: ElementRef;
  private ctx!: CanvasRenderingContext2D;
  private isDragging: boolean = false;
  private draggedImageIndex: number = -1;
  private mesasWidth: number = 100;
  private mesasHeight: number = 80;
  private images: CustomImageData[] = [];

  BASE_RUTA = "http://localhost/anotame/APIANOTAME/public/";

  constructor(public authService: AuthService, private http: HttpClient) {}

  ngAfterViewInit() {
    this.initializeCanvas();
  }

  initializeCanvas() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.canvas.nativeElement.width = 800;
    this.canvas.nativeElement.height = 600;

    // Dibujar el lienzo inicial
    this.ctx.fillStyle = '#D7D6D6';
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    // Registrar eventos táctiles en el lienzo
    this.canvas.nativeElement.addEventListener('touchstart', (event: TouchEvent) => this.onTouchStart(event));
    this.canvas.nativeElement.addEventListener('touchmove', (event: TouchEvent) => this.onTouchMove(event));
    this.canvas.nativeElement.addEventListener('touchend', () => this.onTouchEnd());
  }

  onButtonClick(imageUrl: string) {
    const currentImage = new Image();
    currentImage.src = imageUrl;
    currentImage.onload = () => {
      this.images.push({ image: imageUrl, x: 0, y: 0 });
      this.drawImage();
    };
  }

  drawImage() {
    this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.images.forEach((imgData) => {
      const image = new Image();
      image.src = imgData.image;
      this.ctx.drawImage(image, imgData.x, imgData.y, this.mesasWidth, this.mesasHeight);
    });
  }

  onTouchStart(event: TouchEvent) {
    const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
    const touchX = event.touches[0].clientX - canvasRect.left;
    const touchY = event.touches[0].clientY - canvasRect.top;
  
    for (let i = this.images.length - 1; i >= 0; i--) {
      const imgData = this.images[i];
      if (
        touchX >= imgData.x && touchX <= imgData.x + this.mesasWidth &&
        touchY >= imgData.y && touchY <= imgData.y + this.mesasHeight
      ) {
        // Calcular la posición relativa dentro de la imagen
        const offsetX = touchX - imgData.x;
        const offsetY = touchY - imgData.y;
  
        this.isDragging = true;
        this.draggedImageIndex = i;
  
        // Almacenar la posición relativa
        this.images[i].offsetX = offsetX;
        this.images[i].offsetY = offsetY;
  
        break;
      }
    }
  }
  
  onTouchMove(event: TouchEvent) {
    if (this.isDragging && this.draggedImageIndex !== -1) {
      const canvasRect = this.canvas.nativeElement.getBoundingClientRect();
      const touchX = event.touches[0].clientX - canvasRect.left;
      const touchY = event.touches[0].clientY - canvasRect.top;
  
      const imgData = this.images[this.draggedImageIndex];
  
      // Mover la imagen teniendo en cuenta la posición relativa
      imgData.x = touchX - imgData.offsetX!;
      imgData.y = touchY - imgData.offsetY!;
  
      this.drawImage();
    }
  }
  
  onTouchEnd() {
    this.isDragging = false;
    this.draggedImageIndex = -1;
  }
  

  guardarImagen() {
    const canvas = this.canvas.nativeElement;
    const imageDataURL = canvas.toDataURL("image/png");
  
    const dataToSave: CustomImageData[] = this.images.map((imgData) => {
      return { image: imgData.image, x: imgData.x, y: imgData.y };
    });
  
    this.http.post(this.BASE_RUTA + 'ImagenController.php/guardar-posicion-imagenes', { images: dataToSave }).subscribe(
      response => {
        console.log('Datos de posición de imágenes guardados en el servidor:', response);
      },
      error => {
        console.error('Error al guardar los datos de posición de imágenes en el servidor:', error);
      }
    );
  }

  cerrarSesion(): void {
    // Lógica para cerrar sesión
    this.authService.logout().subscribe();
  }
}
