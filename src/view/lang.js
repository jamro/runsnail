
export const CLICK = 'click'
export const TAP = 'tap'
export const TO_REPLAY = 'toReplay'
export const HOLD = 'hold'
export const RELEASE = 'release'
export const DIVE = 'dive'
export const FLY_UP = 'flyUp'


const en = {}
en[CLICK] = 'CLICK'
en[TAP] = 'TAP'
en[TO_REPLAY] = 'TO\nREPLAY'
en[HOLD] = 'Hold'
en[RELEASE] = 'Release'
en[DIVE] = 'Dive'
en[FLY_UP] = 'Fly Up'


const pl = {}
pl[CLICK] = 'KLIKNIJ'
pl[TAP] = 'DOTKNIJ'
pl[TO_REPLAY] = 'ABY\n POWTÓRZYĆ'
pl[HOLD] = 'Przytrzymaj'
pl[RELEASE] = 'Puść'
pl[DIVE] = 'Zanurkuj'
pl[FLY_UP] = 'Wyskocz'


export default function __(txt) {
  let dict;
  if(navigator && navigator.language && navigator.language.startsWith('pl')) {
    dict = pl
  } else {
    dict = en
  }
  return dict[txt]
}