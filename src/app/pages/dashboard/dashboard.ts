import {
  Component,
  ViewChild,
  ElementRef,
  AfterViewInit,
  HostListener
} from '@angular/core';

interface Line {
  color: string;
  width: number;
  points: { x: number; y: number }[];
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  
})
export class DashboardComponent implements AfterViewInit {
  @ViewChild('whiteboardCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('colorPickerRef') colorPickerRef!: ElementRef<HTMLInputElement>;
  @ViewChild('widthPickerRef') widthPickerRef!: ElementRef<HTMLInputElement>;
  
  drawings: Line[] = [];
  currentLine: Line | null = null;
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
  private lastX = 0;
  private lastY = 0;
  private panX = 0;
  private panY = 0;
  private isPanning = false;
  private lastPanX = 0;
  private lastPanY = 0;
  
  ngAfterViewInit() {
    if (!this.canvasRef) {
      console.error('canvasRef não está definido');
      return;
    }
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;

    this.resizeCanvas();

    // Eventos do mouse
    canvas.addEventListener('mousedown', (e) => {
      if (e.button === 2) { // botão direito
        this.startPanning(e);
      } else if (e.button === 0) { // botão esquerdo
        this.startDrawing(e);
      }
    });
    canvas.addEventListener('mousemove', (e) => {
      if (this.isPanning) {
        this.pan(e);
      } else if (this.drawing) {
        this.draw(e);
      }
    });
    canvas.addEventListener('mouseup', () => {
      this.stopPanning();
      this.stopDrawing();
    });
    canvas.addEventListener('mouseout', () => this.stopDrawing());

    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  }
  startPanning(e: MouseEvent) {
    this.isPanning = true;
    this.lastPanX = e.clientX;
    this.lastPanY = e.clientY;
  }

  pan(e: MouseEvent) {
    if (!this.isPanning) return;

    const dx = e.clientX - this.lastPanX;
    const dy = e.clientY - this.lastPanY;

    this.panX += dx;
    this.panY += dy;

    this.lastPanX = e.clientX;
    this.lastPanY = e.clientY;

    this.redraw(); // Atualiza
  }

  redraw() {
    const ctx = this.ctx;
    const canvas = this.canvasRef.nativeElement;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(this.panX, this.panY); // aplica o deslocamento

    // aqui você deve redesenhar todas as linhas/figuras previamente salvas
    this.redrawAll();

    ctx.restore(); // reseta o contexto para evitar empilhamento
  }

  redrawAll() {
    const ctx = this.ctx!;
    const canvas = this.canvasRef.nativeElement;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.drawings.forEach(line => {
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width;
      ctx.lineCap = 'round';

      for (let i = 1; i < line.points.length; i++) {
        const from = line.points[i - 1];
        const to = line.points[i];
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
      }

      ctx.stroke();
    });
  }

  stopPanning() {
    this.isPanning = false;
  }
  @HostListener('window:resize')
  resizeCanvas() {

    
    const canvas = this.canvasRef.nativeElement;
    const tempImage = this.ctx?.getImageData(0, 0, canvas.width, canvas.height);

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    if (tempImage) this.ctx.putImageData(tempImage, 0, 0);
  }

  startDrawing(e: MouseEvent) {
    const { offsetX, offsetY } = this.getCoords(e);
    this.drawing = true;
    this.currentLine = {
      color: this.colorPickerRef.nativeElement.value,
      width: +this.widthPickerRef.nativeElement.value,
      points: [{ x: offsetX, y: offsetY }]
    };
}

  draw(e: MouseEvent) {
    if (!this.drawing || !this.currentLine) return;
    const { offsetX, offsetY } = this.getCoords(e);
    this.currentLine.points.push({ x: offsetX, y: offsetY });
    const ctx = this.ctx!;
    ctx.strokeStyle = this.currentLine.color;
    ctx.lineWidth = this.currentLine.width;
    ctx.lineCap = 'round';
    ctx.beginPath();
    const { x, y } = this.currentLine.points[this.currentLine.points.length - 2];
    ctx.moveTo(x, y);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  }

  stopDrawing() {
    if (this.currentLine) {
      this.drawings.push(this.currentLine);
    }
    this.drawing = false;
    this.currentLine = null;
  }

  clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  exportCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'whiteboard.png';
    link.click();
  }

  private getCoords(e: MouseEvent | Touch) {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();

    return {
      offsetX: (e.clientX - rect.left),
      offsetY: (e.clientY - rect.top)
    };
  }
}
