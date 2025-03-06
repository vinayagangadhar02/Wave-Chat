"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Eye, EyeOff, Github, Mail, User } from "lucide-react"

export default function SignUp() {
  const navigate=useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e:any) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate registration
    setTimeout(() => {
      setIsLoading(false)
      navigate("/chat")
    }, 1500)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 dark:bg-slate-950 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-2">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your information to create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="firstName"
                    placeholder="John"
                    required
                    className="pl-10 border-blue-100 focus-visible:ring-blue-500 dark:border-blue-900/50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  placeholder="Doe"
                  required
                  className="border-blue-100 focus-visible:ring-blue-500 dark:border-blue-900/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoCorrect="off"
                  required
                  className="pl-10 border-blue-100 focus-visible:ring-blue-500 dark:border-blue-900/50"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
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
                  required
                  className="pr-10 border-blue-100 focus-visible:ring-blue-500 dark:border-blue-900/50"
                />
              </div>
              <p className="text-xs text-muted-foreground">Password must be at least 8 characters long</p>
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isLoading}>
              {isLoading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <div className="mt-4 flex items-center">
            <Separator className="flex-grow" />
            <span className="mx-2 text-xs text-muted-foreground">OR CONTINUE WITH</span>
            <Separator className="flex-grow" />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2">
            <Button variant="outline" className="w-full">
              <Github className="mr-2 h-4 w-4" />
              GitHub
            </Button>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-center text-sm text-muted-foreground w-full">
            Already have an account?{" "}
            <Link to="/sign-in" className="text-blue-600 hover:underline dark:text-blue-400">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}

