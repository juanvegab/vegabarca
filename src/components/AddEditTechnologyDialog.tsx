"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Technology } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import {
  CreateTechnologySchema,
  createTechnologySchema,
} from "@/lib/validation/technology";

const CATEGORIES = ["AI/ML", "Frontend", "Mobile", "Backend", "Databases", "Others"];

interface Props {
  open: boolean;
  setOpen: (open: boolean) => void;
  technologyToEdit?: Technology;
}

const AddEditTechnologyDialog = ({ open, setOpen, technologyToEdit }: Props) => {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();

  const form = useForm<CreateTechnologySchema>({
    resolver: zodResolver(createTechnologySchema),
    defaultValues: {
      name: technologyToEdit?.name || "",
      logo: technologyToEdit?.logo || "",
      categories: technologyToEdit?.categories || [],
      isFeatured: technologyToEdit?.isFeatured || false,
    },
  });

  const logoValue = form.watch("logo");
  const selectedCategories = form.watch("categories");

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

  const toggleCategory = (cat: string) => {
    const current = form.getValues("categories");
    if (current.includes(cat)) {
      form.setValue("categories", current.filter((c) => c !== cat));
    } else {
      form.setValue("categories", [...current, cat]);
    }
  };

  const onSubmit = async (input: CreateTechnologySchema) => {
    try {
      if (technologyToEdit) {
        await fetch("/api/technologies", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: technologyToEdit.id, ...input }),
        });
      } else {
        const res = await fetch("/api/technologies", {
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

  const deleteTechnology = async () => {
    if (!technologyToEdit) return;
    setDeleteInProgress(true);
    try {
      const res = await fetch("/api/technologies", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: technologyToEdit.id }),
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {technologyToEdit ? "Edit Technology" : "Add Technology"}
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
                      alt="Technology Logo"
                      width={64}
                      height={64}
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-xl border bg-slate-100 text-center text-xs text-muted-foreground">
                      No logo
                    </div>
                  )}
                  <Input type="file" accept="image/*" onChange={uploadFile} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Java" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categories"
              render={() => (
                <FormItem>
                  <FormLabel>Categories</FormLabel>
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleCategory(cat)}
                        className={`rounded-full border px-3 py-1 text-sm transition-colors ${
                          selectedCategories.includes(cat)
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background hover:bg-muted"
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value ?? false}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="h-4 w-4 cursor-pointer"
                    />
                  </FormControl>
                  <FormLabel className="cursor-pointer">Featured</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter className="gap-1 sm:gap-0">
              {technologyToEdit && (
                <LoadingButton
                  variant="destructive"
                  loading={deleteInProgress}
                  disabled={form.formState.isSubmitting}
                  onClick={deleteTechnology}
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

export default AddEditTechnologyDialog;
