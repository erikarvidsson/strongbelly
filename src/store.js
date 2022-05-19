import { writable } from "svelte/store";

export const graphValues = writable({
  values: [],
  dates: [],
});
