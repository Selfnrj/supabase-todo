"use client";

import { Star } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import doneNoteAction from "@/actions/doneNoteActions";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Dropdown from "./Dropdown";

type Props = {
  todo: {
    id: number;
    text: string;
    done: boolean;
    prio: boolean;
  };
};

function TodoList({ todo }: Props) {
  const supabase = createClient();
  const router = useRouter();
  const [done, setDone] = useState(todo.done);
  const [prio, setPrio] = useState(todo.prio);
  const [noteText, setNoteText] = useState(todo.text);
  const [isEditing, setIsEditing] = useState(false);

  const handlenNoteChange = async (newText: string) => {
    setNoteText(newText);
    await supabase
      .from("todos")
      .update({ text: newText })
      .match({ id: todo.id });
    router.refresh();
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
        <input
          type="text"
          value={noteText}
          className={cn(
            `flex-1 outline-none text-white items-center p-2 mr-2 ml-1 rounded-md bg-slate-500`,
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
