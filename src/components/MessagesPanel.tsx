import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Message, Profile, Hostel } from '../types';
import { Button } from './figma/ui/button';
import { Input } from './figma/ui/input';
import { Send } from 'lucide-react';

interface Props {
  type: 'owner' | 'student';
  profileId: string;
  hostelId?: string;
}

interface Conversation {
  student: Profile;
  hostel: Hostel;
  lastMessage: Message;
  messages: Message[];
}

export default function MessagesPanel({ type, profileId, hostelId }: Props) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileId, hostelId]);

  async function fetchMessages() {
    if (!isSupabaseConfigured()) return;
    setLoading(true);

    let query = supabase
      .from('messages')
      .select('*, student:profiles!student_id(*), hostel:hostels(*), sender:profiles!sender_id(*)');

    if (type === 'owner' && hostelId) {
      query = query.eq('hostel_id', hostelId);
    } else if (type === 'student') {
      query = query.eq('student_id', profileId);
    } else {
      setLoading(false);
      return;
    }

    const { data, error } = await query.order('created_at', { ascending: true });
    
    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // Group by conversation
    const groups: Record<string, Conversation> = {};
    (data as Message[]).forEach(msg => {
      if (!msg.student || !msg.hostel) return;
      const key = `${msg.student_id}_${msg.hostel_id}`;
      if (!groups[key]) {
        groups[key] = {
          student: msg.student,
          hostel: msg.hostel,
          lastMessage: msg,
          messages: []
        };
      }
      groups[key].messages.push(msg);
      groups[key].lastMessage = msg;
    });

    const convList = Object.values(groups).sort((a, b) => 
      new Date(b.lastMessage.created_at).getTime() - new Date(a.lastMessage.created_at).getTime()
    );

    setConversations(convList);
    if (convList.length > 0 && !selectedConv) {
      setSelectedConv(convList[0]);
    } else if (selectedConv) {
      const updated = convList.find(c => c.student.id === selectedConv.student.id && c.hostel.id === selectedConv.hostel.id);
      if (updated) setSelectedConv(updated);
    }
    setLoading(false);
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !newMessage.trim() || !isSupabaseConfigured()) return;

    setSending(true);
    const { error } = await supabase.from('messages').insert({
      student_id: selectedConv.student.id,
      hostel_id: selectedConv.hostel.id,
      sender_id: profileId,
      content: newMessage.trim()
    });

    if (error) {
      toast.error("Failed to send message: " + error.message);
    } else {
      setNewMessage("");
      fetchMessages();
    }
    setSending(false);
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground">Loading messages...</div>;
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-card border border-border rounded-2xl p-12 text-center text-muted-foreground">
        No messages yet.
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden flex h-[600px]">
      {/* Sidebar */}
      <div className="w-1/3 border-r border-border overflow-y-auto bg-muted/20">
        {conversations.map((conv, i) => {
          const isSelected = selectedConv?.student.id === conv.student.id && selectedConv?.hostel.id === conv.hostel.id;
          const partnerName = type === 'owner' ? conv.student.full_name : conv.hostel.name;
          return (
            <div 
              key={i}
              onClick={() => setSelectedConv(conv)}
              className={`p-4 border-b border-border cursor-pointer transition-colors ${isSelected ? 'bg-background border-l-4 border-l-primary' : 'hover:bg-muted/50'}`}
            >
              <h4 className="font-bold text-sm truncate">{partnerName}</h4>
              <p className="text-xs text-muted-foreground truncate mt-1">
                {conv.lastMessage.sender_id === profileId ? "You: " : ""}{conv.lastMessage.content}
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Chat Area */}
      {selectedConv ? (
        <div className="flex-1 flex flex-col bg-background">
          <div className="p-4 border-b border-border bg-card">
            <h3 className="font-bold text-lg">
              {type === 'owner' ? selectedConv.student.full_name : selectedConv.hostel.name}
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedConv.messages.map(msg => {
              const isMe = msg.sender_id === profileId;
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] rounded-2xl px-4 py-2 text-sm ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                    {msg.content}
                  </div>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-border bg-card flex gap-2">
            <Input 
              placeholder="Type your message..." 
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={!newMessage.trim() || sending}>
              <Send size={16} className={newMessage.trim() ? '' : 'text-muted-foreground'} />
            </Button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          Select a conversation
        </div>
      )}
    </div>
  );
}
