import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  
