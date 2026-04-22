import { useEffect, useMemo, useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

const initialTasks = [
  { id: "1", title: "Estudar React", status: "todo", priority: "high" },
  { id: "2", title: "Criar projeto no GitHub", status: "doing", priority: "medium" },
  { id: "3", title: "Atualizar currículo", status: "done", priority: "low" },
];

const columns = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

function getPriorityStyles(priority, darkMode) {
  if (priority === "high") {
    return darkMode
      ? "bg-red-950 text-red-300"
      : "bg-red-100 text-red-700";
  }

  if (priority === "medium") {
    return darkMode
      ? "bg-amber-950 text-amber-300"
      : "bg-amber-100 text-amber-700";
  }

  return darkMode
    ? "bg-emerald-950 text-emerald-300"
    : "bg-emerald-100 text-emerald-700";
}

function TaskCard({ task, onDelete, onEdit, darkMode }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: task.id,
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`rounded-2xl border p-4 shadow-sm transition ${
        darkMode
          ? "border-zinc-700 bg-zinc-900"
          : "border-gray-200 bg-white"
      } ${isDragging ? "opacity-60 scale-105" : "hover:shadow-md"}`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <p
          className={`text-sm font-medium ${
            darkMode ? "text-zinc-100" : "text-gray-800"
          }`}
        >
          {task.title}
        </p>

        <div className="flex gap-1">
          <button
            onClick={() => onEdit(task)}
            className={`rounded-lg px-2 py-1 text-xs transition ${
              darkMode
                ? "text-sky-300 hover:bg-zinc-800"
                : "text-sky-600 hover:bg-sky-50"
            }`}
          >
            Editar
          </button>

          <button
            onClick={() => onDelete(task.id)}
            className={`rounded-lg px-2 py-1 text-xs transition ${
              darkMode
                ? "text-red-300 hover:bg-zinc-800"
                : "text-red-500 hover:bg-red-50"
            }`}
          >
            ✕
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${getPriorityStyles(
            task.priority,
            darkMode
          )}`}
        >
          {task.priority === "high"
            ? "Alta"
            : task.priority === "medium"
            ? "Média"
            : "Baixa"}
        </span>

        <span
          className={`text-xs ${
            darkMode ? "text-zinc-400" : "text-gray-400"
          }`}
        >
          Arraste
        </span>
      </div>
    </div>
  );
}

function Column({ column, tasks, children, darkMode }) {
  const { isOver, setNodeRef } = useDroppable({
    id: column.id,
  });

  const columnStyles = darkMode
    ? {
        todo: isOver
          ? "border-sky-700 bg-sky-950"
          : "border-zinc-700 bg-zinc-900",
        doing: isOver
          ? "border-amber-700 bg-amber-950"
          : "border-zinc-700 bg-zinc-900",
        done: isOver
          ? "border-emerald-700 bg-emerald-950"
          : "border-zinc-700 bg-zinc-900",
      }
    : {
        todo: isOver
          ? "border-blue-300 bg-blue-50"
          : "border-blue-100 bg-blue-50",
        doing: isOver
          ? "border-amber-300 bg-amber-50"
          : "border-amber-100 bg-amber-50",
        done: isOver
          ? "border-emerald-300 bg-emerald-50"
          : "border-emerald-100 bg-emerald-50",
      };

  return (
    <section
      ref={setNodeRef}
      className={`rounded-3xl border p-4 transition ${columnStyles[column.id]}`}
    >
      <div className="mb-4 flex items-center justify-between">
        <h2
          className={`text-lg font-semibold ${
            darkMode ? "text-zinc-100" : "text-gray-800"
          }`}
        >
          {column.title}
        </h2>
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium shadow-sm ${
            darkMode
              ? "bg-zinc-800 text-zinc-300"
              : "bg-white text-gray-600"
          }`}
        >
          {tasks.length}
        </span>
      </div>

      <div className="min-h-60 space-y-3">{children}</div>
    </section>
  );
}

