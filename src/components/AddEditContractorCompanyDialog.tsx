import {
  CreateContractorCompanySchema,
  createContractorCompanySchema,
} from "@/lib/validation/contractorCompany";
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
import { useRouter } from "next/navigation";
import { ContractorCompany } from "@prisma/client";
import { ChangeEvent, useState } from "react";
import Image from "next/image";

interface AddEditContractorCompanyDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  companyToEdit?: ContractorCompany;
}

const AddEditContractorCompanyDialog = ({
  open,
  setOpen,
  companyToEdit,
}: AddEditContractorCompanyDialogProps) => {
  const [deleteInProgress, setDeleteInProgress] = useState(false);
  const router = useRouter();

  const form = useForm<CreateContractorCompanySchema>({
    resolver: zodResolver(createContractorCompanySchema),
    defaultValues: {
      name: companyToEdit?.name || "",
      logo: companyToEdit?.logo || undefined,
    },
  });

  const onSubmit = async (input: CreateContractorCompanySchema) => {
    try {
      if (companyToEdit) {
        await fetch(`/api/contractor-companies`, {
          method: "PUT",
          body: JSON.stringify({ id: companyToEdit.id, ...input }),
        });
      } else {
        const response = await fetch("/api/contractor-companies", {
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

  const deleteCompany = async () => {
    if (!companyToEdit) return;
    setDeleteInProgress(true);
    try {
      const response = await fetch(`/api/contractor-companies`, {
        method: "DELETE",
        body: JSON.stringify({ id: companyToEdit.id }),
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

  const uploadFile = async (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    if (!event.target.files || !event.target.files[0])
      throw new Error("No file provided");
    const file = event.target.files[0];
    const response = await fetch(`/api/images?fileName=${file.name}`, {
      method: "POST",
      body: file,
    });
    const newBlob = await response.json();
    return newBlob.url;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {companyToEdit ? "Edit Contractor Company" : "Add Contractor Company"}
          </DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="logo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Logo</FormLabel>
                    {field.value ? (
                      <Image
                        className="rounded-xl border"
                        src={field.value}
                        alt="Company Logo"
                        width={80}
                        height={80}
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-xl border bg-slate-400">
                        <p className="text-center text-xs">
                          Click here to add a logo
                        </p>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        form.setValue("logo", await uploadFile(e));
                      }}
                    />
                    <FormControl>
                      <Input
                        {...field}
                        type="string"
                        className="hidden"
                        placeholder="Logo URL"
                      />
                    </FormControl>
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
                      <Input placeholder="Contractor / Agency name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="gap-1 sm:gap-0">
                {companyToEdit && (
                  <LoadingButton
                    variant="destructive"
                    loading={deleteInProgress}
                    disabled={form.formState.isSubmitting}
                    onClick={deleteCompany}
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

export default AddEditContractorCompanyDialog;
