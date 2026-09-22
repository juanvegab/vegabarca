"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import AddEditTechnologyDialog from "./AddEditTechnologyDialog";

const AddTechnologyButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <Plus className="mr-2 h-4 w-4" />
        Add Technology
      </Button>
      <AddEditTechnologyDialog open={open} setOpen={setOpen} />
    </>
  );
};

export default AddTechnologyButton;
