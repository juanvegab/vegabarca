"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import LoadingButton from "./ui/loading-button";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Education } from "@prisma/client";
import { ChangeEvent, useState } from "react";

const educationSchema = z.object({
  institution: z.string().min(1, "Required"),
  degree: z.string().min(1, "Required"),
  period: z.string().min(1, "Required"),
  logo: z.string().optional(),
  highlight: z.boolean().default(false),
  order: z.number().default(0),
});

type EducationSchema = z.infer<typeof educationSchema>;

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  educationToEdit?: Education;
}

const AddEditEducationDialog = ({ open, setOpen, educationToEdit }: Props) => {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();

  const form = useForm<EducationSchema>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: educationToEdit?.institution || "",
      degree: educationToEdit?.degree || "",
      period: educationToEdit?.period || "",
      logo: educationToEdit?.logo || "",
      highlight: educationToEdit?.highlight || false,
      order: educationToEdit?.order || 0,
    },
  });

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const res = await fetch(`/api/images?fileName=${file.name}`, {
      method: "POST",
      body: file,
    });
    const data = await res.json();
    if (data.url) form.setValue("logo", data.url);
  };

  const onSubmit = async (input: EducationSchema) => {
    try {
      if (educationToEdit) {
        await fetch("/api/education", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: educationToEdit.id, ...input }),
        });
      } else {
        const res = await fetch("/api/education", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        if (!res.ok) throw new Error("An error occurred.");
        form.reset();
      }
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };

  const deleteEducation = async () => {
    if (!educationToEdit) return;
    setDeleteInProgress(true);
    try {
      const res = await fetch("/api/education", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: educationToEdit.id }),
      });
      if (!res.ok) throw new Error("An error occurred.");
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    } finally {
      setDeleteInProgress(false);
    }
  };

  const logoValue = form.watch("logo");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {educationToEdit ? "Edit education" : "Add Education"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="logo"
              render={() => (
                <FormItem>
                  <FormLabel>Logo</FormLabel>
                  {logoValue ? (
                    <Image
                      className="rounded-xl border"
                      src={logoValue}
                      alt="Institution Logo"
                      width={80}
                      height={80}
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-xl border bg-slate-400">
                      <p className="text-center text-xs">Click to add a logo</p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={uploadFile}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="institution"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Institution</FormLabel>
                  <FormControl>
                    <Input placeholder="Institution name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="degree"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree / Certification</FormLabel>
                  <FormControl>
                    <Input placeholder="Degree or certification title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. 2020 – 2022" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Display order"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value) || 0)
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="highlight"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 cursor-pointer"
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">
                    Highlight this item
                  </FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {educationToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteEducation}
                >
                  Delete
                </LoadingButton>
              )}
              <LoadingButton
                type="submit"
                loading={form.formState.isSubmitting}
                disabled={deleteInProgress}
              >
                Submit
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditEducationDialog;
