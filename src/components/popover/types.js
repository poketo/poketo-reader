import type { ElementType, ElementRef } from "react";

// Taken from https://stackoverflow.com/a/50729071/1266426
type ReactObjRef<ElementType> = { current: null | ElementRef<ElementType> };
