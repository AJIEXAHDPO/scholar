import AuthForm from "@/components/auth/AuthForm";
import { GetUser } from "@/server/schema/user";
import { api } from "@/trpc/server";

const AuthPage = async () => {
    const data = await api.institutions.getInstitutions.query();
    const apprenticeshipTypes = await api.apprts.getTypes.query();
    const user = (await api.user.getAuthedUserWithInstitution.query()) as GetUser;
    return <>
        <AuthForm
            institutions={data}
            apprenticeshipTypes={apprenticeshipTypes}
            user={user}
        />
    </>
}
export default AuthPage;