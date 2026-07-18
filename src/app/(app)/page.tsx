import { RoomList } from "@/components/rooms/RoomList";

export default function HomePage() {
  return (
    <section
      aria-labelledby="rooms-heading"
      className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-4 sm:p-6"
    >
      <h1 id="rooms-heading" className="text-h3 font-semibold text-fg">
        Rooms
      </h1>
      <RoomList />
    </section>
  );
}