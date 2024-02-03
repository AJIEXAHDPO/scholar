import { GetApprenticeship } from "@/server/schema/apprenticeship";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { api } from "@/trpc/server";
import { GetUser } from "@/server/schema/user";
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "../ui/drawer";
import ProfileMenuPoint from "../profile/ProfileMenuPoint";
import { cn } from "@/lib/utils";

type Props = {
  apprts: GetApprenticeship;
};
export default async function ApprtsList(props: Props) {
  if (!props.apprts.length) {
    return (
      <div className="text-center">
        <h2 className="mt-2 text-sm font-semibold">No apprenticeships.</h2>
        <p className="mt-1 text-sm text-gray-500">
          Get started by creating a new apprenticeship!
        </p>

        <Button asChild>
          <Link href="/dash/apprts/new" className="mt-2">
            Create
          </Link>
        </Button>
      </div>
    );
  }

  const user = (await api.user.getAuthedUserWithInstitution.query()) as GetUser;
  return (
    <ul>
      {props.apprts.map((apprt, i) => {
        //const user1 = {...user, FIO: "Ivanov Alexey Vladimirovich"};
        return (
          <li key={i}><ApprenticeShip user={user} apprt={apprt} /></li>
        )
      }
      )}
    </ul>
  );
}

type apprt = GetApprenticeship[0];

const ApprenticeShip = async ({ user, apprt }: { user: GetUser, apprt: apprt }) => {
  const apprtsTypes = await api.apprts.getTypes.query();
  if (!user) return null;

  let statusColor: string;
  switch (apprt.status) {
    case "WAITING": statusColor = "text-orange-300"; break;
    case "APPROVED": statusColor = "text-green-800"; break;
    case "CLOSED": statusColor = "text-gay-400"; break;
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" className="flex justify-between w-[100%] px-10 h-[64px] items-center apprt-container bg-card">
          <div className="outer-point">
            <div className="flex flex-col items-start">
              <div>{`@${user?.username}`}</div>
              <div className="hidden profile-point-displaying font-normal">{user?.FIO}</div>
            </div>
            <div className="w-max text-sm font-normal">{apprtsTypes.find((apprt_type) => apprt_type.id === apprt.apprenticeshipTypeId)?.name}</div>
          </div>
          <div className={cn("font-medium", statusColor)}>{`${apprt.status.toLowerCase()}`}</div>
        </Button>
      </DrawerTrigger>
      <DrawerContent className="flex flex-column justify-center items-center bg-card">
        <DrawerHeader>
          <DrawerTitle>Apprenticeship Info</DrawerTitle>
          <DrawerDescription>View details</DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col items-between gap-6 px-4 max-w-96 overflow-auto">
          <ProfileMenuPoint name="FIO" value={user.FIO} />
          <ProfileMenuPoint name="University" value={user.institution?.name} />
          <ProfileMenuPoint name="Spetiality Type" value={user.specialty} />
          <ProfileMenuPoint name="Start date" value={apprt.start_date.toLocaleString("ru-RU", { day: "numeric", month: "short", year: "numeric" })} />
          <ProfileMenuPoint name="Ending date" value={apprt.end_date.toLocaleString("ru-RU", { day: "numeric", month: "short", year: "numeric" })} />
          <ProfileMenuPoint name="Referal" value={apprt.referral} />
          <ProfileMenuPoint name="Employed" value={apprt.employment_status + ""} />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

//enum Apprt_status {
//  waiting
//  closed
//  approved
//  failed
//}
