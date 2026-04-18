import { type NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { Role } from "@/generated/prisma/enums";
import { parseUser } from "@/lib/utils";

export async function GET() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

  const parsedUser = parseUser(user)

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

	return NextResponse.json({ user: parsedUser, profile });
}

export async function PATCH(req: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { displayName, isRider, isDriver } = await req.json();

  if (!isRider && !isDriver) {
    return NextResponse.json(
      { error: "You must keep at least one role" },
      { status: 400 }
    );
  }

  // Build roles array from the booleans the frontend sends
  const roles: Role[] = [
    ...(isRider ? [Role.RIDER] : []),
    ...(isDriver ? [Role.DRIVER] : []),
  ];

  const profile = await prisma.profile.update({
    where: { id: session.user.id },
    data: {
      ...(displayName !== undefined && { displayName }),
      roles,
      // Create nested profiles if newly enabled
      ...(isRider && {
        rider: {
          connectOrCreate: {
            where: { profileId: session.user.id },
            create: {},
          },
        },
      }),
      ...(isDriver && {
        driver: {
          connectOrCreate: {
            where: { profileId: session.user.id },
            create: { vesselName: "Unnamed Vessel", vesselType: "SHUTTLE" },
          },
        },
      }),
    },
    include: { rider: true, driver: true },
  });

  return NextResponse.json({ profile });
}