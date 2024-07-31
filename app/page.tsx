'use client'

import React, { useState, useEffect } from "react";
import { MdDone, MdDeleteOutline } from "react-icons/md";
import { Transition } from '@headlessui/react';
import { CiUndo } from "react-icons/ci";
import Link from "next/link";

export default function Home() {
  const [task, setTask] = useState('');
  const [listTask, setListTask] = useState<{ id: number; task: string; completed: boolean }[]>([]);
  const [filter, setFilter] = useState('all');
  const [showNotification, setShowNotification] = useState(false);
  const [showDeleteNotification, setShowDeleteNotification] = useState(false);

  const status = [
    {
      label: 'All',
      name: 'all'
    },
    {
      label: 'Active',
      name: 'active'
    },
    {
      label: 'Completed',
      name: 'completed',
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      const newTask = {
        id: Date.now(),
        task,
        completed: false,
      };
      setListTask([...listTask, newTask]);
      setTask('');
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 1000);
    }
  };

  const capitalizeFirstLetter = (value: string) => {
    return value.charAt(0).toUpperCase() + value.slice(1);
  };

  const toggleTaskCompletion = (id: number) => {
    setListTask(
      listTask.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setListTask(listTask.filter((task) => task.id !== id));
  };

  const filteredTasks = listTask.filter(task => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-16">
      <div className="p-5 text-center grid">
        <span className="text-5xl font-bold text-slate-500 italic">Soto-List</span>
        <span className="text-sm font-bold text-slate-400 italic">
          save our todo list |
          <Link href="https://dhian-app.vercel.app/" target="_blank">
            <span className="hover:text-gray-200 ml-1">dhianharyono</span>
          </Link>
        </span>
      </div>

      <div className="pt-10 w-full text-center grid gap-5">
        {/* Form Input Task */}
        <form onSubmit={handleSubmit} className="flex gap-2 justify-self-center">
          <input
            type="text"
            value={task}
            className="flex-1 p-2 rounded-l-xl text-slate-900"
            placeholder="Add a new task"
            onChange={(e) => setTask(e.target.value)}
          />
          <button type="submit" className="bg-slate-800 text-white px-4 py-2 rounded-r-xl">Add</button>
        </form>

        {/* Filter Task */}
        <div className="flex gap-2 justify-self-center mt-12 mb-5">
          {listTask.length !== 0 && status.map((value, id) => (
            <button
              key={id}
              className={`px-4 py-2 ${filter===value.name ? 'bg-neutral-200 text-black' : 'bg-neutral-800 text-neutral-200'} rounded-xl`}
              onClick={() => setFilter(value.name)}
            >
              {value.label}
            </button>
          ))}
        </div>

        {/* List Task */}
        {filteredTasks.map((taskItem) => (
          <div
            key={taskItem.id}
            className={`
              ${taskItem.completed ? 'bg-green-500' : 'bg-slate-900'}
              shadow-md shadow-slate-800 border border-solid rounded-full place-content-center px-5 py-3 justify-between flex border-transparent w-full lg:w-[500px] justify-self-center
            `}
          >
            <p className={`${taskItem.completed ? 'text-black' : ''}`}>
              {capitalizeFirstLetter(taskItem.task)}
            </p>
            <div className="flex gap-3">
              {taskItem.completed ?
                <CiUndo
                  size={25}
                  color={"black"}
                  className="cursor-pointer"
                  onClick={() => toggleTaskCompletion(taskItem.id)}
                /> :
                <MdDone
                  size={25}
                  color={"#00C55E"}
                  className="cursor-pointer"
                  onClick={() => toggleTaskCompletion(taskItem.id)}
                />
              }
              <MdDeleteOutline
                className="cursor-pointer"
                size={25}
                color="#EF4444"
                onClick={() => deleteTask(taskItem.id)}
              />
            </div>
          </div>
        ))}

        <Transition
          show={showNotification}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed top-5 right-5 bg-green-500 text-white p-4 rounded">
            Task added successfully!
          </div>
        </Transition>
      </div>
    </main>
  );
}
