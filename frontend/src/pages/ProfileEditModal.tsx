import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import axiosInstance from "@/axios/axios";

interface ProfileEditModalProps {
  profile: {
    email: string;
    f_name: string;
    l_name: string;
  } | null;
  isOpen: boolean;  
  onClose: () => void; 
  setIsSaved:(item:boolean)=>void
}

export default function ProfileEditModal({ isOpen, onClose, profile,setIsSaved }: ProfileEditModalProps) {
  const [f_name, setFirstName] = useState(profile?.f_name || "");
  const [l_name, setLastName] = useState(profile?.l_name || "");

  const handleSave = async () => {
    try {
      await axiosInstance.put("/edit", { f_name, l_name });
      setIsSaved(true)
      onClose();
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-[#111] text-white rounded-xl p-6 w-96">
        <DialogHeader>
          <DialogTitle className="text-lg">Edit Profile</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="w-20 h-20 bg-blue-700 rounded-full flex items-center justify-center text-xl font-bold">
            {profile?.f_name?.charAt(0) || "U"}{profile?.l_name?.charAt(0) || ""}
          </div>
          <div className="w-85 cursor-not-allowed">
          <Input value={profile?.email || ""} disabled className="bg-gray-800 text-white" />
          </div>
          <Input
            placeholder="First Name"
            value={f_name}
            onChange={(e) => setFirstName(e.target.value)}
            className="bg-gray-800 text-white"
          />
          <Input
            placeholder="Last Name"
            value={l_name}
            onChange={(e) => setLastName(e.target.value)}
            className="bg-gray-800 text-white"
          />
          <Button className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer" onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
