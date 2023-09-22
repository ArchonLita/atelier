import {
  CharacterClass,
  Feature,
  FeatureData,
  FeatureDeserializer,
  Skill,
} from "../Character";
import { Decoder } from "../Util";

interface WizardStatsFeatureData extends FeatureData {
  skills: Skill[];
}

class WizardStatsFeature extends Feature {
  constructor(data: WizardStatsFeatureData) {
    super(data);
  }
}

export class WizardClass extends CharacterClass {
  buildFeature(data: FeatureData) {
    return WizardFeatureDeserializer.deserialize(data);
  }
}

export const Wizard: Decoder = {
  id: "wizard",
  build: (data) => new WizardClass(data),
};

export const WizardFeatureA: Decoder = {
  id: "a",
  build: (data) => ({
    data,
    foo: () => console.log("A"),
  }),
};

export const WizardFeatureB: Decoder = {
  id: "b",
  build: (data) => ({
    data,
    foo: () => console.log("B"),
  }),
};

export const WizardFeatureDeserializer = new FeatureDeserializer();
WizardFeatureDeserializer.registerDecoder(WizardFeatureA);
WizardFeatureDeserializer.registerDecoder(WizardFeatureB);
