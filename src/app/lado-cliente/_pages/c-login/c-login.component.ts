import { Component, OnInit, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PasswordModule} from 'primeng/password';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenubarModule } from 'primeng/menubar';
import { InputTextModule } from 'primeng/inputtext';




@Component({
  selector: 'app-c-login',
  standalone: true,
  imports: [FormsModule, PasswordModule, 
    BreadcrumbModule, MenubarModule, 
    InputTextModule,],
  templateUrl: './c-login.component.html',
  styleUrls: ['./c-login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CLoginComponent {
  senha = '';
  email: string = '';

    hide = signal(true);
    clickEvent(event: MouseEvent) {
    this.hide.set(!this.hide());
    event.stopPropagation();
    }
}