function EditModal({
  editingTask,
  setEditingTask,
  handleUpdateTask,
  darkMode,
}) {
  if (!editingTask) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div
        className={`w-full max-w-md rounded-3xl border p-6 shadow-2xl ${
          darkMode
            ? "border-zinc-700 bg-zinc-900"
            : "border-gray-200 bg-white"
        }`}
      >
        <h3
          className={`mb-4 text-xl font-semibold ${
            darkMode ? "text-zinc-100" : "text-gray-900"
          }`}
        >
          Editar tarefa
        </h3>

        <div className="space-y-4">
          <input
            type="text"
            value={editingTask.title}
            onChange={(e) =>
              setEditingTask({ ...editingTask, title: e.target.value })
            }
            className={`w-full rounded-2xl border px-4 py-3 outline-none ${
              darkMode
                ? "border-zinc-700 bg-zinc-800 text-white"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          />

          <select
            value={editingTask.priority}
            onChange={(e) =>
              setEditingTask({ ...editingTask, priority: e.target.value })
            }
            className={`w-full rounded-2xl border px-4 py-3 outline-none ${
              darkMode
                ? "border-zinc-700 bg-zinc-800 text-white"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          >
            <option value="low">Baixa</option>
            <option value="medium">Média</option>
            <option value="high">Alta</option>
          </select>

          <select
            value={editingTask.status}
            onChange={(e) =>
              setEditingTask({ ...editingTask, status: e.target.value })
            }
            className={`w-full rounded-2xl border px-4 py-3 outline-none ${
              darkMode
                ? "border-zinc-700 bg-zinc-800 text-white"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          >
            <option value="todo">To Do</option>
            <option value="doing">Doing</option>
            <option value="done">Done</option>
          </select>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleUpdateTask}
              className="flex-1 rounded-2xl bg-sky-600 px-4 py-3 font-medium text-white transition hover:bg-sky-700"
            >
              Salvar
            </button>

            <button
              onClick={() => setEditingTask(null)}
              className={`flex-1 rounded-2xl border px-4 py-3 font-medium transition ${
                darkMode
                  ? "border-zinc-700 text-zinc-200 hover:bg-zinc-800"
                  : "border-gray-300 text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("taskflow_tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [newTask, setNewTask] = useState("");
  const [selectedColumn, setSelectedColumn] = useState("todo");
  const [priority, setPriority] = useState("medium");
  const [search, setSearch] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("taskflow_theme");
    return saved ? JSON.parse(saved) : false;
  });

  const sensors = useSensors(useSensor(PointerSensor));

  useEffect(() => {
    localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("taskflow_theme", JSON.stringify(darkMode));
  }, [darkMode]);

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "todo").length,
      doing: tasks.filter((task) => task.status === "doing").length,
      done: tasks.filter((task) => task.status === "done").length,
    };
  }, [tasks]);

  const addTask = () => {
    if (!newTask.trim()) return;

    const task = {
      id: Date.now().toString(),
      title: newTask.trim(),
      status: selectedColumn,
      priority,
    };

    setTasks((prev) => [task, ...prev]);
    setNewTask("");
    setSelectedColumn("todo");
    setPriority("medium");
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === active.id ? { ...task, status: over.id } : task
      )
    );
  };

  const handleUpdateTask = () => {
    if (!editingTask?.title.trim()) return;

    setTasks((prev) =>
      prev.map((task) => (task.id === editingTask.id ? editingTask : task))
    );
    setEditingTask(null);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [tasks, search]);

  return (
    <main
      className={`min-h-screen px-4 py-8 ${
        darkMode ? "bg-zinc-950 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="mx-auto max-w-7xl">
        <header
          className={`mb-8 rounded-3xl border p-6 shadow-lg ${
            darkMode
              ? "border-zinc-800 bg-zinc-900"
              : "border-gray-200 bg-white"
          }`}
        >
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-3">
                <p
                  className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${
                    darkMode
                      ? "bg-zinc-800 text-zinc-300"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  Productivity Board
                </p>

                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition ${
                    darkMode
                      ? "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {darkMode ? "Modo claro" : "Modo escuro"}
                </button>
              </div>

              <h1 className="text-4xl font-bold tracking-tight">TaskFlow</h1>
              <p
                className={`mt-2 max-w-2xl text-sm sm:text-base ${
                  darkMode ? "text-zinc-400" : "text-gray-600"
                }`}
              >
                Organize tarefas, arraste entre colunas, filtre por busca e
                acompanhe o fluxo de trabalho com uma interface moderna.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div
                className={`rounded-2xl p-4 ${
                  darkMode ? "bg-zinc-800" : "bg-gray-100"
                }`}
              >
                <p className="text-xs text-gray-500">Total</p>
                <p className="mt-1 text-2xl font-bold">{stats.total}</p>
              </div>
              <div
                className={`rounded-2xl p-4 ${
                  darkMode ? "bg-zinc-800" : "bg-blue-50"
                }`}
              >
                <p className="text-xs text-blue-500">To Do</p>
                <p className="mt-1 text-2xl font-bold">{stats.todo}</p>
              </div>
              <div
                className={`rounded-2xl p-4 ${
                  darkMode ? "bg-zinc-800" : "bg-amber-50"
                }`}
              >
                <p className="text-xs text-amber-600">Doing</p>
                <p className="mt-1 text-2xl font-bold">{stats.doing}</p>
              </div>
              <div
                className={`rounded-2xl p-4 ${
                  darkMode ? "bg-zinc-800" : "bg-emerald-50"
                }`}
              >
                <p className="text-xs text-emerald-600">Done</p>
                <p className="mt-1 text-2xl font-bold">{stats.done}</p>
              </div>
            </div>
          </div>
        </header>

        <section
          className={`mb-8 rounded-3xl border p-5 shadow-lg ${
            darkMode
              ? "border-zinc-800 bg-zinc-900"
              : "border-gray-200 bg-white"
          }`}
        >
          <h2 className="mb-4 text-lg font-semibold">Nova tarefa</h2>

          <div className="flex flex-col gap-3 lg:flex-row">
            <input
              type="text"
              placeholder="Digite uma nova tarefa..."
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addTask()}
              className={`flex-1 rounded-2xl border px-4 py-3 outline-none ${
                darkMode
                  ? "border-zinc-700 bg-zinc-800 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            />

            <select
              value={selectedColumn}
              onChange={(e) => setSelectedColumn(e.target.value)}
              className={`rounded-2xl border px-4 py-3 outline-none ${
                darkMode
                  ? "border-zinc-700 bg-zinc-800 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="todo">To Do</option>
              <option value="doing">Doing</option>
              <option value="done">Done</option>
            </select>

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className={`rounded-2xl border px-4 py-3 outline-none ${
                darkMode
                  ? "border-zinc-700 bg-zinc-800 text-white"
                  : "border-gray-300 bg-white text-gray-900"
              }`}
            >
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>

            <button
              onClick={addTask}
              disabled={!newTask.trim()}
              className="rounded-2xl bg-sky-600 px-5 py-3 font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Adicionar
            </button>
          </div>
        </section>

        <section
          className={`mb-8 rounded-3xl border p-5 shadow-lg ${
            darkMode
              ? "border-zinc-800 bg-zinc-900"
              : "border-gray-200 bg-white"
          }`}
        >
          <h2 className="mb-4 text-lg font-semibold">Buscar tarefa</h2>

          <input
            type="text"
            placeholder="Pesquise por uma tarefa..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full rounded-2xl border px-4 py-3 outline-none ${
              darkMode
                ? "border-zinc-700 bg-zinc-800 text-white"
                : "border-gray-300 bg-white text-gray-900"
            }`}
          />
        </section>

        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <section className="grid gap-5 lg:grid-cols-3">
            {columns.map((column) => {
              const columnTasks = filteredTasks.filter(
                (task) => task.status === column.id
              );

              return (
                <Column
                  key={column.id}
                  column={column}
                  tasks={columnTasks}
                  darkMode={darkMode}
                >
                  {columnTasks.length > 0 ? (
                    columnTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onDelete={deleteTask}
                        onEdit={setEditingTask}
                        darkMode={darkMode}
                      />
                    ))
                  ) : (
                    <div
                      className={`rounded-2xl border border-dashed p-6 text-center text-sm ${
                        darkMode
                          ? "border-zinc-700 bg-zinc-900 text-zinc-400"
                          : "border-gray-300 bg-white/70 text-gray-500"
                      }`}
                    >
                      Arraste uma tarefa para esta coluna
                    </div>
                  )}
                </Column>
              );
            })}
          </section>
        </DndContext>

        <EditModal
          editingTask={editingTask}
          setEditingTask={setEditingTask}
          handleUpdateTask={handleUpdateTask}
          darkMode={darkMode}
        />
      </div>
    </main>
  );
}

export default App;