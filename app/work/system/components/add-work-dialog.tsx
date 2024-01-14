"use client";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { getDeadline } from "@/lib/date/get-deadline";
import { localeTimestampToDbDate } from "@/lib/conversion/date";
import { useRouter } from "next/navigation";
import { FormCheckbox, FormGroupSelect } from "@/components/ui/form";

export function AddWorkDialog(props: {
  goalId?: string;
  goalTitle?: string;
  userId?: string;
  defaultDeadline?: number;
  onDbAddWork: (args: {
    duration?: number;
    title: string;
    itemId: string;
    userId: string;
    finished: boolean;
  }) => Promise<void>;
}) {
  const router = useRouter();

  const {
    goalId = "",
    goalTitle,
    userId,
    defaultDeadline,
    onDbAddWork,
  } = props;
  const [mode, setMode] = useState("");

  let title = mode
    ? mode === "goal"
      ? "Set a Goal"
      : "Add an item"
    : "Select mode";

  if (goalTitle) title += ` under ${goalTitle}`;

  return (
    <Dialog
      onOpenChange={(open) => {
        // if (!open) {
        //   setMode("");
        //   router.refresh();
        // }
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <MainContent />
      </DialogContent>
    </Dialog>
  );

  function MainContent() {
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);
    const [duration, setDuration] = useState(0.5);

    // Handle form submit
    const handleSubmit = async (e: any) => {
      if (!userId) return;

      e.preventDefault(); // prevent the default form submit action
      console.log("Submitting");

      const title = (
        document.getElementById("goal-title-input") as HTMLInputElement
      ).value;

      // update database
      setLoading(true);
      await onDbAddWork({
        title,
        userId,
        duration,
      });
      setLoading(false);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mt-4">
          <TitleFormInput id="goal-title-input" />
          <FormGroupSelect
            setValue={(value) => setDuration(parseFloat(value))}
            label="Duration"
            items={[
              { value: "0.5" },
              { value: "1" },
              { value: "1.5" },
              { value: "2" },
              { value: "2.5" },
            ]}
          />
          <FormCheckbox
            id="work-is-finished"
            title="Finished"
            setChecked={setFinished}
          />
          <FormSubmitButton loading={loading} />
        </div>
      </form>
    );
  }
}

function TitleFormInput(props: { id: string }) {
  const { id } = props;
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-6 items-center gap-4">
        <Label htmlFor="title" className="text-right">
          Title
        </Label>
        <Input id={id} className="col-span-5" />
      </div>
    </div>
  );
}

function FormSubmitButton(props: { loading: boolean }) {
  const { loading } = props;
  return (
    <div className="flex pl-6">
      <Button type="submit" disabled={loading}>
        {loading ? <Spinner /> : "Add"}
      </Button>
    </div>
  );
}
