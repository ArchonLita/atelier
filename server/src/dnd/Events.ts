import { createEvent } from "../api/Event";
import { Action } from "./Action";
import { Kit } from "./Equipment";
import { Class, Sheet } from "./Sheet";
import { Effect } from "./Stats";

// Sheet Events
export const LoadModifiersEvent = createEvent<Effect[]>();
export const LoadActionsEvent = createEvent<Action[]>();
export const LoadSheetEvent = createEvent<Sheet>();

// Class Events
export const LevelUpEvent = createEvent();
export const LoadClassEvent = createEvent<Class>();

// Kit Events
export const LoadKitEvent = createEvent<Kit>();
