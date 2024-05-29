"use client";

import { useRef } from "react";
import addNoteAction from "@/actions/addNoteActions";
import { toast } from "sonner";

function AddTodo() {
  const ref = useRef<HTMLFormElement>(null);

  const handleAddNote = async (formData: FormData): Promise<void> => {
    const formDataCopy = formData;
    ref.current?.reset();

    if (!formDataCopy.get("commentInput")) {
      throw new Error("noteText is required");
    }

    try {
      await addNoteAction(formDataCopy);
    } catch (error) {
      throw new Error("An error occurred while adding the note.");
    }
  };

  return (
    <form
      ref={ref}
      action={(formData) => {
        const promise = handleAddNote(formData);
        toast.promise(promise, {
          loading: "Adding note...",
          success: "Note added",
          error: "An error occurred while adding the note.",
        });
      }}
      className="flex my-8"
    >
      <input
        type="text"
        name="commentInput"
        placeholder="Add task..."
        className="flex outline-none text-2xl text-slate-900 items-center px-2 py-4 indent-3 rounded-md flex-1 bg-white"
      />
      <button type="submit" hidden>
        Lägg till
      </button>
    </form>
  );
}

export default AddTodo;
