import type { InferType } from "yup";
import { newItemSchema } from "../new-item-schema";

export const moveItemSchema = newItemSchema.pick(["roomId", "boxId"]);
export type MoveItemValues = InferType<typeof moveItemSchema>;