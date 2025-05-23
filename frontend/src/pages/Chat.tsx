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
import { Sheet, SheetContent} from "@/components/ui/sheet";
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
import { io, Socket } from "socket.io-client";
import dayjs from "dayjs";




export default function ChatPage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchedContacts, setSearchedContacts] = useState<any[]>([]);
  const [activeId, setActiveId] = useState<string>("");
  const [activeConversation, setActiveConversation] = useState<any>(null);
  const [newMessage, setNewMessage] = useState<string>("");
  const [messages, setMessages] = useState([]);
  const [senderId, setSenderId] = useState<string>("");


  const emojiRef = useRef<HTMLDivElement>(null);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [mobileView, setMobileView] = useState<boolean>(false);
  
 
  
  const [messageStatus, setMessageStatus] = useState<{ [key: string]: "read" | "unread" }>({});
  const socket = useRef<Socket | null>(null);


  
  useEffect(() => {
    const token = localStorage.getItem("token");

    socket.current = io("http://localhost:4000", {
      extraHeaders: {
        authorization: `Bearer ${token}`,
      },
    });

    socket.current.on("connect", () => console.log(`Connected: ${socket.current?.id}`));
    socket.current.on("disconnect", () => console.log("Disconnected"));

    return () => {
      socket.current?.disconnect(); 
    };
  }, []);

  
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (emojiRef.current && !emojiRef.current.contains(event.target as Node)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);

  const handleAddEmoji = (emoji: any) => {
    setNewMessage((msg) => msg + emoji.emoji);
  };
  

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await axiosInstance.get("/details", {
          params: { id: activeId },
        });
        setActiveConversation(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchDetails();
  }, [activeId]);

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get("/getMessages", {
        params: { senderId:senderId,
                 recipientId:activeId
        },
      });
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [activeId]);
  


  const handleSendMessage = () => {
    if (!socket.current) {
      console.warn("Socket not ready yet!");
      return;
    }

    socket.current.emit("sendMessage", {
      recipientId: activeId,
      messageType: "text",
      content: newMessage,
    });

    setNewMessage("");
    // fetchMessages();
  };


  useEffect(() => {
    const handleNewMessage = () => {
      fetchMessages();
    };
    if (activeConversation) {
      socket.current?.on("newMessage", handleNewMessage);
      setMobileView(true);
    }
    return () => {
      socket.current?.off("newMessage", handleNewMessage);
    };
  }, [activeConversation]);


  useEffect(() => {
    const handleResize = () => {
      setMobileView(!(window.innerWidth < 640));
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);



  // Mark messages as read when viewed
  // const markMessagesAsRead = async () => {
  //   if (!activeId || !senderId) return;
  //   try {
  //     const unreadMessages = messages.filter(
  //       msg => msg.recipientId === senderId && msg.senderId === activeId && msg.status === "unread"
  //     );
  //     if (unreadMessages.length > 0) {
  //       const messageIds = unreadMessages.map(msg => msg.id);
  //       await axiosInstance.put("/markMessagesAsRead", { messageIds });
  //       setMessages(prevMessages => 
  //         prevMessages.map(msg => 
  //           messageIds.includes(msg.id) ? { ...msg, status: "read" } : msg
  //         )
  //       );
  //     }
  //   } catch (error) {
  //     console.error("Error marking messages as read:", error);
  //   }
  // };


  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950">
      {/* Mobile navigation */}
        <Sheet open={!mobileView} onOpenChange={(open)=>{setMobileView(!open)}}>
          <SheetContent
            side="left"
            className="p-0 w-full max-w-[320px] sm:max-w-sm"
          >
            <ChatSidebar
              setMobileView={setMobileView}
              activeConversation={activeConversation}
              setActiveConversation={setActiveConversation}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              searchedContacts={searchedContacts}
              setSearchedContacts={setSearchedContacts}
              setActiveId={setActiveId}
              setSenderId={setSenderId}
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
          setMobileView={setMobileView}
          activeConversation={activeConversation}
          setActiveConversation={setActiveConversation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          searchedContacts={searchedContacts}
          setSearchedContacts={setSearchedContacts}
          setActiveId={setActiveId}
          setSenderId={setSenderId}
        />

      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col">
        {activeConversation ? (
          <>
            {/* Chat header */}
            <div className="flex items-center justify-between border-b p-4 sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden"
                  onClick={() => setMobileView(false)}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                {/* <Avatar>
                  <AvatarImage
                    src={activeConversation.id}
                    alt={activeConversation?.f_name}
                  />
                  <AvatarFallback>
                    {activeConversation?.f_name?.charAt(0) || "?"}{activeConversation?.l_name?.charAt(0) || "?"}
                  </AvatarFallback>
                </Avatar> */}
                 <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full font-bold text-lg">
                 {activeConversation.f_name.charAt(0)}{activeConversation.l_name.charAt(0)}
    </div>
                <div>
                  <h2 className="font-semibold">{activeConversation.f_name} {activeConversation.l_name}</h2>
                 
                    <p className="text-xs text-muted-foreground flex items-center">
                      <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                      Online
                    </p>
                 
                  {/* {activeConversation.group && (
                    <p className="text-xs text-muted-foreground">
                      Group · {activeConversation.members.length} members
                    </p>
                  )} */}
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 pt-4 pb-2">
              <div className="space-y-4">
                {messages.map((message: any) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId===senderId ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex max-w-[70%] ${
                        message.senderId===senderId ? "flex-row-reverse" : "flex-row"
                      }`}
                    >
                      {message.senderId!== senderId && (
                        // <Avatar className="h-8 w-8 mr-2">
                        //   <AvatarImage
                        //     src={activeConversation.id}
                        //     alt={messages.senderId}
                        //   />
                        //   <AvatarFallback>
                        //     {messages.senderId.charAt(0)}
                        //   </AvatarFallback>
                        // </Avatar>
                        <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full font-bold text-lg">
                        {activeConversation.f_name?.charAt(0)} {activeConversation.l_name?.charAt(0)}
                      </div>
                      )}
                      <div>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            message.senderId===senderId
                              ? "bg-primary text-primary-foreground"
                              : "bg-blue-100 dark:bg-blue-900/50"
                          }`}
                        >
                          {message.content}
                          {message.fileUrl && (
                            <div className="mt-2">
                              <a 
                                href={message.fileUrl} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-500 underline flex items-center"
                              >
                                <FileImage className="h-4 w-4 mr-1" />
                                Attachment
                              </a>
                            </div>
                          )}
                        </div>
                        <div
                          className={`text-xs text-muted-foreground mt-1 ${
                            message.senderId===senderId ? "text-right" : "text-left"
                          }`}
                        >
  <span>
  {message.timestamp
    ? dayjs(message.timestamp as string).format('DD-MM-YYYY h:mm A')
    : 'Invalid date'}
</span>
                          {message.senderId===senderId && (
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
                      {/* <Avatar className="h-8 w-8 mr-2">
                        <AvatarImage
                          src={activeConversation.f_name}
                          alt={activeConversation.f_name}
                        />
                        <AvatarFallback>
                          {activeConversation.f_name.charAt(0)}
                        </AvatarFallback>
                      </Avatar> */}
                       <div className="flex items-center justify-center w-12 h-12 bg-blue-600 text-white rounded-full font-bold text-lg">
      {activeConversation.f_name?.charAt(0)} {activeConversation.l_name?.charAt(0)}
    </div>
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
            </div>

            {/* Message input */}
            <div className="border-t p-4 bg-background sticky bottom-0 z-10 ">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 "
              >
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild >
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
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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
                      className="absolute bottom-[70px] right-3 "
                      ref={emojiRef}
                    >
                      {emojiPickerOpen && (
                        <EmojiPicker
                          onEmojiClick={handleAddEmoji}
                          autoFocusSearch={false}
                        />
                      )}
                    </div>
                    <TooltipContent>Emoji</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <Button
                  type="submit"
                  onClick={handleSendMessage}
                  size="icon"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={newMessage.trim() === ""}
                >
                  <Send  className="h-5 w-5" />
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
  setMobileView,
  activeConversation,
  setActiveConversation,
  searchQuery,
  setSearchQuery,
  searchedContacts,
  setSearchedContacts,
  setActiveId,
  setSenderId
}: any) {

  interface UserProfile {
    id:string,
    f_name: string;
    l_name: string;
    email: string;
  }

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isSaved,setIsSaved]=useState<Boolean>(false)

  
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axiosInstance.get("/profile");
        setProfile(response.data);
        setSenderId(response.data.id)
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, [isSaved]);

  useEffect(() => {
    const searchContacts = async () => {
      try {
          const response = await axiosInstance.get("/search", {
            params: { searchQuery },
          });

          if (response?.status === 200) {
            console.log(response);
            setSearchedContacts(response.data);
          }
      } 
      catch (error) {
        console.error(error);
      }
    };
    searchContacts();
  }, [searchQuery]);

  return (
    <div className="flex h-full flex-col">
    <div className="p-4 border-b">
  <div className="flex items-center mb-4">
    <h1 className="text-2xl font-[700] ">WaveChat</h1>
    <div className="ml-auto flex items-center gap-[2px]">
      <TooltipProvider>
        <Tooltip >
          <TooltipTrigger asChild >
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="text-blue-500 cursor-pointer mr-10"
            >
              <Plus className="h-5 w-5 " />
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
                  className={`flex cursor-pointer items-center gap-3 w-full rounded-lg p-2 text-left transition-colors ${
                    activeConversation?.id === contacts.id
                      ? "bg-blue-100 dark:bg-blue-900/50"
                      : "hover:bg-blue-50 dark:hover:bg-blue-950/50"
                  }`}
                  onClick={() =>{ 
                    setActiveId(contacts.id)
                    // setMobileView(false)
                  }
                  }
                >
                  <div className="relative">
                    <Avatar>
                      <AvatarImage alt={contacts.f_name} />
                      <AvatarFallback>
                        {contacts.f_name.charAt(0)}
                        {contacts.l_name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {/* {conversations.online && !conversations.group && (
                      <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
                    )} */}
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
                        {/* {conversations.lastMessage} */}hello
                      </p>
                      {/* {conversations.unread > 0 && (
                        <Badge className="ml-auto bg-blue-600">
                          {conversations.unread}
                        </Badge>
                      )} */}
                    </div>
                  </div>
                 
                </button>
             
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        {/* <TabsContent value="unread" className="m-0">
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
        </TabsContent> */}
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