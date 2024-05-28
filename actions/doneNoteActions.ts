"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function doneNoteAction(
  noteId: number,
  noteDone: boolean
) {
  const supabase = createClient();

  if (!noteId) {
    throw new Error("noteId is required");
  }

  try {
    await supabase
      .from("todos")
      .update({ done: !noteDone })
      .match({ id: noteId });
    revalidatePath("/");
  } catch (error) {
    throw new Error("An error occurred while deleting the note.");
  }
}
