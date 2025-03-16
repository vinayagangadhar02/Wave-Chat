import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import axiosInstance from "@/axios/axios";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate=useNavigate();

  const handleClick = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axiosInstance.get("validateToken", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
   

      if (response.data.success) {
        navigate("/chat");
      } else {
        navigate("sign-in");
      }
    } catch (error) {
      navigate("sign-in");
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          <div className="mr-4 flex">
           
              <span className="ml-2 h-7 w-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600"></span>
              <span onClick={()=>{document.getElementById('main')?.scrollIntoView({behavior:"smooth"})}} className=" text-lg font-bold cursor-pointer">WaveChat</span>
           
          </div>
          <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-2">
              <Link to="/sign-in">
                <Button className="cursor-pointer" variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/sign-up">
                <Button className="cursor-pointer" size="sm">Sign Up</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section id="main" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                    Connect in real-time with WaveChat
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Experience seamless communication with our modern messaging platform. Stay connected with friends,
                    family, and colleagues.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  
                    <Button onClick={handleClick} size="lg" className="group cursor-pointer">
                      Start Chatting
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  
                  
                    <Button className="cursor-pointer" onClick={()=>{document.getElementById('features')?.scrollIntoView({behavior:"smooth"})}} size="lg" variant="outline">
                      Learn More
                    </Button>
                
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[450px] w-[350px] overflow-hidden rounded-xl border bg-background p-2 shadow-xl">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/30 dark:to-blue-900/20"></div>
                  <div className="relative h-full w-full overflow-hidden rounded-lg border bg-background shadow-sm">
                    <div className="flex h-12 items-center border-b px-4">
                      <div className="flex items-center space-x-2">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span className="font-medium">Chat Preview</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-4 p-4">
                      <div className="flex items-end space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                          S
                        </div>
                        <div className="rounded-lg rounded-bl-none bg-blue-100 px-4 py-2 text-sm dark:bg-blue-900/50">
                          Hey there! How's it going?
                        </div>
                      </div>
                      <div className="flex items-end justify-end space-x-2">
                        <div className="rounded-lg rounded-br-none bg-primary px-4 py-2 text-sm text-primary-foreground">
                          Hi! I'm doing great, thanks for asking!
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                          Y
                        </div>
                      </div>
                      <div className="flex items-end space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-medium text-blue-600 dark:bg-blue-900/50 dark:text-blue-400">
                          S
                        </div>
                        <div className="rounded-lg rounded-bl-none bg-blue-100 px-4 py-2 text-sm dark:bg-blue-900/50">
                          Have you tried the new features?
                        </div>
                      </div>
                      <div className="flex items-end justify-end space-x-2">
                        <div className="rounded-lg rounded-br-none bg-primary px-4 py-2 text-sm text-primary-foreground">
                          Yes! The real-time messaging is amazing!
                        </div>
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-medium text-primary">
                          Y
                        </div>
                      </div>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 border-t bg-background p-2">
                      <div className="flex items-center rounded-md border bg-background px-3 py-2">
                        <input
                          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                          placeholder="Type a message..."
                          disabled
                        />
                        <button className="ml-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="m22 2-7 20-4-9-9-4Z" />
                            <path d="M22 2 11 13" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section id="features" className="w-full bg-slate-50 py-12 dark:bg-slate-900/50 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm dark:bg-blue-900/50">
                  Features
                </div>
                <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
                  Everything you need to stay connected
                </h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform provides a seamless communication experience with a range of features designed to make
                  chatting easier and more enjoyable.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-3">
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  >
                    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Real-time Messaging</h3>
                <p className="text-center text-muted-foreground">
                  Send and receive messages instantly with our lightning-fast messaging system.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Group Chats</h3>
                <p className="text-center text-muted-foreground">
                  Create and manage group conversations with friends, family, or colleagues.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-2 rounded-lg border bg-background p-6 shadow-sm">
                <div className="rounded-full bg-blue-100 p-3 dark:bg-blue-900/50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-blue-600 dark:text-blue-400"
                  >
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold">Media Sharing</h3>
                <p className="text-center text-muted-foreground">
                  Easily share photos, videos, and documents with your contacts.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
     
    </div>
  )
}

