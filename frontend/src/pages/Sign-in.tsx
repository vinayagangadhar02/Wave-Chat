"use client"

import { useEffect, useState } from "react"
import axiosInstance from "@/axios/axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Mail } from "lucide-react"
import { toast } from "sonner";


export default function SignIn() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error,setError]=useState(null)
  const[formData,setFormData]=useState({
    email:"",
    password:""
  })



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
  
    try {
      const response = await axiosInstance.post("/auth/signin", {
        email: formData.email,
        password: formData.password,
      });
      
      localStorage.setItem("token",response.data.token)
      navigate("/chat"); 

    } catch (error:any) {
      setError(error.response?.data?.error)
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error, {
        position: "top-center",
        duration: 3000,
      });
    }
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
      
          <div className="flex justify-center mb-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
              
            </div>
  
          </div>
         
          <CardTitle className="text-2xl font-bold text-center">Sign in to WaveChat</CardTitle>
          <CardDescription className="text-center">
            Enter your email and password to access your account
          
          </CardDescription>
        </CardHeader>
        <CardContent>
        
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="text"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="pl-10 border-blue-100 focus-visible:ring-blue-500 dark:border-blue-900/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
               
              </div>
              <div className="relative">
                {showPassword ? (
                  <EyeOff
                    className="absolute right-3 top-3 h-4 w-4 cursor-pointer text-muted-foreground"
                    onClick={() => setShowPassword(false)}
                  />
                ) : (
                  <Eye
                    className="absolute right-3 top-3 h-4 w-4 cursor-pointer text-muted-foreground"
                    onClick={() => setShowPassword(true)}
                  />
                )}
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e)=>setFormData({...formData,password:e.target.value})}
                  required
                  className="pr-10 border-blue-100 focus-visible:ring-blue-500 dark:border-blue-900/50"
                />
              </div>
            </div>
          
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer" disabled={isLoading}>
              {isLoading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

         
        </CardContent> 
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Don't have an account?{" "}
            <Link to="/sign-up" className="text-blue-600 hover:underline dark:text-blue-400">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

