"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function editNoteAction(
  formData: FormData,
  noteId: number
) {
  const supabase = createClient();
  const noteText = formData.get("noteEdit") as string;

  if (!noteText) {
    throw new Error("noteText is required");
  }

  try {
    await supabase
      .from("todos")
      .update({ text: noteText })
      .match({ id: noteId });
    revalidatePath("/");
  } catch (error) {
    throw new Error("An error occurred while adding the note.");
  }
}
