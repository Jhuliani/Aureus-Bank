import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CPaineladminComponent } from "./_pages/c-paineladmin/c-paineladmin.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CPaineladminComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Aureus-Bank';
}
