"use client";

import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import autoAnimate from "@formkit/auto-animate";
import { api } from "@/trpc/react";
import Container from "../ui/container";
import { Institution } from "@prisma/client";
import InstitutionCreateForm from "./InstitutionCreateForm";
import { toast } from "../ui/use-toast";

const InstitutionList = () => {
  const parent = useRef(null);

  const [open, setOpen] = useState(false);

  useEffect(() => {
    parent.current && autoAnimate(parent.current);
  }, [parent]);

  const institutionList = api.institutions.getInstitutions.useQuery();

  const institutionRemove = api.institutions.removeInstitution.useMutation({
    onMutate: () => {
      toast({
        title: '🔄 Removing...',
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
        description: 'Institution removed'
      })
      institutionList.refetch()
    },
  });

  const removeInstitution = (institutionId: string) => {
    if (confirm("Are you shure?"))
      institutionRemove.mutate({ id: institutionId });
  };

  return (
    <Container className="flex-col gap-4">
      <div>Institutions</div>
      {institutionList.data && institutionList.data.length > 0 ? (
        <>
          <ul>
            {institutionList.data.map((institution: Institution) => (
              <li
                className="flex flex-row items-center justify-between overflow-hidden pl-10 dark:border-none"
                key={institution.id}
              >
                <div>{institution.name}</div>
                <Button
                  variant="ghost"
                  className="hover:bg-secondary"
                  onClick={() => removeInstitution(institution.id)}
                >
                  x
                </Button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="text-center font-medium">Still No Institutions Yet</div>
      )}
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button>Add</Button>
        </DrawerTrigger>
        <DrawerContent className="flex flex-col items-center">
          <DrawerHeader>
            <DrawerTitle>New Institution</DrawerTitle>
            <DrawerDescription>
              {"Make changes to your profile here. Click save when you're done."}
            </DrawerDescription>
          </DrawerHeader>
          <InstitutionCreateForm
            onCreate={() => {
              institutionList.refetch();
              setOpen(false);
            }}
          />
          <DrawerFooter>
            <DrawerClose asChild>
              <Button className="w-72" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Container>
  );
};

export default InstitutionList;
