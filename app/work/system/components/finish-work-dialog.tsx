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

export function FinishWorkDialog(props: {
  open: boolean;
  setOpen: (open: boolean) => void;
  userId?: string;
  onFinishWork: (itemFinished: boolean) => Promise<void>;
}) {
  const { open, setOpen, userId, onFinishWork } = props;

  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[600px]"
        onClose={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>TODO: change this</DialogTitle>
        </DialogHeader>
        <MainContent />
      </DialogContent>
    </Dialog>
  );

  function MainContent() {
    const [loading, setLoading] = useState(false);
    const [finished, setFinished] = useState(false);

    // Handle form submit
    const handleSubmit = async (e: any) => {
      if (!userId) return;

      e.preventDefault(); // prevent the default form submit action
      console.log("Submitting");

      // update database
      setLoading(true);
      await onFinishWork(finished);
      setOpen(false);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4 mt-4">
          <FormCheckbox
            id="goal-item-is-finished"
            title="Finished"
            setChecked={setFinished}
          />
          <FormSubmitButton loading={loading} />
        </div>
      </form>
    );
  }
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
