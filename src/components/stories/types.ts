import type { ComponentType } from "react";

export interface StoryDef {
  lang: string;
  file: string;
  code: string;
  Demo: ComponentType;
  narrative: { code: string; build: string; live: string };
}
