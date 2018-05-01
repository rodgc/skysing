import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SongsService } from './songs/songs.service';
import { PlayerService } from './player/player.service';
import { PlayerComponent } from './player/player.component';
import { AudioComponent } from './player/audio/audio.component';
import { LyricsComponent } from './player/lyrics/lyrics.component';


@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    AudioComponent,
    LyricsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    PlayerService,
    SongsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
