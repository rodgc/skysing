import { Injectable } from '@angular/core';

import { Song } from './song.interface'

@Injectable()
export class SongsService {

  constructor() { }

  private readonly songList: Song[] = []

  getSongList() {
    return this.songList
  }

}
