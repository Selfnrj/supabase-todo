"use client";

import { ChevronDown, Pencil, Star, Trash2 } from "lucide-react";
import deleteNoteAction from "@/actions/deleteNoteAction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Todo } from "@/types/todo";

type Props = {
  handlePriorityClick: () => void;
  isEditing: boolean;
  setIsEditing: (value: boolean) => void;
  prio: boolean;
};

function Dropdown({
  todo,
  handlePriorityClick,
  isEditing,
  setIsEditing,
  prio,
}: Props & Todo) {
  const handleEditClick = () => {
    setIsEditing(!isEditing);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="p-4">
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={handleEditClick}>
          <Pencil className="mr-2 h-4 w-4" /> Edit
        </DropdownMenuItem>

        {!todo.done && (
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={handlePriorityClick}
          >
            <Star className="mr-2 h-4 w-4" />{" "}
            {prio === false ? "Set priority" : "Remove priority"}
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="cursor-pointer"
          onClick={() => {
            const promise = deleteNoteAction(todo.id);
            toast.promise(promise, {
              loading: "Deleting note...",
              success: "Note deleted",
              error: "An error occurred while deleting the note.",
            });
          }}
        >
          <span className="text-red-500 flex">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default Dropdown;
