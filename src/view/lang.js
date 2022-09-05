
export const CLICK = 'click'
export const TAP = 'tap'
export const TO_REPLAY = 'toReplay'
export const HOLD = 'hold'
export const RELEASE = 'release'
export const DIVE = 'dive'
export const FLY_UP = 'flyUp'
export const HOLD_CLICK_TUTORIAL = 'holdClickTutorial'
export const RELEASE_CLICK_TUTORIAL = 'releaseClickTutorial'
export const HOLD_TAP_TUTORIAL = 'holdTapTutorial'
export const RELEASE_TAP_TUTORIAL = 'releaseTapTutorial'
export const ANYWHERE_TO_CONTINUE = 'anywhereToContinue'
export const RESULT = 'result'
export const BEST = 'best'

const en = {}
en[CLICK] = 'CLICK'
en[TAP] = 'TAP'
en[TO_REPLAY] = 'TO\nREPLAY'
en[HOLD] = 'Hold'
en[RELEASE] = 'Release'
en[DIVE] = 'Dive'
en[FLY_UP] = 'Fly Up'
en[HOLD_CLICK_TUTORIAL] = 'Click the screen and hold it when going \ndownhill. You will gain speed that way.'
en[RELEASE_CLICK_TUTORIAL] = 'Release the button at the bottom of the hill \nand use the momentum to leverage the slope \nof the terrain. You will fly up at speed.'
en[HOLD_TAP_TUTORIAL] = 'Tap the screen and hold it when going downhill. \nYou will gain speed that way.'
en[RELEASE_TAP_TUTORIAL] = 'Stop touching the screen at the bottom of the hill \nand use the momentum to leverage the slope \nof the terrain. You will fly up at speed.'
en[ANYWHERE_TO_CONTINUE] = 'anywhere to continue'
en[RESULT] = 'Result'
en[BEST] = 'Best'

const pl = {}
pl[CLICK] = 'Kliknij'
pl[TAP] = 'Stuknij'
pl[TO_REPLAY] = 'ABY\n POWTÓRZYĆ'
pl[HOLD] = 'Przytrzymaj'
pl[RELEASE] = 'Puść'
pl[DIVE] = 'Rozpędź się'
pl[FLY_UP] = 'Wyskocz'
pl[HOLD_CLICK_TUTORIAL] = 'Kliknij na ekranie i przytrzymaj, gdy toczysz się \nw dół. W ten sposób staniesz się cięższy \ni nabierzesz prędkości.'
pl[RELEASE_CLICK_TUTORIAL] = 'Puść przycisk na dole zbocza aby wykorzystać \nnabrany pęd i nachylenie terenu. Wyskoczysz \nz dużą prędkością w powietrze.'
pl[HOLD_TAP_TUTORIAL] = 'Dotknij ekranu i przytrzymaj, gdy toczysz się \nw dół. W ten sposób staniesz się cięższy i \nnabierzesz prędkości.'
pl[RELEASE_TAP_TUTORIAL] = 'Puść ekranu na dole zbocza aby wykorzystać \nnabrany pęd i nachylenie terenu. Wyskoczysz \nz dużą prędkością w powietrze.'
pl[ANYWHERE_TO_CONTINUE] = 'gdziekolwiek, aby kontynuować'
pl[RESULT] = 'Wynik'
pl[BEST] = 'Najlepszy'

export default function __(txt) {
  let dict;
  if(navigator && navigator.language && navigator.language.startsWith('pl')) {
    dict = pl
  } else {
    dict = en
  }
  return dict[txt]
}