import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { SongsService } from './songs/songs.service';
import { PlayerService } from './player/player.service';
import { PlayerComponent } from './player/player.component';
import { AudioComponent } from './player/audio/audio.component';
import { LyricsComponent } from './player/lyrics/lyrics.component';
import { PointsComponent } from './player/points/points.component';
import { RecognitionService } from './player/speech/recognition.service';
import { SpeechComponent } from './player/speech/speech.component';


@NgModule({
  declarations: [
    AppComponent,
    PlayerComponent,
    AudioComponent,
    LyricsComponent,
    PointsComponent,
    SpeechComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    PlayerService,
    SongsService,
    RecognitionService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
