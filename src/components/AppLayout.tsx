// Layout component using fixed grid without special 1400px rule

import React from 'react';
import Sidebar from './Sidebar';
import ProfileInput from './ProfileInput';
import JobInputAndPreview from './JobInputAndPreview';

export default function AppLayout() {
  return (
    <div className="grid grid-cols-[22%_40%_38%] gap-4 p-4 max-w-none w-full h-screen">
      <Sidebar className="col-span-1" />
      <ProfileInput className="col-span-1" />
      <JobInputAndPreview className="col-span-1" />
    </div>
  );
}
