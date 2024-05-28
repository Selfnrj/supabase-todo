"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import deleteNoteAction from "@/actions/deleteNoteAction";
import { toast } from "sonner";
import doneNoteAction from "@/actions/doneNoteActions";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type Props = {
  todo: {
    id: number;
    text: string;
    done: boolean;
  };
};

function TodoList({ todo }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const [done, setDone] = useState(todo.done);
  const [noteText, setNoteText] = useState(todo.text);
  const [isEditing, setIsEditing] = useState(false);

  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  const handlenNoteChange = async (newText: string) => {
    setNoteText(newText);
    await supabase
      .from("todos")
      .update({ text: newText })
      .match({ id: todo.id });
    router.refresh();
  };

  return (
    <div
      key={todo.id}
      className={cn(
        `group min-h-[56px] flex justify-between bg-slate-600 text-white rounded mb-4 p-2 items-center`,
        done && `bg-green-600`
      )}
    >
      {isEditing ? (
        <input
          type="text"
          value={noteText}
          className={cn(
            `flex-1 outline-none text-white items-center p-2 rounded-md bg-slate-500`,
            done && `bg-green-500`
          )}
          autoFocus
          onChange={(e) => handlenNoteChange(e.target.value)}
          onBlur={() => {
            setIsEditing(false);
          }}
        />
      ) : (
        <>
          <div className="flex items-center flex-1">
            <Checkbox
              className="ml-3 size-6"
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
          <div className="hidden group-hover:block animate-fadeIn">
            <Button
              className="text-slate-300 hover:text-white"
              variant="link"
              onClick={handleEditClick}
            >
              <Pencil size={20} />
            </Button>
            <Button
              className="text-slate-300 hover:text-white"
              variant="link"
              onClick={() => {
                const promise = deleteNoteAction(todo.id);
                toast.promise(promise, {
                  loading: "Deleting note...",
                  success: "Note deleted",
                  error: "An error occurred while deleting the note.",
                });
              }}
            >
              <Trash2 size={20} />
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

export default TodoList;
