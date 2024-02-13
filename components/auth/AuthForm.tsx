"use client";
import { useState } from "react"
import ApprtsForm from "../apprts/Form"
import ProfileEditForm from "../profile/ProfileEditForm"
import Heading from "../ui/heading"
import { api } from "@/trpc/react"
import { GetUser } from "@/server/schema/user"
import { ApprenticeshipType, Institution } from "@prisma/client"
import { router } from "@trpc/server"
import { useRouter } from "next/navigation"
import { Loader } from "lucide-react";

const AuthForm = (props: {
    institutions: Institution[];
    user: GetUser;
    apprenticeshipTypes: ApprenticeshipType[];
}) => {
    const [stage, setStage] = useState(1);
    const router = useRouter();
    return <>
        <Heading title="Register" description={`Fill out these forms ${stage}/2`} />
        <div className="grid gap-4">
            {stage === 1 && <ProfileEditForm institutions={props.institutions} user={props.user} />}
            {stage === 2 && <ApprtsForm apprenticeshipTypes={props.apprenticeshipTypes} />}
        </div>
    </>
}

export default AuthForm;