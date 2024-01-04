// utils.js
import { v4 } from "https://deno.land/std@0.95.0/uuid/mod.ts";

export const createUniqueSessionID = () => {
 return v4.generate();
};