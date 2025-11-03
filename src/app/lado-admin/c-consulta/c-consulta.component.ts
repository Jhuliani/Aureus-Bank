import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-c-consulta',
  standalone: true,
  imports: [
    FormsModule, 
    InputTextModule    
  ],
  templateUrl: './c-consulta.component.html',
  styleUrls: ['./c-consulta.component.scss'],
})
export class CConsultaComponent {
  clientePesquisado?: string;
}
