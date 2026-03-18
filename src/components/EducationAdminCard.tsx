"use client";

import { Education } from "@prisma/client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import LoadingButton from "./ui/loading-button";
import Image from "next/image";
import { ChangeEvent, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  education: Education;
}

const EducationAdminCard = ({ education }: Props) => {
  const [open, setOpen] = useState(false);
  const [logo, setLogo] = useState(education.logo || "");
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const uploadFile = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];
    const res = await fetch(`/api/images?fileName=${file.name}`, {
      method: "POST",
      body: file,
    });
    const data = await res.json();
    if (data.url) setLogo(data.url);
  };

  const save = async () => {
    setSaving(true);
    try {
      await fetch("/api/education", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: education.id, logo }),
      });
      router.refresh();
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card
        className="cursor-pointer transition-shadow hover:shadow-lg"
        onClick={() => setOpen(true)}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {logo ? (
              <Image
                src={logo}
                alt={`${education.institution} logo`}
                width={36}
                height={36}
                className="shrink-0 rounded object-contain"
              />
            ) : (
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded bg-muted text-xs font-bold text-muted-foreground">
                {education.institution[0]}
              </div>
            )}
            {education.institution}
          </CardTitle>
          <CardDescription>
            {education.degree} · {education.period}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {education.highlight && (
            <span className="text-xs font-semibold text-amber-600">
              ★ Highlighted
            </span>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Logo — {education.institution}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">
              {education.degree} · {education.period}
            </p>
            {logo ? (
              <Image
                src={logo}
                alt="Logo preview"
                width={80}
                height={80}
                className="rounded-xl border object-contain"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border bg-slate-400">
                <p className="text-center text-xs">Click here to add a logo</p>
              </div>
            )}
            <Input type="file" accept="image/*" onChange={uploadFile} />
          </div>
          <DialogFooter>
            <LoadingButton loading={saving} onClick={save}>
              Save
            </LoadingButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EducationAdminCard;
