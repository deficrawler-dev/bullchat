import { notFound } from "next/navigation";
import { RoomPage } from "@/components/rooms/RoomPage";

interface RoomRouteProps {
  params: Promise<{
    slug: string;
  }>;
}

const SUPPORTED_ROOMS = [
  "ansem-community",
  "bull-community",
  "builders",
  "job-board",
  "market-talk",
  "meme-studio",
  "launchpad-hub",
  "community-support",
  "wins-losses",
  "off-topic",
];

export default async function RoomRoute({ params }: RoomRouteProps) {
  const { slug } = await params;

  if (!SUPPORTED_ROOMS.includes(slug)) {
    notFound();
  }

  return <RoomPage slug={slug} />;
}