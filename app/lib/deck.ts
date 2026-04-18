export type Suit = 'coral' | 'amber' | 'blue' | 'green';
export type Rank = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13;

export interface Card {
  id: string;
  suit: Suit;
  rank: Rank;
  faceUp: boolean;
}

export const SUITS: Suit[] = ['coral', 'amber', 'blue', 'green'];

export const SUIT_COLORS: Record<Suit, string> = {
  coral: '#F4654A',
  amber: '#F5B340',
  blue:  '#7BCBD4',
  green: '#4DB87A',
};

// coral/green = "red" group, amber/blue = "black" group for alternating rule
export const SUIT_GROUP: Record<Suit, 'red' | 'black'> = {
  coral: 'red',
  green: 'red',
  amber: 'black',
  blue:  'black',
};

export const RANK_LABEL: Record<Rank, string> = {
  1: 'A', 2: '2', 3: '3', 4: '4', 5: '5', 6: '6',
  7: '7', 8: '8', 9: '9', 10: '10', 11: 'J', 12: 'Q', 13: 'K',
};

export const SUIT_SYMBOL: Record<Suit, string> = {
  coral: '♠',
  amber: '♥',
  blue:  '♦',
  green: '♣',
};

// Mulberry32 seeded PRNG
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function generateDeck(seed: number): Card[] {
  const rng = mulberry32(seed);
  const cards: Card[] = [];
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      cards.push({ id: `${suit}-${rank}`, suit, rank: rank as Rank, faceUp: false });
    }
  }
  // Fisher-Yates shuffle with seeded RNG
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}
