import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    try {
      localStorage.removeItem("token");
      navigate("/");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-1">
       <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button type="button" onClick={handleLogout} variant="ghost" size="icon" className="text-blue-700 cursor-pointer">
                        <LogOut className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Sign Out</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                </div>
    </div>
  );
};

export default Logout;
