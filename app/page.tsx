"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DropArg } from "@fullcalendar/interaction";
import { crossIcon } from "./icons/icons.jsx";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { EventSourceInput } from "@fullcalendar/core/index.js";

interface Event {
  title: string;
  trainerName: string;
  customerName: string;
  start: Date | string;
  allDay: boolean;
  id: number;
}

export default function Home() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    trainerName: "",
    customerName: "",
    start: "",
    allDay: false,
    id: 0,
  });

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  function handleDateClick(arg: { date: Date; allDay: boolean }) {
    setNewEvent({
      ...newEvent,
      start: arg.date,
      allDay: arg.allDay,
      id: new Date().getTime(),
    });
    setShowModal(true);
  }

  function addEvent(data: DropArg) {
    const event = {
      ...newEvent,
      start: data.date.toISOString(),
      title: data.draggedEl.innerText,
      trainerName: newEvent.trainerName,
      customerName: newEvent.customerName,
      allDay: data.allDay,
      id: new Date().getTime(),
    };
    setAllEvents([...allEvents, event]);
  }

  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
  }

  function handleDelete() {
    setAllEvents(
      allEvents.filter((event) => Number(event.id) !== Number(idToDelete))
    );
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  function handleCloseModal() {
    setShowModal(false);
    setNewEvent({
      title: "",
      trainerName: "",
      customerName: "",
      start: "",
      allDay: false,
      id: 0,
    });
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    console.log("handleChangehere");
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    console.log("handleSubmithere");
    e.preventDefault();
    setAllEvents([...allEvents, newEvent]);
    setShowModal(false);
    setNewEvent({
      title: "",
      trainerName: "",
      customerName: "",
      start: "",
      allDay: false,
      id: 0,
    });
  }

  return (
    <>
      <nav className="flex justify-between mb-0 border-b border-blue-100 p-5">
        <h1
          className={`font-bold pl-5 pt-1 text-2xl ${
            theme === "dark" ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Calendar
        </h1>
        <button
          className={`px-5 mr-5 font-bold rounded ${
            theme === "dark"
              ? "bg-gray-800 text-gray-300"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? "Dark" : "Light"}
        </button>
      </nav>
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="w-full h-full">
          <div className="col-span-8 ">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
              headerToolbar={{
                left: "prevYear prev,next nextYear",
                center: "title",
                right: "dayGridMonth today timeGridWeek",
              }}
              events={allEvents as EventSourceInput}
              nowIndicator={true}
              editable={true}
              droppable={true}
              selectable={true}
              selectMirror={true}
              dateClick={handleDateClick}
              drop={(data) => addEvent(data)}
              eventClick={(data) => handleDeleteModal(data)}
              eventContent={(eventInfo) => (
                <div>
                  <div>{eventInfo.event.title}</div>
                  <div>{eventInfo.event.extendedProps.trainerName}</div>
                  <div>{eventInfo.event.extendedProps.customerName}</div>
                </div>
              )}
            />
          </div>
        </div>

        <Transition.Root show={showDeleteModal} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={setShowDeleteModal}
          >
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel
                    className="relative transform overflow-hidden rounded-lg
                   bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                  >
                    <div className="bg-white p-3 pt-5 pb-5">
                      <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                        <div className="flex justify-between mb-3 pr-3">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-semibold leading-6 text-gray-900"
                          >
                            Delete Event
                          </Dialog.Title>
                          <button type="button" onClick={handleCloseModal}>
                            <img src={crossIcon} width="15" height="13" />
                          </button>
                        </div>
                        <div className="mt-2">
                          <p className="text-md text-gray-500">
                            Are you sure you want to delete this event?
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end pt-6">
                        <button
                          type="button"
                          className="bg-blue-500 text-white px-3 py-1 mr-2 rounded-md"
                          onClick={handleDelete}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="bg-blue-500 text-white px-3 py-1 mr-2 rounded-md"
                          onClick={handleCloseModal}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
        <Transition.Root show={showModal} as={Fragment}>
          <Dialog as="div" className="relative z-10" onClose={setShowModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            <div className="fixed inset-0 z-10 overflow-y-auto">
              <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  enterTo="opacity-100 translate-y-0 sm:scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                  leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                >
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                    <div>
                      <div className="">
                        <div className="flex justify-between mb-3">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            Add Note
                          </Dialog.Title>
                          <button type="button" onClick={handleCloseModal}>
                            <img src={crossIcon} width="15" height="13" />
                          </button>
                        </div>
                        <form action="submit" onSubmit={handleSubmit}>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="title"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900
                            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
                            focus:ring-2
                            focus:ring-inset focus:ring-blue-300
                            sm:text-sm sm:leading-6"
                              value={newEvent.title}
                              onChange={(e) => handleChange(e)}
                              placeholder="Enter exercise name"
                            />
                            <input
                              type="text"
                              name="trainerName"
                              className="block w-full rounded-md mt-2 border-0 py-1.5 text-gray-900
                            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
                            focus:ring-2
                            focus:ring-inset focus:ring-blue-300
                            sm:text-sm sm:leading-6"
                              value={newEvent.trainerName}
                              onChange={(e) => handleChange(e)}
                              placeholder="Enter trainer name"
                            />
                            <input
                              type="text"
                              name="customerName"
                              className="block w-full rounded-md mt-2 border-0 py-1.5 text-gray-900
                            shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400
                            focus:ring-2
                            focus:ring-inset focus:ring-blue-300
                            sm:text-sm sm:leading-6"
                              value={newEvent.customerName}
                              onChange={(e) => handleChange(e)}
                              placeholder="Enter customer name"
                            />
                          </div>

                          <div className="flex justify-end pt-5">
                            <button
                              type="submit"
                              className="bg-blue-500 text-white px-3 py-1 mr-2 rounded-md"
                              disabled={
                                newEvent.title === "" &&
                                newEvent.trainerName === ""
                              }
                            >
                              Create
                            </button>
                            <button
                              type="button"
                              className="bg-blue-500 text-white px-3 py-1 rounded-md"
                              onClick={handleCloseModal}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition.Root>
      </main>
    </>
  );
}
