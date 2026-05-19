import React from 'react';
import ProfileBanner from '../components/profile/ProfileBanner';
import AccountSettings from '../components/profile/AccountSettings';
import ActivityLog from '../components/profile/ActivityLog';

const ProfileScreen = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-6 p-8 animate-in fade-in duration-500">
      {/* Banner & Avatar Section */}
      <ProfileBanner />

      {/* Grid: Edit Form & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <AccountSettings />
        </div>
        <div className="lg:col-span-1">
          <ActivityLog />
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;