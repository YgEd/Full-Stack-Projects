import React, { useState } from 'react';
import { SpeedDial, SpeedDialAction, SpeedDialContent, SpeedDialHandler } from '@material-tailwind/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/outline';
import { KeyIcon } from "@heroicons/react/outline";




function MyComponent() {
  const [open, setOpen] = useState(false);

  const actions = [
    { icon: <PlusIcon />, name: 'Add' },
    { icon: <PencilIcon />, name: 'Edit' },
    { icon: <TrashIcon />, name: 'Delete' },
  ];

  const handleActionClick = (actionName) => {
    // Handle the click for each action
    console.log(`Clicked on ${actionName}`);
    setOpen(false); // Close the SpeedDial after an action is clicked
  };

  return (
    <div>
      <KeyIcon/>
    </div>
  );
}

export default MyComponent;
