import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useEffect, useId, useRef } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";
import { Institution, InstitutionForm, institutionSchema, institutionSchemaForm } from "@/server/schema/institution";
import { toast } from "../ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

const InstitutionEditForm = ({ onCreate, data }: { onCreate: Function, data: Institution }) => {
    const parent = useRef(null);

    useEffect(() => {
        parent.current && autoAnimate(parent.current);
    }, [parent]);

    const form = useForm<Institution>({
        resolver: zodResolver(institutionSchema),
        defaultValues: {
            id: data.id,
            name: data.name,
        },
        reValidateMode: "onChange"
    });

    const institutionEditMutation = api.institutions.updateInstitution.useMutation({
        onMutate: () => {
            toast({
                title: '🔄 Updating...',
            })
        },
        onError: (e) => {
            toast({
                title: '🚫 Error',
                description: e.message
            })
        },
        onSuccess: () => {
            toast({
                title: '✅ Success',
                description: 'Institution updated'
            })
            onCreate()
        },
    })


    function handleSubmit(data: Institution): void {
        institutionEditMutation.mutate(data);
    }

    return <Form {...form}>
        <form autoComplete="off" className="flex flex-col w-72 gap-2" onSubmit={form.handleSubmit(handleSubmit)} ref={parent}>
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <Input autoComplete="off" aria-autocomplete="none" placeholder="name" {...field} />
                    </FormItem>
                )} />
            <Button type="submit">{institutionEditMutation.isLoading ? "Submitting..." : "Submit"}</Button>
        </form>
    </Form>
}

export default InstitutionEditForm;