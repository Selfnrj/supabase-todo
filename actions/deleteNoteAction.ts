"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function deleteNoteAction(noteId: number) {
  const supabase = createClient();

  if (!noteId) {
    throw new Error("noteId is required");
  }

  try {
    await supabase.from("todos").delete().match({ id: noteId });
    revalidatePath("/");
  } catch (error) {
    throw new Error("An error occurred while deleting the note.");
  }
}
