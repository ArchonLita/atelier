import { createEvent } from "../api/Event";
import { Action } from "./Action";
import { Effect } from "./Stats";

export const LoadModifiersEvent = createEvent<Effect[]>();
export const LoadActionsEvent = createEvent<Action[]>();
