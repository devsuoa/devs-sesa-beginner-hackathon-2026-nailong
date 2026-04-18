import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Role } from "@/generated/prisma/enums";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { roles }: { roles: string[] } = await req.json();

  if (!roles || roles.length === 0) {
    return NextResponse.json({ error: "Select at least one role" }, { status: 400 });
  }

  const roleValues = roles.map((r) =>
    r.toUpperCase() === "DRIVER" ? Role.DRIVER : Role.RIDER
  );

  await prisma.profile.update({
    where: { id: session.user.id },
    data: {
      roles: roleValues, // set the whole array in one shot
    },
  });

  return NextResponse.json({ ok: true });
}