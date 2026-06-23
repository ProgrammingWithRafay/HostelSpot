import { toast } from 'sonner';
import { useState, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';
import type { HostelImage } from '../../types';

interface Props {
  hostelId: string;
  images: HostelImage[];
}

export default function ImageGalleryEditor({ hostelId, images: initialImages }: Props) {
  const [images, setImages] = useState(initialImages);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isSupabaseConfigured()) {
      // Fake upload for UI demonstration
      const newImg: HostelImage = {
        id: Math.random().toString(),
        hostel_id: hostelId,
        image_url: URL.createObjectURL(file),
        is_primary: images.length === 0,
        created_at: new Date().toISOString()
      };
      setImages(prev => [...prev, newImg]);
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${hostelId}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('hostel_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('hostel_images')
        .getPublicUrl(filePath);

      const newImg = {
        hostel_id: hostelId,
        image_url: publicUrl,
        is_primary: images.length === 0,
      };

      const { data, error: dbError } = await supabase
        .from('hostel_images')
        .insert(newImg)
        .select()
        .single();

      if (dbError) throw dbError;
      if (data) setImages(prev => [...prev, data]);
    } catch (error: unknown) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const removeImage = async (id: string) => {
    if (isSupabaseConfigured()) {
      const { error } = await supabase.from('hostel_images').delete().eq('id', id);
      if (error) console.error('Failed to delete from DB:', error);
    }
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const setPrimary = async (id: string) => {
    if (isSupabaseConfigured()) {
      await supabase.from('hostel_images').update({ is_primary: false }).eq('hostel_id', hostelId);
      await supabase.from('hostel_images').update({ is_primary: true }).eq('id', id);
    }
    setImages(prev => prev.map(img => ({
      ...img,
      is_primary: img.id === id
    })));
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground">Hostel Images</h2>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          ref={fileInputRef} 
          onChange={handleUpload} 
        />
        <button 
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-primary text-primary-foreground px-6 py-3 rounded-xl text-sm font-bold transition-all hover:bg-primary/90 disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : '+ Upload Image'}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map(img => (
          <div key={img.id} className="group relative aspect-square border border-border rounded-xl overflow-hidden bg-muted shadow-sm">
            <img src={img.image_url} alt="Hostel" className="w-full h-full object-cover" />
            
            {img.is_primary && (
              <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-primary-foreground rounded-lg text-[10px] font-bold uppercase tracking-widest shadow-sm">
                Primary
              </div>
            )}

            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-4">
              {!img.is_primary && (
                <button 
                  onClick={() => setPrimary(img.id)}
                  className="bg-background text-foreground px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-muted transition-colors"
                >
                  Make Primary
                </button>
              )}
              <button 
                onClick={() => removeImage(img.id)}
                className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-destructive/90 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        {images.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-border rounded-2xl bg-muted/50">
            <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-border">
              <span className="material-symbols-outlined text-[32px] text-muted-foreground">image</span>
            </div>
            <p className="text-xl font-bold text-foreground mb-2">No images uploaded yet.</p>
            <p className="text-muted-foreground">Add high quality photos to attract more students.</p>
          </div>
        )}
      </div>
    </div>
  );
}
