"use client";

import * as React from "react";
import { Switch } from "~/components/ui/switch";
import { useUser } from "~/hooks/UserContext";
import { api } from "~/trpc/react";

export default function ShowHeatmap() {
  const user = useUser();
  const utils = api.useUtils();

  const updateShowHeatmap = api.preferences.updateShowHeatmap.useMutation({
    // Optimistically update the cache for user.get
    onMutate: async () => {
      await utils.user.get.cancel();

      const previousData = utils.user.get.getData();

      // Flip showHeatmap optimistically
      utils.user.get.setData({ userId: user.user?.id ?? "" }, (old) => {
        if (!old) return old;
        return {
          ...old,
          preferences: {
            ...old.preferences,
            showHeatmap: !old.preferences.showHeatmap
          }
        };
      });

      return { previousData };
    },
    onError: (err, variables, context) => {
      // rollback cache if mutation fails
      if (context?.previousData) {
        utils.user.get.setData({ userId: user.user?.id ?? "" }, context.previousData);
      }
    },
    onSettled: async () => {
      // Always refetch after mutation finishes
      await utils.user.get.invalidate();
    },
  });


  return (
    <div className="mt-10">
      <h2 className="mt-10 mb-3 text-2xl font-semibold">Show Dashboard Heatmap</h2>
      <Switch
        checked={user.user?.preferences.showHeatmap}
        onCheckedChange={(checked) => updateShowHeatmap.mutate({ newVal: checked })}
        aria-label="Toggle switch"
      />
    </div>
  );
}
