import { Component, ChangeDetectionStrategy, signal, OnInit} from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { MenuItem } from 'primeng/api';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-c-cadastro',
  standalone: true,
  imports: [FormsModule, 
    InputTextModule, 
    ButtonModule,
    TabMenuModule, 
    InputGroupModule, 
    InputGroupAddonModule,
    PasswordModule,
  ],
  templateUrl: './c-cadastro.component.html',
  styleUrls: ['./c-cadastro.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CCadastroComponent implements OnInit {
  value: string | undefined;
  usuario: string = '';
  email: string = '';
  emailConfirm: string = '';
  senha!: string; //senha
  senhaConfirm: string = '';

  cadastrarUsuario(){
    if (!this.email || !this.senha || !this.usuario){
      alert("Preencha todos os campos")
      return;
    }
    if (this.email !== this.emailConfirm){
      alert("Emails devem ser iguais")
      return;
    }
    if(this.senha !== this.senhaConfirm){
      alert("Senhas devem ser iguais")
      return;      
    }
  }

  // comportamento do input da senha
  hide = signal(true);
  clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
  }

  // OnInit
  items: MenuItem[] | undefined;

  ngOnInit() {
    this.items = [

    ];

  }

}
