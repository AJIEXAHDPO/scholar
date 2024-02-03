import Heading from "@/components/ui/heading";
import { api } from "@/trpc/server";
import ProfileInfo from "@/components/profile/ProfileInfo";
import ApprtsList from "@/components/apprts/List";
import { GetUser } from "@/server/schema/user";
import { ChevronDownIcon } from "lucide-react"

export default async function Profile() {

  const apprts = await api.apprts.getApprenticeships.query();
  const user = (await api.user.getAuthedUserWithInstitution.query()) as GetUser;
  if (!user) return null;
  const apprtsCurrent = await api.apprts.getApprenticeshipById.query({user_id: user.telegram_id});
  const current = apprtsCurrent ? [apprtsCurrent] : [];

  return (
    <>
      <br />
      <Heading
        title="My Profile"
        description=""
      ></Heading>
      <div className="grid grid-flow-row md:grid-cols-7 gap-6">
        <ProfileInfo user={user} />
        <div className="flex flex-col gap-2 md:gap-4 md:col-span-4">
          <h1 className="pl-4 text-xl font-semibold">Current Apprenticeship</h1>
          <ApprtsList apprts={apprtsCurrent ? [apprtsCurrent] : []} />
          <div className="flex flex-row pt-10">
            <h1 className="pl-4 text-xl font-semibold">View Apprenticeship History </h1>
            <ChevronDownIcon />
          </div>
          <ApprtsList apprts={apprts}/>
        </div>
      </div>
    </>
  );
}
