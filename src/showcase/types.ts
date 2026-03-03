import type { ComponentType } from "react";

export interface Param {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface CodeExample {
  title: string;
  description: string;
  code: string;
}

export interface HookEntry {
  name: string;
  slug: string;
  category: string;
  description: string;
  sourceFile: string;
  useCases: string[];
  signature: string;
  params: Param[];
  returnType: string;
  returnDescription: string;
  returnBreakdown?: Param[];
  examples: CodeExample[];
  demo?: ComponentType;
  fullCode?: string;
}

export interface Category {
  name: string;
  slug: string;
  hooks: HookEntry[];
}
