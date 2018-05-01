import { SimpleChange } from '@angular/core'
import { Injectable } from '@angular/core';
import { Observable, Scheduler, Subject, Subscription } from 'rxjs'
import { scan, map, withLatestFrom, distinctUntilChanged } from 'rxjs/operators'

const { Metaphone, SoundEx } = window['natural']

@Injectable()
export class PlayerService {
  private readonly ALPHA_REGEX: RegExp = /[^a-z\s]/gi
  private readonly DOUBLESPACES_REGEX: RegExp = /\s\s+/g

  hasPropertyChanged(change: SimpleChange): boolean {
    return !change.firstChange && change.previousValue !== change.currentValue
  }

  formatTime(secs: number | string): string {
    const secsNum = parseInt(secs.toString(), 10)
    const hours = Math.floor(secsNum / 3600) % 24
    const minutes = Math.floor(secsNum / 60) % 60
    const seconds = secsNum % 60
    return [hours, minutes, seconds]
      .map((num) => (num < 10)
        ? '0' + num
        : num
      )
      .filter((num, i) => (
        (num !== '00') || (i > 0))
      )
      .join(':')
  }

  countMatches(speech: string, lines: string[]): number {
    let matches = 0
    const speechWordsList = speech
      .trim()
      .toLowerCase()
      .replace(this.ALPHA_REGEX, '')
      .replace(this.DOUBLESPACES_REGEX, ' ')
      .split(' ')

    const linesWordsList = lines
      .map((line) => line
        .trim()
        .toLowerCase()
        .replace(this.ALPHA_REGEX, '')
        .replace(this.DOUBLESPACES_REGEX, ' ')
        .split(' ')
      )
      .reduce((a, b) => a.concat(b), [])

    speechWordsList.forEach((wordFromSpeech) => {
      const indexInLyrics = linesWordsList.findIndex(
        (wordFromLyrics) => wordFromSpeech === wordFromLyrics
          || Metaphone.compare(wordFromSpeech, wordFromLyrics)
          || SoundEx.compare(wordFromSpeech, wordFromLyrics)
      )

      if (indexInLyrics >= 0) {
        linesWordsList.splice(indexInLyrics, 1)
        matches++
      }
    })
    return matches
  }

  pointsAnimator(value$: Subject<number>) {
    const tick$ = Observable.interval(0, Scheduler.animationFrame)
    const lerpValue$ = tick$.pipe(
      withLatestFrom(value$, (_, value) => value),
      scan(
        (prev, current) => prev + (current - prev) * .05,
        0
      ),
      map((n) => Math.round(n)),
      distinctUntilChanged()
    )
    return lerpValue$
  }
}
