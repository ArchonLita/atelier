import { Property, Serializer } from "../api/Data";
import { ActiveDatabase } from "../server/Database";
import { Sheet } from "./Sheet";

const SheetReferenceSerializer: Serializer<Sheet> = {
  serialize: (sheet: Sheet) => sheet.id,
  deserialize: (obj: any) => ActiveDatabase.sheets.get(obj)!, //TODO error handling
};

export class Scene {
  @Property(SheetReferenceSerializer)
  sheets: Sheet[] = [];
}
