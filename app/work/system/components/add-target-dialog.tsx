"use client";

import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useContext, useState } from "react";
import SupabaseContext from "@/contexts/supabase";
import { useRouter } from "next/navigation";
import { FormGroupSelect } from "@/components/ui/form";

export function AddTargetDialog(props: { userId?: string; goals: Goal[] }) {
  const router = useRouter();
  const supabase = useContext(SupabaseContext);
  const { userId = "", goals } = props;

  const dialogTitle = "Create a Target to enable the system";

  const [dialogOpen, setDialogOpen] = useState(true);

  return (
    <Dialog open={dialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
        </DialogHeader>
        <MainContent />
      </DialogContent>
    </Dialog>
  );

  function MainContent() {
    const [loading, setLoading] = useState(false);
    const [intervalValue, setIntervalValue] = useState("");
    const [selectedGoal, setSelectedGoal] = useState<Goal | undefined>();

    // Handle form submit
    const handleSubmit = async (e: any) => {
      if (!userId) return;

      e.preventDefault(); // prevent the default form submit action

      const target = parseFloat(
        (document.getElementById("target-amount-input") as HTMLInputElement)
          .value
      );

      const targetValue = Number.isNaN(target) ? undefined : target;

      setLoading(true);
      await supabase.from("targets").insert({
        user_id: userId,
        goal_id: selectedGoal?.id,
        interval: intervalValue ?? "all",
        target: targetValue,
      });

      router.refresh();
      setDialogOpen(false);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mt-4">
          <RowWrapper title="Goal">
            <GoalSelectBox
              goals={goals}
              selectedGoal={selectedGoal}
              setSelectedGoal={setSelectedGoal}
            />
          </RowWrapper>
          <FormGroupSelect
            setValue={setIntervalValue}
            label="Interval"
            items={[
              { value: "day", key: "Day" },
              { value: "week", key: "Week" },
              { value: "month", key: "Month" },
              { value: "year", key: "Year" },
            ]}
          />
          <TargetInput id="target-amount-input" />
          <FormSubmitButton loading={loading} />
        </div>
      </form>
    );
  }
}

function GoalSelectBox(props: {
  goals: Goal[];
  selectedGoal?: Goal;
  setSelectedGoal: (g?: Goal) => void;
}) {
  const { goals, selectedGoal, setSelectedGoal } = props;
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[350px] justify-between"
        >
          {selectedGoal
            ? goals.find((g) => g.id === selectedGoal.id)?.title
            : "Select goal..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0 h-[350px]">
        <Command>
          <CommandInput placeholder="Search goal..." className="h-9" />
          <CommandEmpty>No Goal found.</CommandEmpty>
          <CommandGroup>
            {goals
              .toSorted((a, b) => a.title.localeCompare(b.title))
              .map((g) => (
                <CommandItem
                  key={g.id}
                  value={g.title}
                  onSelect={(title) => {
                    if (selectedGoal?.title.toLowerCase() === title) {
                      setSelectedGoal(undefined);
                      setOpen(false);
                      return;
                    }

                    const target = goals.find(
                      (g) => g.title.toLowerCase() === title
                    );
                    if (target) setSelectedGoal(target);
                    setOpen(false);
                  }}
                >
                  {g.title}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedGoal?.id === g.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function RowWrapper(props: {
  children: JSX.Element | JSX.Element[];
  title: string;
}) {
  const { title, children } = props;
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-6 items-center gap-4">
        <Label
          htmlFor={title.toLowerCase().replaceAll(" ", "-")}
          className="text-right"
        >
          {title}
        </Label>
        {children}
      </div>
    </div>
  );
}

function FormSubmitButton(props: { loading: boolean }) {
  const { loading } = props;
  return (
    <div className="flex pl-6">
      <Button type="submit" disabled={loading}>
        {loading ? <Spinner /> : "Create"}
      </Button>
    </div>
  );
}

function TargetInput(props: { id: string }) {
  const { id } = props;
  return (
    <RowWrapper title="Target">
      <Input id={id} className="col-span-5" placeholder="eg: 10" />
    </RowWrapper>
  );
}
