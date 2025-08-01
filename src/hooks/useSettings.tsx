"use client";

import { type ColourType } from "@prisma/client";
import { api } from "~/trpc/react";
import { useUser } from "./UserContext";
import { useLogs, type AddLogT } from "./LogsContext";

interface UseSettingsT {
  createSubject: (name: string, colour: ColourType, order: number) => void;
  deleteSubject: (subjectId: string) => void;
  updateSubject: (
    subjectId: string,
    newName?: string,
    newColour?: string,
  ) => void;
  updateGoal: (newGoal: number) => void;
  addLog: ({ subjectId, duration, description, startedAt }: AddLogT) => void;
}
export const useSettings = (): UseSettingsT => {
  const utils = api.useUtils();
  const user = useUser();
  const logs = useLogs();

  const createSubject = api.settings.createSubject.useMutation({
    onMutate: async (newSubject) => {
      const userId = user.user?.id;
      if (!userId) {
        throw new Error("userId is undefined");
      }
      await utils.user.get.cancel(); // cancel any outgoing fetches
      const previousUser = utils.user.get.getData();
      utils.user.get.setData({ userId }, (oldUser) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          subjects: [
            ...oldUser.subjects,
            {
              id: "temp-id-" + Math.random(),
              userId,
              createdAt: new Date(),
              updatedAt: new Date(),
              name: newSubject.name,
              colour: newSubject.colour,
              order: newSubject.order ?? 0,
            },
          ],
        };
      });
      return { previousUser };
    },
    onError: (_err, _newSubject, context) => {
      if (context?.previousUser && user.user?.id) {
        utils.user.get.setData({ userId: user.user?.id }, context.previousUser);
      }
    },
    onSettled: async () => {
      await utils.user.get.invalidate();
    },
  });

  const deleteSubject = api.settings.deleteSubject.useMutation({
    onMutate: async (deleteSubject) => {
      const userId = user.user?.id;
      if (!userId) {
        throw new Error("userId is undefined");
      }
      await utils.user.get.cancel(); // cancel any outgoing fetches
      const previousUser = utils.user.get.getData();
      utils.user.get.setData({ userId }, (oldUser) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          subjects: oldUser.subjects.filter(
            (oldSubject) => oldSubject.id !== deleteSubject.subjectId,
          ),
        };
      });
      return { previousUser };
    },
    onError: (_err, _newSubject, context) => {
      if (context?.previousUser && user.user?.id) {
        utils.user.get.setData({ userId: user.user?.id }, context.previousUser);
      }
    },
    onSettled: async () => {
      await utils.user.get.invalidate();
    },
  });

  const updateSubject = api.settings.updateSubject.useMutation({
    onMutate: async (updateSubject) => {
      const userId = user.user?.id;
      if (!userId) {
        throw new Error("userId is undefined");
      }
      await utils.user.get.cancel(); // cancel any outgoing fetches
      const previousUser = utils.user.get.getData();
      utils.user.get.setData({ userId }, (oldUser) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          subjects: oldUser.subjects.map((oldSubject) =>
            oldSubject.id === updateSubject.subjectId
              ? {
                  ...oldSubject,
                  name: updateSubject.newName ?? oldSubject.name,
                  colour: updateSubject.newColour ?? oldSubject.colour,
                }
              : oldSubject,
          ),
        };
      });
      return { previousUser };
    },
    onError: (_err, _newSubject, context) => {
      if (context?.previousUser && user.user?.id) {
        utils.user.get.setData({ userId: user.user?.id }, context.previousUser);
      }
    },
    onSettled: async () => {
      await utils.user.get.invalidate();
    },
  });

  const updateGoal = api.settings.updateGoal.useMutation({
    onMutate: async (updateGoal) => {
      const userId = user.user?.id;
      if (!userId) {
        throw new Error("userId is undefined");
      }
      await utils.user.get.cancel(); // cancel any outgoing fetches
      const previousUser = utils.user.get.getData();
      utils.user.get.setData({ userId }, (oldUser) => {
        if (!oldUser) return oldUser;
        return {
          ...oldUser,
          goal: updateGoal.newGoal,
        };
      });
      return { previousUser };
    },
    onError: (_err, _newSubject, context) => {
      if (context?.previousUser && user.user?.id) {
        utils.user.get.setData({ userId: user.user?.id }, context.previousUser);
      }
    },
    onSettled: async () => {
      await utils.user.get.invalidate();
    },
  });

  function onCreateSubject(name: string, colour: ColourType, order: number) {
    createSubject.mutate({ name, colour, order });
  }
  function onDeleteSubject(subjectId: string) {
    deleteSubject.mutate({ subjectId });
  }
  function onUpdateSubject(
    subjectId: string,
    newName?: string,
    newColour?: string,
  ) {
    // const colourArray = Object.values(ColourType) as ColourType[];
    // if (!newColour || !colourArray.includes(newColour as ColourType)) {
    //     throw new Error("newColour is invalid");
    // }
    // TODO: Add validation
    updateSubject.mutate({
      subjectId,
      newName,
      newColour: newColour as ColourType,
    });
  }
  function onUpdateGoal(newGoal: number) {
    updateGoal.mutate({ newGoal });
  }
  function onAddLog(newLog: AddLogT) {
    logs.addLog(newLog);
  }

  return {
    createSubject: onCreateSubject,
    deleteSubject: onDeleteSubject,
    updateSubject: onUpdateSubject,
    updateGoal: onUpdateGoal,
    addLog: onAddLog,
  };
};
