import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  isMobile: boolean = false; // Inicializado com um valor padrão

  constructor() { }

  ngOnInit() {
    this.checkIsMobile();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) { // Adicionando o tipo explícito Event
    this.checkIsMobile();
  }

  checkIsMobile() {
    this.isMobile = window.innerWidth <= 1100; // Ajuste conforme necessário
  }
}