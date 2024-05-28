import AddTodo from "@/components/AddTodo";
import TodoList from "@/components/TodoList";
import { createClient } from "@/utils/supabase/server";
import { Frown } from "lucide-react";

export default async function Page() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(user?.id);

  const { data: todos } = await supabase
    .from("todos")
    .select()
    .eq("user_id", user?.id)
    .order("id", { ascending: false });

  return (
    <div className="max-w-screen-md w-full">
      <AddTodo />
      {todos?.length !== 0 ? (
        todos?.map((todo) => <TodoList key={todo.id} todo={todo} />)
      ) : (
        <div className="text-slate-300 text-center mt-16">
          <Frown className="mx-auto mb-2" size={60} />
          Nothing to show
        </div>
      )}
    </div>
  );
}
