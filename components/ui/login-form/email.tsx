"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import SupabaseContext from "@/contexts/supabase";
import { useContext } from "react";
import { signInWithEmail } from "@/lib/supabase/login/email-password";

const FormSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export function EmailLoginForm(props: {
  onEmailLogin?: (args: { email: string; password: string }) => void;
}) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    props.onEmailLogin?.({ email: data.email, password: data.password });
  }

  return (
    <Form {...form}>
      <form
        // onSubmit={form.handleSubmit(onSubmit)}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-6 items-start"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Email" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Password" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Go</Button>
      </form>
    </Form>
  );
}

export function SupabaseEmailLoginForm() {
  const supabase = useContext(SupabaseContext);

  return (
    <EmailLoginForm
      onEmailLogin={async ({ email, password }) => {
        const { data, error } = await signInWithEmail({
          supabase,
          email,
          password,
        });
        console.log(data);
        console.log(error);
      }}
    />
  );
}
