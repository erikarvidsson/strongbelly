import { writable } from "svelte/store";
import { io } from "socket.io-client";

export const socket = writable(io());

export const graphValues = writable({
  values: [],
  dates: [],
});
