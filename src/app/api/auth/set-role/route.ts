import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";

export async function POST(req: NextRequest) {
  const { role } = await req.json();
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const roleValue = role === "driver" ? Role.DRIVER : Role.RIDER;

  const profile = await prisma.profile.findUnique({
    where: { id: session.user.id },
    select: { roles: true },
  });

  const updatedRoles = Array.from(
    new Set([...(profile?.roles ?? []), roleValue]),
  );

  await prisma.profile.update({
    where: { id: session.user.id },
    data: {
      roles: updatedRoles, // set the whole array
    },
  });

  return NextResponse.json({ ok: true });
}
