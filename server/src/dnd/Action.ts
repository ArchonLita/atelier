import { CharacterSheet } from "./CharacterSheet";

export interface Action {
  call: (user: CharacterSheet, target: CharacterSheet) => void;
}
