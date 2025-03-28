import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logout from "@/comp/logOut";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import EmojiPicker from "emoji-picker-react";
import {
  Check,
  ChevronLeft,
  Edit,
  FileImage,
  MessageSquare,
  Plus,
  Search,
  Send,
  Smile,
  User,
} from "lucide-react";
import axiosInstance from "@/axios/axios";
import ProfileEditModal from "./ProfileEditModal";

// Sample data for conversations
const conversations = [
  {
    id: "3e18aebb-a220-44a2-9fab-0f5182aec434",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Hey, how's it going?",
    time: "10:30 AM",
    unread: 2,
    online: true,
  },
  {
    id: "e5ab4984-1bf1-409f-b076-e1e45a55a0f0",
    name: "Design Team",
    avatar: "/placeholder.svg?height=40&width=40",
    lastMessage: "Meeting at 3 PM",
    time: "Yesterday",
    unread: 0,
    group: true,
    members: ["Sarah Johnson", "Alex Thompson", "You"],
  },
];

export default function ChatPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchedContacts, setSearchedContacts] = useState([]);
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [messages, setMessages] = useState<any>([]);
  const [newMessage, setNewMessage] = useState<any>("");
  const [isTyping, setIsTyping] = useState<any>(false);
  const [activeId,setActiveId]=useState<String>("")
  const [mobileView, setMobileView] = useState<any>(false);
  const messagesEndRef = useRef<any>(null);
  const [message, setMessage] = useState<any>("");
  const emojiRef = useRef<any>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (emojiRef.current && !emojiRef.current.contains(event.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji: any) => {
    setMessage((msg: String) => (msg + emoji.emoji) as String);
  };
  // Filter conversations based on search query
  // const filteredConversations = conversations.filter((conversation) =>
  //   conversation.name.toLowerCase().includes(searchQuery.toLowerCase()),
  // )

  // Set active conversation and load messages
  useEffect(() => {
    if (activeConversation) {
      setMessages(setMessages);
      setMobileView(true);
    }
  }, [activeConversation]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle sending a new message
  const handleSendMessage = (e: any) => {
    e.preventDefault();
    if (newMessage.trim() === "") return;

    const newMsg = {
      id: messages.length + 1,
      sender: "You",
      content: newMessage,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isUser: true,
    };

    setMessages([...messages, newMsg]);
    setNewMessage("");

    // Simulate response with typing indicator
    setIsTyping(true);
    setTimeout(() => {
      const response = {
        id: messages.length + 2,
        sender: activeConversation?.name || "User",
        content: "Thanks for your message! I'll get back to you soon.",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isUser: false,
      };
      setMessages((prev: any) => [...prev, response]);
      setIsTyping(false);
    }, 2000);
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile navigation */}
      <Sheet open={!mobileView} onOpenChange={setMobileView}>
        <SheetContent
          side="left"
          className="p-0 w-full max-w-[320px] sm:max-w-sm"
        >
          <ChatSidebar
            conversations={conversations}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
            searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchedContacts={searchedContacts}
          setSearchedContacts={setSearchedContacts}
          setActiveId={setActiveId}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div
        className={cn(
          "hidden md:block w-80 border-r bg-background",
          mobileView && "md:block"
        )}
      >
        <ChatSidebar
          conversations={conversations}
          activeConversation={activeConversation}
          setActiveConversation={setActiveConversation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchedContacts={searchedContacts}
          setSearchedContacts={setSearchedContacts}
          setActiveId={setActiveId}
        />
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {activeConversation ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between border-b p-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileView(false)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                <Avatar>
                  <AvatarImage
                    src={activeConversation?.avatar}
                    alt={activeConversation?.name}
                  />
                  <AvatarFallback>
                    {activeConversation?.name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold">{activeConversation.name}</h2>
                  {activeConversation.online && !activeConversation.group && (
                    <p className="text-xs text-muted-foreground flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>{" "}
                      Online
                    </p>
                  )}
                  {activeConversation.group && (
                    <p className="text-xs text-muted-foreground">
                      Group · {activeConversation.members.length} members
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[70%] ${
                        message.isUser ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {!message.isUser && (
                        <Avatar className="h-8 w-8 mr-2">
                          <AvatarImage
                            src={activeConversation.avatar}
                            alt={message.sender}
                          />
                          <AvatarFallback>
                            {message.sender.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.isUser
                              ? "bg-primary text-primary-foreground"
                              : "bg-blue-100 dark:bg-blue-900/50"
                          }`}
                        >
                          {message.content}
                        </div>
                        <div
                          className={`text-xs text-muted-foreground mt-1 ${
                            message.isUser ? "text-right" : "text-left"
                          }`}
                        >
                          {message.time}
                          {message.isUser && (
                            <span className="ml-1">
                              <Check className="inline h-3 w-3 text-blue-500" />
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex max-w-[70%]">
                      <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={activeConversation.avatar}
                          alt={activeConversation.name}
                        />
                        <AvatarFallback>
                          {activeConversation.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="rounded-lg bg-blue-100 px-4 py-2 dark:bg-blue-900/50">
                        <div className="flex space-x-1">
                          <div className="h-2 w-2 animate-bounce rounded-full bg-blue-500"></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                          <div
                            className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                            style={{ animationDelay: "0.4s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message input */}
            <div className="border-t p-4 bg-background ">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 "
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-blue-500"
                      >
                        <Plus className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Add attachment</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="text-blue-500"
                      >
                        <FileImage className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Send image</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border-blue-100 focus-visible:ring-blue-500 dark:border-blue-900/50"
                />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        onClick={() => setEmojiPickerOpen(true)}
                        variant="ghost"
                        size="icon"
                        className="text-blue-500"
                      >
                        <Smile className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <div
                      className="absolute bottom-[10px] right-0 "
                      ref={emojiRef}
                    >
                      <EmojiPicker
                        open={emojiPickerOpen}
                        onEmojiClick={handleAddEmoji}
                        autoFocusSearch={false}
                      />
                    </div>
                    <TooltipContent>Emoji</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  type="submit"
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={message.trim() === ""}
                >
                  <Send className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="flex flex-col items-center max-w-md text-center p-6">
              <MessageSquare className="h-12 w-12 text-blue-600 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Welcome to WaveChat</h2>
              <p className="text-muted-foreground mb-6">
                Select a conversation from the sidebar or start a new one to
                begin chatting.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="mr-2 h-4 w-4" />
                New Conversation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatSidebar({
  conversations,
  activeConversation,
  setActiveConversation,
  searchQuery,
  setSearchQuery,
  searchedContacts,
  setSearchedContacts,
  setActiveId
}: any) {
  interface UserProfile {
    id:string,
    f_name: string;
    l_name: string;
    email: string;
  }

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const[isSaved,setIsSaved]=useState<Boolean>(false)

  const handleSetActiveConversation = (activeId:string) => {
    const activeConversation = conversations.find((convo: { id: string; }) => convo.id === activeId);
    setActiveConversation(activeConversation || null);
  };
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/profile");
        setProfile(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [isSaved]);

  useEffect(() => {
    const searchContacts = async () => {
      try {
        console.log("OKOK")
        // if (searchQuery.length > 0) {
          const response = await axiosInstance.get("/search", {
            params: { searchQuery },
          });

          if (response?.status === 200) {
            console.log(response);
            setSearchedContacts(response.data);
          }
        // }
      } catch (error) {
        console.error(error);
      }
    };
    searchContacts();
  }, [searchQuery]);

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold">WaveChat</h1>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-blue-500 cursor-pointer"
                  >
                    <Plus className="h-5 w-5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Create Group</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-blue-100 focus-visible:ring-blue-500 dark:border-blue-900/50"
          />
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full">
        <div className="px-4 pt-2">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1 cursor-pointer">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="flex-1 cursor-pointer">
              Unread
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex-1 cursor-pointer">
              Groups
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="all" className="m-0">
          <ScrollArea className="flex-1 h-[calc(90vh-13rem)]">
            <div className="p-2 space-y-1">
              {searchedContacts.map((contacts: any) => (
                <button
                  key={contacts.id}
                  className={`flex items-center gap-3 w-full rounded-lg p-2 text-left transition-colors ${
                    activeConversation?.id === contacts.id
                      ? "bg-blue-100 dark:bg-blue-900/50"
                      : "hover:bg-blue-50 dark:hover:bg-blue-950/50"
                  }`}
                  onClick={() => setActiveConversation(conversations)}
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage alt={contacts.f_name} />
                      <AvatarFallback>
                        {contacts.f_name.charAt(0)}
                        {contacts.l_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {conversations.online && !conversations.group && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium truncate">
                        {contacts.f_name}
                        <span> </span>
                        {contacts.l_name}
                      </h3>
                      <span className="text-xs text-muted-foreground">
                        {contacts.email}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {conversations.lastMessage}
                      </p>
                      {conversations.unread > 0 && (
                        <Badge className="ml-auto bg-blue-600">
                          {conversations.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="unread" className="m-0">
          <ScrollArea className="flex-1 h-[calc(100vh-13rem)]">
            <div className="p-2 space-y-1">
              {conversations
                .filter((conversation: any) => conversation.unread > 0)
                .map((conversation: any) => (
                  <button
                    key={conversation.id}
                    className={`flex items-center gap-3 w-full rounded-lg p-2 text-left transition-colors ${
                      activeConversation?.id === conversation.id
                        ? "bg-blue-100 dark:bg-blue-900/50"
                        : "hover:bg-blue-50 dark:hover:bg-blue-950/50"
                    }`}
                    onClick={() => {
                      setActiveId(conversation.id);
                      handleSetActiveConversation(conversation.id);
                    }}
                    
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={conversation.avatar}
                          alt={conversation.name}
                        />
                        <AvatarFallback>
                          {conversation.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {conversation.online && !conversation.group && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                      )}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {conversation.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        <Badge className="ml-auto bg-blue-600">
                          {conversation.unread}
                        </Badge>
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="groups" className="m-0">
          <ScrollArea className="flex-1 h-[calc(50vh-13rem)]">
            <div className="p-2 space-y-1">
              {conversations
                .filter((conversation: any) => conversation.group)
                .map((conversation: any) => (
                  <button
                    key={conversation.id}
                    className={`flex items-center gap-3 w-full rounded-lg p-2 text-left transition-colors ${
                      activeConversation?.id === conversation.id
                        ? "bg-blue-100 dark:bg-blue-900/50"
                        : "hover:bg-blue-50 dark:hover:bg-blue-950/50"
                    }`}
                    onClick={() => setActiveConversation(conversation)}
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={conversation.avatar}
                          alt={conversation.name}
                        />
                        <AvatarFallback>
                          {conversation.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium truncate">
                          {conversation.name}
                        </h3>
                        <span className="text-xs text-muted-foreground">
                          {conversation.time}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        {conversation.unread > 0 && (
                          <Badge className="ml-auto bg-blue-600">
                            {conversation.unread}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
      <div className=" sticky bottom-0 z-50 mt-auto border-t p-4 position-fixed">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage
                src="/placeholder.svg?height=40&width=40"
                alt="Your Avatar"
              />
              <AvatarFallback className="text-blue-500 font-bold">
                {profile?.f_name[0]}
                {profile?.l_name[0]}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {profile?.f_name} {profile?.l_name}
              </p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                   <>
                  <Button
                    onClick={() => {setIsOpen(true);setIsSaved(false)}}
                    className="cursor-pointer text-blue-500"
                    variant="ghost"
                    size="icon"
                  >
                    <User className="h-5 w-5" />
                  </Button>
                 
                  {profile&&<ProfileEditModal
                    isOpen={isOpen}
                    onClose={() => setIsOpen(false)}
                    profile={profile}
                    setIsSaved={setIsSaved}
                  />}
                  </>
                </TooltipTrigger>
                <TooltipContent>Edit</TooltipContent>
              </Tooltip>
            </TooltipProvider>
           
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Logout />
                </TooltipTrigger>
                <TooltipContent>Sign out</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    </div>
  );
}