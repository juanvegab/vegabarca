import {
  CreateExperienceSchema,
  createExperienceSchema,
} from "@/lib/validation/experience";
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
import { Textarea } from "./ui/textarea";
import LoadingButton from "./ui/loading-button";
import { useRouter } from "next/navigation";
import { Experience } from "@prisma/client";
import { useState } from "react";

interface AddEditExperienceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  experienceToEdit?: Experience;
}

const AddEditExperienceDialog = ({
  open,
  setOpen,
  experienceToEdit,
}: AddEditExperienceDialogProps) => {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();

  const form = useForm<CreateExperienceSchema>({
    resolver: zodResolver(createExperienceSchema),
    defaultValues: {
      position: experienceToEdit?.position || "",
      company: experienceToEdit?.company || "",
      dates: experienceToEdit?.dates || "",
      techStack: experienceToEdit?.techStack || [],
      content: experienceToEdit?.content || "",
    },
  });

  const onSubmit = async (input: CreateExperienceSchema) => {
    try {
      if (experienceToEdit) {
        const response = await fetch(`/api/experiences`, {
          method: "PUT",
          body: JSON.stringify({ id: experienceToEdit.id, ...input }),
        });
      } else {
        const response = await fetch("/api/experiences", {
          method: "POST",
          body: JSON.stringify(input),
        });
        if (!response.ok) throw new Error("An error occurred.");
        form.reset();
      }
      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error(error);
      alert("An error occurred. Please try again.");
    }
  };

  const deleteExperience = async () => {
    if (!experienceToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch(`/api/experiences`, {
        method: "DELETE",
        body: JSON.stringify({ id: experienceToEdit.id }),
      });
      if (!response.ok) throw new Error("An error occurred.");
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
            {experienceToEdit ? "Edit experience" : "Add Experience"}
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl>
                      <Input placeholder="Company" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position</FormLabel>
                    <FormControl>
                      <Input placeholder="Position" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dates"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dates</FormLabel>
                    <FormControl>
                      <Input placeholder="Dates" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="techStack"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tech Stack</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Tech Stack"
                        {...field}
                        value={field.value.map((t) => t.trim()).join(",")}
                        onChange={(e) => {
                          const value = e.target.value.split(",");
                          field.onChange({ target: { value } });
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Content</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Content" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-1 sm:gap-0">
                {experienceToEdit && (
                  <LoadingButton
                    variant="destructive"
                    loading={deleteInProgress}
                    disabled={form.formState.isSubmitting}
                    onClick={deleteExperience}
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
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditExperienceDialog;
