import { Spinner } from "@/components/Spinner";
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
import { getDeadline } from "@/lib/date/getDeadline";

export function AddItemDialogButton(props: { goalId: string }) {
  const { goalId } = props;
  const [mode, setMode] = useState("");

  const title = mode
    ? mode === "goal"
      ? "Set a Goal"
      : "Add an item"
    : "Select mode";

  return (
    <Dialog
      onOpenChange={(open) => {
        if (!open) setMode("");
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline">+</Button>
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
    const handleSubmit = (e: any) => {
      e.preventDefault(); // prevent the default form submit action
      console.log("Submitting");

      const title = (
        document.getElementById("goal-title-input") as HTMLInputElement
      ).value;

      console.log(`deadlineKey: ${deadlineKey}`);

      console.log({
        parentGoalId: goalId,
        title: title,
        isRecurrent: isRecurrent,
        deadline: getDeadline(deadlineKey),
      });

      setLoading(true);
      // TODO: update database
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mt-4">
          <TitleFormInput id="goal-title-input" />
          <DeadlineSelect setValue={setDeadlineKey} />
          <div className="grid grid-cols-6 items-center gap-4 mb-4">
            <div className="text-right">Recurrent</div>
            <div className="flex col-span-5">
              <Checkbox
                id="goal-is-recurrent"
                onCheckedChange={(checked) =>
                  setRecurrent(Boolean(checked.valueOf()))
                }
              />
            </div>
          </div>
          <FormSubmitButton loading={loading} />
        </div>
      </form>
    );
  }

  function AddItemContent() {
    // Set up the form state
    const [loading, setLoading] = useState(false);
    const [deadlineKey, setDeadlineKey] = useState("");

    // Handle form submit
    const handleSubmit = (e: any) => {
      e.preventDefault(); // prevent the default form submit action
      console.log("Submitting");

      const title = (
        document.getElementById("goal-item-title-input") as HTMLInputElement
      ).value;

      setLoading(true);
      // TODO: update database
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mt-4">
          <TitleFormInput id="goal-item-title-input" />
          <DeadlineSelect setValue={setDeadlineKey} />
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

function DeadlineSelect(props: { setValue?: (value: string) => void }) {
  const { setValue } = props;
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-6 items-center gap-4">
        <Label htmlFor="deadline" className="text-right">
          Deadline
        </Label>
        <Select onValueChange={(value) => setValue?.(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Choose deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Deadline</SelectLabel>
              <SelectItem value="day">Day</SelectItem>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="none">None</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
