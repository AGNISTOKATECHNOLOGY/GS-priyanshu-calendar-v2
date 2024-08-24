"use client";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DropArg } from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";
import { EventSourceInput } from "@fullcalendar/core/index.js";
import Image from "next/image";

interface Event {
  title: string;
  exerciseName: string; //Subham - Added
  trainerName: string;
  customerName: string;
  start: Date | string;
  end: Date | string; //Subham - Added
  allDay: boolean;
  id: number;
  imageUrl: string; //Subham - Added
}

export default function Home() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [newEvent, setNewEvent] = useState<Event>({
    title: "",
    exerciseName: "", //Subham - Added
    trainerName: "",
    customerName: "",
    start: "",
    end: "", //Subham - Added
    allDay: false,
    id: 0,
    imageUrl: "", //Subham - Added
  });

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  function handleDateClick(arg: { date: Date; allDay: boolean }) {
    setNewEvent({
      ...newEvent,
      start: arg.date.toISOString(),
      end: arg.date.toISOString(), //Subham - Added
      allDay: arg.allDay,
      id: new Date().getTime(),
      imageUrl: "", //Subham - Added
    });
    setShowModal(true);
  }

  function addEvent(data: DropArg) {
    const event = {
      ...newEvent, //it will handle remain
      start: data.date.toISOString(),
      end: data.date.toISOString(), //Subham - Added
      title: data.draggedEl.innerText,
      allDay: data.allDay,
      id: new Date().getTime(),
    };
    setAllEvents([...allEvents, event]); //Remain Events copy
  }

  function handleDeleteModal(data: { event: { id: string } }) {
    setShowDeleteModal(true);
    setIdToDelete(Number(data.event.id));
  }

  function handleDelete() {
    setAllEvents(
      allEvents.filter((event) => Number(event.id) !== Number(idToDelete)),
    );
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  function handleCloseModal() {
    setShowModal(false);
    setNewEvent({
      title: "",
      trainerName: "", //Subham - Added
      exerciseName: "",
      customerName: "",
      start: "",
      end: "", //Subham - Added
      allDay: false,
      id: 0,
      imageUrl: "", //Subham - Added
    });
    setShowDeleteModal(false);
    setIdToDelete(null);
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ): void => {
    const { name, value } = e.target;
    setNewEvent({
      ...newEvent,
      [name]: value,
    });
  };

  //TODO:change accordingly : later will replace with s3 url ..for now this is ok :)
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewEvent({ ...newEvent, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAllEvents([...allEvents, newEvent]);
    handleCloseModal();
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
          <div className="col-span-8">
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
                  <div>{eventInfo.event.extendedProps.exerciseName}</div>
                  <div>{eventInfo.event.extendedProps.trainerName}</div>
                  <div>{eventInfo.event.extendedProps.customerName}</div>
                  {eventInfo.event.extendedProps.imageUrl && (
                    <Image
                      src={eventInfo.event.extendedProps.imageUrl}
                      alt="Event"
                      className="w-full h-auto mt-2"
                      height={400}
                      width={400}
                    />
                  )}
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
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
                            <ExclamationTriangleIcon
                              className="h-6 w-6 text-red-600"
                              aria-hidden="true"
                            />
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
                          className="bg-red-500 text-white px-3 py-1 mr-2 rounded-md"
                          onClick={handleDelete}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="bg-gray-500 text-white px-3 py-1 mr-2 rounded-md"
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
                  <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                    <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                      <div className="sm:flex sm:items-start">
                        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-lg font-medium leading-6 text-gray-900"
                          >
                            Add Event
                          </Dialog.Title>
                          <div className="mt-2">
                            <form onSubmit={handleSubmit}>
                              <div className="mb-4">
                                <label
                                  htmlFor="title"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Title
                                </label>
                                <input
                                  type="text"
                                  id="title"
                                  name="title"
                                  value={newEvent.title}
                                  onChange={handleChange}
                                  required
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>

                              <div className="mb-4">
                                <label
                                  htmlFor="trainerName"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Trainer Name
                                </label>
                                <input
                                  type="text"
                                  id="trainerName"
                                  name="trainerName"
                                  value={newEvent.trainerName}
                                  onChange={handleChange}
                                  required
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="mb-4">
                                <label
                                  htmlFor="trainerName"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Exercise Name
                                </label>
                                <input
                                  type="text"
                                  id="exerciseName"
                                  name="exerciseName"
                                  value={newEvent.exerciseName}
                                  onChange={handleChange}
                                  required
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>
                              <div className="mb-4">
                                <label
                                  htmlFor="customerName"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Customer Name
                                </label>
                                <input
                                  type="text"
                                  id="customerName"
                                  name="customerName"
                                  value={newEvent.customerName}
                                  onChange={handleChange}
                                  required
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>

                              <div className="mb-4">
                                <label
                                  htmlFor="start"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Start Time
                                </label>
                                <input
                                  type="datetime-local"
                                  id="start"
                                  name="start"
                                  value={newEvent.start as string}
                                  onChange={handleChange}
                                  required
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>

                              <div className="mb-4">
                                <label
                                  htmlFor="end"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  End Time
                                </label>
                                <input
                                  type="datetime-local"
                                  id="end"
                                  name="end"
                                  value={newEvent.end as string}
                                  onChange={handleChange}
                                  required
                                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                />
                              </div>

                              <div className="mb-4">
                                <label
                                  htmlFor="image"
                                  className="block text-sm font-medium text-gray-700"
                                >
                                  Image
                                </label>
                                <input
                                  type="file"
                                  id="image"
                                  name="image"
                                  accept="image/*"
                                  onChange={handleFileChange}
                                  className="mt-1 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
                                />
                              </div>

                              <div className="flex justify-end">
                                <button
                                  type="submit"
                                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                >
                                  Add Event
                                </button>
                                <button
                                  type="button"
                                  className="ml-4 inline-flex justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                  onClick={handleCloseModal}
                                >
                                  Cancel
                                </button>
                              </div>
                            </form>
                          </div>
                        </div>
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
