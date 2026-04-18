import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null }, { status: 401 });
  }

  const profile = await prisma.profile.findUnique({
    where: { id: user.id },
    include: {
      rider: true,
      driver: true,
    },
  });

  return NextResponse.json({ user, profile });
}