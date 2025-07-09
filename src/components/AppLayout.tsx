// Layout component using fixed grid without special 1400px rule

import React from 'react';
import Sidebar from './Sidebar';
import ProfileEditor from './ProfileEditor';
import JobInputPanel from './JobInputPanel';

export default function AppLayout() {
  return (
    <div className="grid grid-cols-[22%_1fr_32%] gap-4 p-4 max-w-full min-h-screen">
      <Sidebar className="col-span-1" />
      <ProfileEditor className="col-span-1" />
      <JobInputPanel className="col-span-1" />
    </div>
  );
}
