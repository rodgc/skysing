import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core'
import { Observable, Subscription } from 'rxjs'
import { PlayerService } from '../player.service'

@Component({
  selector: 'player-audio',
  templateUrl: './audio.component.html',
  styleUrls: ['./audio.component.css']
})
export class AudioComponent implements OnInit, AfterViewInit, OnDestroy {

  @Output() onCurrentTimeUpdate = new EventEmitter<number>()
  @Output() onPlayPause = new EventEmitter<boolean>()
  @Input() src: string = ''
  private audio: HTMLAudioElement
  private timeSubscription: Subscription
  private loadSubscription: Subscription
  public isPlaying: boolean = false
  public currentTime: string
  public duration: string

  constructor(
    private _player: PlayerService
  ) {}

  ngOnInit() {
    this.audio = this.initAudio()
    this.currentTime = this._player.formatTime(0)
    this.duration = this._player.formatTime(0)
  }

  ngAfterViewInit() {
    this.loadAudioSource(this.src)
    this.timeSubscription = Observable
      .fromEvent(this.audio, 'timeupdate')
      .subscribe(this.handleAudioTimeUpdate)
    this.loadSubscription = Observable
      .fromEvent(this.audio, 'loadeddata')
      .subscribe(this.handleAudioLoaded)
    this.audio.addEventListener('playing', this.handleAudioPlayed)
    this.audio.addEventListener('pause', this.handleAudioPaused)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this._player.hasPropertyChanged(changes.src)) {
      this.loadAudioSource(changes.src.currentValue)
    }
  }

  ngOnDestroy() {
    this.timeSubscription.unsubscribe()
    this.loadSubscription.unsubscribe()
    this.loadAudioSource('')
    this.audio.load()
  }

  initAudio(): HTMLAudioElement {
    const audio = new Audio()
    audio['autobuffer'] = true
    audio.autoplay = false
    audio.preload = 'auto'
    return audio
  }

  loadAudioSource(src: string) {
    this.audio.pause()
    this.handleAudioPaused()
    this.audio.src = src
  }

  handleAudioLoaded = (e: HTMLMediaElementEventMap) => {
    this.duration = this._player.formatTime(this.audio.duration)
  }

  handleAudioTimeUpdate = (e: HTMLMediaElementEventMap) => {
    this.currentTime = this._player.formatTime(this.audio.currentTime)
    this.onCurrentTimeUpdate.emit(this.audio.currentTime)
  }

  handleAudioPlayed = () => {
    this.onPlayPause.emit(true)
    this.isPlaying = true
  }

  handleAudioPaused = () => {
    this.onPlayPause.emit(false)
    this.isPlaying = false
  }

  handleAudioPlayPause() {
    if (this.audio.paused) {
      this.audio.play()
    } else {
      this.audio.pause()
    }
  }

}
