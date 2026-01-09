import { writable } from "svelte/store";

export const viewport = writable({
    start: 0,
    count: 100,
});
