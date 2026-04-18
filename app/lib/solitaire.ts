import { Card, Suit, SUIT_GROUP, generateDeck } from './deck';

export interface GameState {
  tableau: Card[][];   // 7 columns
  foundations: Card[][]; // 4 piles (one per suit)
  stock: Card[];
  waste: Card[];
  moves: number;
  won: boolean;
}

export function initGame(seed: number): GameState {
  const deck = generateDeck(seed);
  const tableau: Card[][] = Array.from({ length: 7 }, () => []);

  let idx = 0;
  for (let col = 0; col < 7; col++) {
    for (let row = 0; row <= col; row++) {
      const card = { ...deck[idx++] };
      card.faceUp = row === col;
      tableau[col].push(card);
    }
  }

  const stock = deck.slice(idx).map(c => ({ ...c, faceUp: false }));

  return {
    tableau,
    foundations: [[], [], [], []],
    stock,
    waste: [],
    moves: 0,
    won: false,
  };
}

export function canPlaceOnFoundation(card: Card, foundation: Card[]): boolean {
  if (foundation.length === 0) return card.rank === 1;
  const top = foundation[foundation.length - 1];
  return top.suit === card.suit && card.rank === top.rank + 1;
}

export function canPlaceOnTableau(card: Card, column: Card[]): boolean {
  if (column.length === 0) return card.rank === 13;
  const top = column[column.length - 1];
  if (!top.faceUp) return false;
  return SUIT_GROUP[card.suit] !== SUIT_GROUP[top.suit] && card.rank === top.rank - 1;
}

export function drawFromStock(state: GameState): GameState {
  const s = deepClone(state);
  if (s.stock.length === 0) {
    s.stock = s.waste.reverse().map(c => ({ ...c, faceUp: false }));
    s.waste = [];
  } else {
    const card = s.stock.pop()!;
    card.faceUp = true;
    s.waste.push(card);
    s.moves++;
  }
  return s;
}

export function moveWasteToFoundation(state: GameState): GameState {
  if (state.waste.length === 0) return state;
  const card = state.waste[state.waste.length - 1];
  const suitIdx = ['coral', 'amber', 'blue', 'green'].indexOf(card.suit);
  if (!canPlaceOnFoundation(card, state.foundations[suitIdx])) return state;
  const s = deepClone(state);
  s.waste.pop();
  s.foundations[suitIdx].push(card);
  s.moves++;
  s.won = checkWon(s);
  return s;
}

export function moveWasteToTableau(state: GameState, colIdx: number): GameState {
  if (state.waste.length === 0) return state;
  const card = state.waste[state.waste.length - 1];
  if (!canPlaceOnTableau(card, state.tableau[colIdx])) return state;
  const s = deepClone(state);
  s.waste.pop();
  s.tableau[colIdx].push(card);
  s.moves++;
  return s;
}

export function moveTableauToFoundation(state: GameState, colIdx: number): GameState {
  const col = state.tableau[colIdx];
  if (col.length === 0) return state;
  const card = col[col.length - 1];
  if (!card.faceUp) return state;
  const suitIdx = ['coral', 'amber', 'blue', 'green'].indexOf(card.suit);
  if (!canPlaceOnFoundation(card, state.foundations[suitIdx])) return state;
  const s = deepClone(state);
  s.tableau[colIdx].pop();
  if (s.tableau[colIdx].length > 0) s.tableau[colIdx][s.tableau[colIdx].length - 1].faceUp = true;
  s.foundations[suitIdx].push(card);
  s.moves++;
  s.won = checkWon(s);
  return s;
}

export function moveTableauToTableau(
  state: GameState,
  fromCol: number,
  cardIdx: number,
  toCol: number
): GameState {
  const from = state.tableau[fromCol];
  const cards = from.slice(cardIdx);
  if (cards.length === 0 || !cards[0].faceUp) return state;
  if (!canPlaceOnTableau(cards[0], state.tableau[toCol])) return state;
  const s = deepClone(state);
  s.tableau[fromCol] = s.tableau[fromCol].slice(0, cardIdx);
  if (s.tableau[fromCol].length > 0) s.tableau[fromCol][s.tableau[fromCol].length - 1].faceUp = true;
  s.tableau[toCol].push(...cards);
  s.moves++;
  return s;
}

export function autoMoveToFoundations(state: GameState): GameState {
  let s = deepClone(state);
  let changed = true;
  while (changed) {
    changed = false;
    for (let c = 0; c < 7; c++) {
      const next = moveTableauToFoundation(s, c);
      if (next.moves !== s.moves) { s = next; changed = true; }
    }
    if (s.waste.length > 0) {
      const next = moveWasteToFoundation(s);
      if (next.moves !== s.moves) { s = next; changed = true; }
    }
  }
  return s;
}

function checkWon(state: GameState): boolean {
  return state.foundations.every(f => f.length === 13);
}

function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export type { Suit };
