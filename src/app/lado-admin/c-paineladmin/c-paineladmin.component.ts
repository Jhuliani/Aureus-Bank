import { MenubarModule } from 'primeng/menubar';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Menu } from 'primeng/menu';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-c-paineladmin',
  standalone: true,
  imports: [ButtonModule,
   BrowserModule, MenubarModule, BrowserAnimationsModule],
  templateUrl: './c-paineladmin.component.html',
  styleUrls: ['./c-paineladmin.component.scss']
})

export class CPaineladminComponent implements OnInit {
  
  items: MenuItem[] | undefined;

  ngOnInit() {

  }
}

