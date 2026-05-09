"use client";

import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, GripVertical, Trash2, User as UserIcon, Link as LinkIcon, Share2, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import pb from '../lib/pocketbase';
import ProfileSettings from '../components/Profile';

const Dashboard = () => {
  const { profile, links, loading, refreshData } = useApp();
  const [activeTab, setActiveTab] = useState('links');
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newUrl) return;

    try {
      await pb.collection('links').create({
        title: newTitle,
        url: newUrl,
        user: pb.authStore.model?.id,
        order: links.length,
        active: true
      });
      setNewTitle('');
      setNewUrl('');
      setIsAdding(false);
      refreshData();
    } catch (error) {
      console.error('Error adding link:', error);
    }
  };

  const handleDeleteLink = async (id: string) => {
    try {
      await pb.collection('links').delete(id);
      refreshData();
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Determine the preview URL. If there is a profile, use the public profile path.
  const previewUrl = profile?.username ? `/p/${profile.username}` : '/';

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Side */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <Button variant="outline" size="sm" asChild>
              <a href={previewUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver perfil público
              </a>
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="links" className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" />
                Enlaces
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Perfil
              </TabsTrigger>
            </TabsList>

            <TabsContent value="links" className="space-y-6">
              {!isAdding ? (
                <Button 
                  onClick={() => setIsAdding(true)} 
                  className="w-full py-6 text-lg rounded-2xl border-dashed border-2 bg-transparent hover:bg-gray-50 text-primary border-primary"
                  variant="outline"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Añadir enlace
                </Button>
              ) : (
                <Card className="p-6 border-2 border-primary animate-in fade-in slide-in-from-top-4">
                  <form onSubmit={handleAddLink} className="space-y-4">
                    <Input
                      placeholder="Título del enlace (ej: Instagram)"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                    <Input
                      placeholder="URL (ej: https://instagram.com/tuusuario)"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      required
                    />
                    <div className="flex gap-2 justify-end">
                      <Button type="button" variant="ghost" onClick={() => setIsAdding(false)}>
                        Cancelar
                      </Button>
                      <Button type="submit">Añadir</Button>
                    </div>
                  </form>
                </Card>
              )}

              <div className="space-y-4">
                {links.map((link) => (
                  <Card key={link.id} className="p-4 flex items-center gap-4 group">
                    <GripVertical className="text-gray-400 cursor-grab active:cursor-grabbing" />
                    <div className="flex-grow">
                      <h3 className="font-semibold">{link.title}</h3>
                      <p className="text-sm text-gray-500 truncate">{link.url}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleDeleteLink(link.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </Card>
                ))}
                {links.length === 0 && !isAdding && (
                  <div className="text-center py-12 text-gray-500">
                    <LinkIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p>Aún no tienes enlaces. ¡Empieza añadiendo uno!</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="profile">
              <ProfileSettings 
                name={profile?.name || ''} 
                bio={profile?.bio || ''} 
                avatarUrl={profile?.avatar ? pb.getFileUrl(profile, profile.avatar) : ''} 
              />
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Side */}
        <div className="hidden lg:block">
          <div className="sticky top-24 h-[calc(100vh-120px)] flex flex-col items-center justify-center">
            <div className="relative w-[300px] h-[600px] bg-[#1a1a1a] rounded-[3.5rem] p-3 shadow-2xl border-[12px] border-[#1a1a1a]">
              {/* Phone Notch/Island */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-[#1a1a1a] rounded-b-3xl z-20"></div>
              
              {/* Screen Container */}
              <div className="w-full h-full rounded-[2.5rem] overflow-hidden bg-white relative">
                <iframe 
                  src={previewUrl} 
                  className="w-[100%] h-[100%] border-none scale-[1.01]" 
                  title="Live Preview" 
                  style={{ transformOrigin: 'top left' }}
                />
                
                {/* Overlay to prevent interactions but show the scroll */}
                <div className="absolute inset-0 z-10 pointer-events-none"></div>
              </div>
            </div>
            
            <p className="mt-6 text-sm text-gray-500 flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Vista previa en vivo
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;