import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://mgczbzbxpksjjkyegoqc.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1nY3piemJ4cGtzampreWVnb3FjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI0MjYzNTEsImV4cCI6MjA1ODAwMjM1MX0.UjnhQXdjc8_M6h3d4Hew1Jjpy3NXYv_ybgLkTggjwKU";

export const supabase = createClient(supabaseUrl, supabaseKey);

export const uploadImage = async (file, bucket, folder) => {
  try {
    const fileExt = file.name.split(".").pop();
    // Usamos backticks para interpolar correctamente las variables
    const fileName = `${Math.random()
      .toString(36)
      .substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Sube la imagen al bucket correcto (por ejemplo, "foto-gallery")
    const { error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    // Obtén la URL pública del archivo
    const { data: urlData, error: publicUrlError } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    if (publicUrlError) {
      throw publicUrlError;
    }

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error al subir imagen:", error);
    throw error;
  }
};
