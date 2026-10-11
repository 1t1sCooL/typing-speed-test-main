const base = import.meta.env.BASE_URL

export const assets = {
  logoLarge: `${base}images/logo-large.svg`,
  logoSmall: `${base}images/logo-small.svg`,
  iconCompleted: `${base}images/icon-completed.svg`,
  iconNewPb: `${base}images/icon-new-pb.svg`,
  iconPersonalBest: `${base}images/icon-personal-best.svg`,
  iconRestart: `${base}images/icon-restart.svg`,
  iconDownArrow: `${base}images/icon-down-arrow.svg`,
  // pattern-star-1.svg is the large (74px) yellow four-point star;
  // pattern-star-2.svg is the small (32px) red asterisk.
  starYellow: `${base}images/pattern-star-1.svg`,
  starRed: `${base}images/pattern-star-2.svg`,
  patternConfetti: `${base}images/pattern-confetti.svg`,
} as const
