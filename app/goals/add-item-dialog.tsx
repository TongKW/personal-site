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
import { useContext, useState } from "react";
import { getDeadline } from "@/lib/date/get-deadline";
import { localeTimestampToDbDate } from "@/lib/conversion/date";
import { useRouter } from "next/navigation";
import SupabaseContext from "@/contexts/supabase";
import { FormGroupSelect, FormTextInput } from "@/components/ui/form";

export function AddItemDialogButton(props: {
  goalId?: string;
  goalTitle?: string;
  userId?: string;
  defaultDeadline?: number;
}) {
  const supabase = useContext(SupabaseContext);
  const router = useRouter();

  const { goalId = "", goalTitle, userId, defaultDeadline } = props;
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
        if (!open) {
          setMode("");
          router.refresh();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" className="shadow-md">
          +
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <MainContent />
      </DialogContent>
    </Dialog>
  );

  function MainContent() {
    if (!mode) {
      return (
        <div className="flex flex-col w-full">
          <div className="flex py-5 items-center justify-center gap-4 w-full">
            <Button onClick={() => setMode("goal")}>Goal</Button>
            or
            <Button onClick={() => setMode("item")}>Item</Button>
          </div>
        </div>
      );
    } else if (mode === "goal") {
      return <AddGoalContent />;
    } else {
      return <AddItemContent />;
    }
  }

  function AddGoalContent() {
    const [loading, setLoading] = useState(false);
    const [isRecurrent, setRecurrent] = useState(false);
    const [deadlineKey, setDeadlineKey] = useState("");

    // Handle form submit
    const handleSubmit = async (e: any) => {
      if (!userId) return;

      e.preventDefault(); // prevent the default form submit action

      const title = (
        document.getElementById("goal-title-input") as HTMLInputElement
      ).value;

      // update database
      setLoading(true);
      await supabase.from("goals").insert({
        user_id: userId,
        recurrent: isRecurrent,
        is_root: !Boolean(goalId),
        title: title,
        deadline: localeTimestampToDbDate(
          getDeadline(deadlineKey) ?? defaultDeadline
        ),
        parent_goal_id: goalId ? goalId : undefined,
      });

      setLoading(false);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mt-4">
          <FormTextInput id="goal-title-input" label="Title" />
          <DeadlineSelect setValue={setDeadlineKey} />
          <FormCheckbox
            id="goal-is-recurrent"
            title="Recurrent"
            setChecked={setRecurrent}
          />
          <FormSubmitButton loading={loading} />
        </div>
      </form>
    );
  }

  function AddItemContent() {
    // Set up the form state
    const [loading, setLoading] = useState(false);
    const [deadlineKey, setDeadlineKey] = useState("");
    const [finished, setFinished] = useState(false);

    // Handle form submit
    const handleSubmit = async (e: any) => {
      if (!userId) return;
      e.preventDefault(); // prevent the default form submit action

      const title = (
        document.getElementById("goal-item-title-input") as HTMLInputElement
      ).value;

      // update database
      setLoading(true);
      await supabase.from("items").insert({
        user_id: userId,
        title: title,
        finished: finished,
        deadline: localeTimestampToDbDate(
          getDeadline(deadlineKey) ?? defaultDeadline
        ),
        goal_id: goalId,
      });
      setLoading(false);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mt-4">
          <FormTextInput id="goal-item-title-input" label="Title" />
          <DeadlineSelect setValue={setDeadlineKey} />
          <FormCheckbox
            id="item-is-finished"
            title="Finished"
            setChecked={setFinished}
          />
          <FormSubmitButton loading={loading} />
        </div>
      </form>
    );
  }
}

function FormCheckbox(props: {
  id: string;
  title: string;
  setChecked?: (checked: boolean) => void;
}) {
  const { id, title, setChecked } = props;
  return (
    <div className="grid grid-cols-6 items-center gap-4 mb-4">
      <div className="text-right">{title}</div>
      <div className="flex col-span-5">
        <Checkbox
          id={id}
          onCheckedChange={(checked) =>
            setChecked?.(Boolean(checked.valueOf()))
          }
        />
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

function DeadlineSelect(props: { setValue?: (value: string) => void }) {
  const { setValue } = props;
  return (
    <FormGroupSelect
      setValue={setValue}
      label="Deadline"
      items={[
        { value: "day", key: "Day" },
        { value: "week", key: "Week" },
        { value: "month", key: "Month" },
        { value: "year", key: "Year" },
        { value: "none", key: "None" },
      ]}
    />
  );
}
