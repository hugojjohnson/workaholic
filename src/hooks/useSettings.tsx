"use client";

import type { ColourType } from "@prisma/client";
import { api } from "~/trpc/react";
import { useUser } from "./UserContext";

interface AddLogT {
    subjectId: string,
    duration: number,
    description: string,
    startedAt: string,
}
interface UseSettingsT {
    createSubject: () => void;
    deleteSubject: (subjectId: string) => void;
    updateSubject: (subjectId: string, newName?: string, newColour?: ColourType) => void;
    updateGoal: (newGoal: number) => void;
    addLog: ({
        subjectId,
        duration,
        description,
        startedAt,
    }: AddLogT) => void;
}
export const useSettings = (): UseSettingsT => {
    // const utils = api.useUtils();
    // const user = useUser();
    // console.log(user.user.name)

    // const createSubject = api.settings.createSubject.useMutation({
    //     onMutate: async (newSubject) => {
    //         await utils.subjects.cancel(); // cancel any outgoing fetches

    //         const previousSubjects = utils.subjects.getData();

    //         utils.subjects.setData((old = []) => [
    //             ...old,
    //             {
    //                 id: "temp-id-" + Math.random(),
    //                 name: newSubject.name,
    //                 colour: newSubject.colour,
    //                 order: newSubject.order ?? 0,
    //             },
    //         ]);

    //         return { previousSubjects };
    //     },
    //     onError: (_err, _newSubject, context) => {
    //         if (context?.previousSubjects) {
    //             utils.subjects.setData(context.previousSubjects);
    //         }
    //     },
    //     onSettled: () => {
    //         utils.subjects.invalidate();
    //     },
    // })


    // // if (!context) {
    // //     throw new Error("useTimer must be used within a TimerProvider");
    // // }
    // // return context;
    // return {
    //     hi: "hi"
    // }
};