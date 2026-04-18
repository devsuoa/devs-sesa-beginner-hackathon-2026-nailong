import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const bookings = await prisma.booking.findMany({
    where: {
      status: "PENDING",
      driverId: null,       // not yet claimed by anyone
    },
    include: {
      origin: true,
      destination: true,
    },
    orderBy: { createdAt: "asc" }, // oldest first — fair queue
  });

  return NextResponse.json({ bookings });
}