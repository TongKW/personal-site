"use client";

import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
  FormCheckbox,
  FormGroupSelect,
  FormTextInput,
} from "@/components/ui/form";
import { IntermediateWork } from "./progress-ring";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

export function AddWorkDialog(props: {
  items: GoalItem[];
  open: boolean;
  setOpen: (open: boolean) => void;
  userId?: string;
  onAddWork: (args: { work: IntermediateWork; startClock: boolean }) => void;
}) {
  const { items, open, setOpen, userId, onAddWork } = props;

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[600px]"
        onClose={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Add a new Work</DialogTitle>
        </DialogHeader>
        <MainContent />
      </DialogContent>
    </Dialog>
  );

  function MainContent() {
    const [loading, setLoading] = useState(false);
    const [fastForward, setFastForward] = useState(false);
    const [duration, setDuration] = useState(30);
    const [selectedItem, setSelectedItem] = useState<GoalItem>();

    // Handle form submit
    const handleSubmit = async (e: any) => {
      if (!userId) return;
      if (!selectedItem) return;

      e.preventDefault(); // prevent the default form submit action

      const title = (
        document.getElementById("work-title-input") as HTMLInputElement
      ).value;

      // update database
      setLoading(true);
      onAddWork({
        work: {
          duration,
          title,
          itemId: selectedItem.id,
          userId,
          itemTitle: selectedItem.title,
        },
        startClock: !fastForward,
      });
      setLoading(false);
      setOpen(false);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mt-4">
          <FormTextInput id="work-title-input" label="Title" />
          <RowWrapper title="Goal item">
            <GoalItemSelectBox
              items={items}
              selectedItem={selectedItem}
              setSelectedItem={setSelectedItem}
            />
          </RowWrapper>

          <FormGroupSelect
            setValue={(value) => setDuration(parseFloat(value))}
            label="Duration"
            items={[
              { value: "5" },
              { value: "30" },
              { value: "60" },
              { value: "90" },
              { value: "120" },
              { value: "150" },
            ]}
          />
          <FormCheckbox
            id="fast-forward-clock"
            title="Fast Forward"
            setChecked={setFastForward}
          />
          <FormSubmitButton loading={loading} />
        </div>
      </form>
    );
  }
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
        {loading ? <Spinner /> : "Add"}
      </Button>
    </div>
  );
}

function GoalItemSelectBox(props: {
  items: GoalItem[];
  selectedItem?: GoalItem;
  setSelectedItem: (itemId?: GoalItem) => void;
}) {
  const { items, selectedItem, setSelectedItem } = props;
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[450px] justify-between overflow-hidden"
        >
          {selectedItem
            ? getTitle(items.find((i) => i.id === selectedItem.id))
            : "Select goal item..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[350px] p-0 h-[350px]">
        <Command>
          <CommandInput placeholder="Search item..." className="h-9" />
          <CommandEmpty>No Item found.</CommandEmpty>
          <CommandGroup className="overflow-scroll">
            {items
              .toSorted((a, b) => getTitle(a).localeCompare(getTitle(b)))
              .map((item) => (
                <CommandItem
                  key={item.id}
                  value={getTitle(item)}
                  onSelect={(title) => {
                    if (getTitle(item) === title) {
                      setSelectedItem(undefined);
                      setOpen(false);
                      return;
                    }
                    const target = items.find(
                      (item) => getTitle(item).toLowerCase() === title
                    );
                    if (target) setSelectedItem(target);
                    setOpen(false);
                  }}
                >
                  {getTitle(item)}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedItem?.id === item.id ? "opacity-100" : "opacity-0"
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

function getTitle(item?: GoalItem) {
  if (!item) return "";
  return (
    (item.parentGoalTitle ? `[${item.parentGoalTitle}] ` : "") + item.title
  );
}
