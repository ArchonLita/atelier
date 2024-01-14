import { createEvent } from "../api/Event";
import { Action } from "./Action";
import { Sheet } from "./Sheet";
import { Effect } from "./Stats";

export const LoadModifiersEvent = createEvent<Effect[]>();
export const LoadActionsEvent = createEvent<Action[]>();
export const LoadSheetEvent = createEvent<Sheet>();
