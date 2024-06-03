"use client";

import { Star } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import { toast } from "sonner";
import doneNoteAction from "@/actions/doneNoteActions";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Dropdown from "./Dropdown";
import editNoteAction from "@/actions/editNoteActions";
import { Todo } from "@/types/todo";

function TodoList({ todo }: Todo) {
  const ref = useRef<HTMLFormElement>(null);
  const supabase = createClient();
  const router = useRouter();
  const [done, setDone] = useState(todo.done);
  const [prio, setPrio] = useState(todo.prio);
  const [noteText, setNoteText] = useState(todo.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditNote = async (formData: FormData): Promise<void> => {
    const formDataCopy = formData;
    ref.current?.reset();

    if (!formDataCopy.get("noteEdit")) {
      throw new Error("noteText is required");
    }

    try {
      await editNoteAction(formDataCopy, todo.id);
      setIsEditing(false);
    } catch (error) {
      throw new Error("An error occurred while adding the note.");
    }
  };

  const handlePriorityClick = async () => {
    setPrio(!prio);
    await supabase
      .from("todos")
      .update({ prio: !todo.prio })
      .match({ id: todo.id });
    router.refresh();
  };

  return (
    <div
      key={todo.id}
      className={cn(
        `min-h-[56px] border-l-4 border-transparent flex justify-between bg-slate-600 text-white rounded mb-4 items-center`,
        done && `bg-green-600 border-transparent`,
        prio && !done && `border-yellow-500`
      )}
    >
      {isEditing ? (
        <form
          ref={ref}
          className="w-full"
          action={(formData) => {
            const promise = handleEditNote(formData);
            toast.promise(promise, {
              loading: "Editing note...",
              success: "Note edited successfully",
              error: "An error occurred while adding the note.",
            });
          }}
        >
          <input
            type="text"
            value={noteText}
            name="noteEdit"
            className={cn(
              `flex-1 outline-none text-white items-center p-2 mr-2 ml-1 rounded-md bg-slate-500 w-full`,
              done && `bg-green-500`
            )}
            autoFocus
            onChange={(e) => setNoteText(e.target.value)}
            onBlur={() => {
              setIsEditing(false);
            }}
          />
          <button type="submit" hidden>
            Editera
          </button>
        </form>
      ) : (
        <>
          <div className="flex items-center flex-1">
            <Checkbox
              className="ml-3 size-5"
              checked={done}
              onCheckedChange={() => {
                const promise = doneNoteAction(todo.id, todo.done);
                toast.promise(promise, {
                  loading: done
                    ? "Marking note as undone..."
                    : "Marking note as done...",
                  success: done
                    ? `"${todo.text}" marked as undone`
                    : `"${todo.text}" marked as done`,
                  error: "An error occurred while marking the note as done.",
                });
                setDone(!done);
              }}
            />
            <h2 className="mr-8 ml-3">{todo.text}</h2>
          </div>
          {prio && !done && (
            <div className="flex text-yellow-500 items-center">
              <Star className="size-5 mr-2" />
              <span className="text-xs uppercase">High priority</span>
            </div>
          )}
          <Dropdown
            todo={todo}
            handlePriorityClick={handlePriorityClick}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            prio={prio}
          />
        </>
      )}
    </div>
  );
}

export default TodoList;
