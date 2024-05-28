"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function addNoteAction(formData: FormData) {
  const supabase = createClient();
  const noteText = formData.get("commentInput") as string;

  if (!noteText) {
    throw new Error("noteText is required");
  }

  try {
    await supabase.from("todos").insert([{ text: noteText }]);
    revalidatePath("/");
  } catch (error) {
    throw new Error("An error occurred while adding the note.");
  }
}
