import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Mic,
  Image,
  Paperclip,
  MoreVertical,
  Brain,
  Lightbulb,
  Search,
  Home,
  Car,
  Wrench,
  Palette,
  Shield,
  Clock,
  Star,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Download,
  Share2,
  Sparkles,
  Zap,
  Phone,
  Video,
  Settings,
  HelpCircle,
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle,
  AlertTriangle,
  Info,
  Heart,
  Compass,
  Eye,
  Camera,
  Volume2,
  VolumeX
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { api } from "../lib/api";
import BackButton from "../components/BackButton";

type ChatResponse = {
  reply: string;
  suggestions?: string[];
};

export default function AIServiceAssistant() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: 'Hello! I\'m ServiceFlow AI, your intelligent service assistant. I can help you with:',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      suggestions: [
        'Book a service',
        'Find providers',
        'Vastu consultation',
        'Maintenance tips',
        'Cost estimation'
      ]
    },
    {
      id: 2,
      type: 'bot',
      content: '• Book any home, vehicle, or machine service\n• Find the best service providers\n• Get vastu advice and analysis\n• Receive maintenance recommendations\n• Estimate service costs\n• Troubleshoot common problems',
      timestamp: new Date(Date.now() - 1000 * 60 * 5)
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activeFeature, setActiveFeature] = useState('chat');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const quickActions = [
    { id: 'book-service', label: 'Book Service', icon: Home, color: 'bg-blue-50 text-blue-600' },
    { id: 'find-provider', label: 'Find Provider', icon: Search, color: 'bg-green-50 text-green-600' },
    { id: 'vastu-check', label: 'Vastu Check', icon: Compass, color: 'bg-purple-50 text-purple-600' },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench, color: 'bg-orange-50 text-orange-600' },
    { id: 'cost-estimate', label: 'Cost Estimate', icon: Target, color: 'bg-red-50 text-red-600' },
    { id: 'troubleshoot', label: 'Troubleshoot', icon: Eye, color: 'bg-teal-50 text-teal-600' }
  ];

  const frequentQuestions = [
    "How do I book a plumber?",
    "What's the cost of AC service?",
    "Find electricians near me",
    "Check vastu for my home",
    "When to service my car?",
    "Best interior designers",
    "Urgent repair service",
    "Compare service prices"
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateTyping = (responseText, suggestions = []) => {
    setIsTyping(true);
    setTimeout(() => {
      const newMessage = {
        id: Date.now(),
        type: 'bot',
        content: responseText,
        timestamp: new Date(),
        suggestions: suggestions
      };
      setMessages(prev => [...prev, newMessage]);
      setIsTyping(false);
    }, 1500 + Math.random() * 1000);
  };



  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    try {
      const res = await api.post<ChatResponse>('/ai/chat', {
        message: inputMessage,
        context: { userId: 'test-user-1' } // Mock user ID
      });

      const botMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: res.reply,
        timestamp: new Date(),
        suggestions: res.suggestions || []
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage = {
        id: Date.now() + 1,
        type: 'bot',
        content: "Sorry, I'm having trouble connecting to the server.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickAction = (action) => {
    let message = '';
    switch (action.id) {
      case 'book-service':
        message = 'I want to book a service';
        break;
      case 'find-provider':
        message = 'Find service providers near me';
        break;
      case 'vastu-check':
        message = 'I need vastu consultation';
        break;
      case 'maintenance':
        message = 'Give me maintenance advice';
        break;
      case 'cost-estimate':
        message = 'Estimate service costs';
        break;
      case 'troubleshoot':
        message = 'Help me troubleshoot a problem';
        break;
    }
    setInputMessage(message);
  };

  const handleSuggestionClick = (suggestion) => {
    setInputMessage(suggestion);
  };

  const toggleVoice = () => {
    setIsListening(!isListening);
    if (!isListening) {
      // Simulate voice recognition
      setTimeout(() => {
        setInputMessage('Find a plumber near me for kitchen sink repair');
        setIsListening(false);
      }, 3000);
    }
  };

  const toggleSpeech = () => {
    setIsSpeaking(!isSpeaking);
  };

  const formatTimestamp = (timestamp) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(timestamp);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-blue-50 to-background">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-primary rounded-lg">
              <MessageCircle className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">AI Service Assistant</h1>
              <p className="text-sm text-muted-foreground">Available 24/7 • Response time: 2-3 seconds</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
            <BackButton href="/ai-features" />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Quick Actions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Sparkles className="h-5 w-5 mr-2" />
                Quick Actions
              </CardTitle>
              <CardDescription>Get instant help with these common requests</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {quickActions.map((action) => {
                  const IconComponent = action.icon;
                  return (
                    <Button
                      key={action.id}
                      variant="outline"
                      className={`h-auto py-3 flex-col space-y-2 ${action.color} hover:scale-105 transition-transform`}
                      onClick={() => handleQuickAction(action)}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="text-xs font-medium">{action.label}</span>
                    </Button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Chat Interface */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Chat Messages */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="flex-row items-center justify-between py-3">
                  <div className="flex items-center space-x-3">
                    <Avatar className="h-8 w-8 bg-primary">
                      <AvatarFallback>
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">ServiceFlow AI</h3>
                      <p className="text-xs text-green-600 flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                        Online & Ready
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={toggleSpeech}>
                      {isSpeaking ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                    </Button>
                    <Button variant="outline" size="sm">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <Separator />
                
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`flex items-start space-x-3 max-w-[80%] ${
                          message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                        }`}>
                          <Avatar className="h-8 w-8">
                            {message.type === 'user' ? (
                              <AvatarFallback>
                                <User className="h-4 w-4" />
                              </AvatarFallback>
                            ) : (
                              <AvatarFallback className="bg-primary">
                                <Bot className="h-4 w-4 text-primary-foreground" />
                              </AvatarFallback>
                            )}
                          </Avatar>
                          
                          <div className="space-y-2">
                            <div className={`p-3 rounded-lg ${
                              message.type === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                            }`}>
                              <p className="text-sm whitespace-pre-line">{message.content}</p>
                            </div>
                            
                            {message.suggestions && (
                              <div className="flex flex-wrap gap-2">
                                {message.suggestions.map((suggestion, index) => (
                                  <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    className="text-xs h-7"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                  >
                                    {suggestion}
                                  </Button>
                                ))}
                              </div>
                            )}
                            
                            <p className="text-xs text-muted-foreground">
                              {formatTimestamp(message.timestamp)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                    
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary">
                              <Bot className="h-4 w-4 text-primary-foreground" />
                            </AvatarFallback>
                          </Avatar>
                          <div className="bg-muted p-3 rounded-lg">
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>
                
                <Separator />
                
                {/* Message Input */}
                <div className="p-4">
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Ask me anything about services..."
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        className="pr-10"
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={toggleVoice}
                      className={isListening ? 'bg-red-100 text-red-600' : ''}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim()}
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                  {isListening && (
                    <p className="text-xs text-red-600 mt-2 flex items-center">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></div>
                      Listening... Speak now
                    </p>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* AI Features */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <Brain className="h-4 w-4 mr-2" />
                    AI Capabilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Natural Language Understanding</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Service Recommendation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Provider Matching</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Cost Estimation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Multilingual Support</span>
                  </div>
                </CardContent>
              </Card>

              {/* Frequent Questions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Popular Questions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {frequentQuestions.slice(0, 6).map((question, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="w-full text-left text-xs h-auto py-2 justify-start"
                      onClick={() => setInputMessage(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    AI Performance
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span className="font-medium">2.3s</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span className="font-medium">96.8%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>User Satisfaction</span>
                    <span className="font-medium">4.9/5</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Languages</span>
                    <span className="font-medium">12+</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
