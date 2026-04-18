import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

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

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { displayName, isRider, isDriver } = await req.json();

  // Must keep at least one role
  if (isRider === false && isDriver === false) {
    return NextResponse.json(
      { error: "You must keep at least one role" },
      { status: 400 }
    );
  }

  const profile = await prisma.profile.update({
    where: { id: user.id },
    data: {
      ...(displayName !== undefined && { displayName }),
      ...(isRider !== undefined && { isRider }),
      ...(isDriver !== undefined && { isDriver }),
      // Keep primary role in sync
      ...(isRider !== undefined &&
        isDriver !== undefined && {
          role: isRider ? "RIDER" : "DRIVER",
        }),
      // Create nested profiles if newly toggled on
      ...(isRider === true && {
        rider: {
          connectOrCreate: {
            where: { profileId: user.id },
            create: {},
          },
        },
      }),
      ...(isDriver === true && {
        driver: {
          connectOrCreate: {
            where: { profileId: user.id },
            create: { vesselName: "Unnamed Vessel", vesselType: "SHUTTLE" },
          },
        },
      }),
    },
    include: { rider: true, driver: true },
  });

  return NextResponse.json({ profile });
}