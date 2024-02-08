import axios from 'axios';

const endpoint = 'https://extra-apis.vercel.app/api/spotify?';

type Thumbnail = {
  height: number;
  url: string;
  width: number;
};

type ExternalIds = {
  isrc: string;
};

type Track = {
  artist: string;
  title: string;
  id: string;
  thumbnail: Thumbnail[];
  duration: string;
  duration_ms: number;
  preview_mp3: string | null;
  url: string;
  external_ids: ExternalIds;
};

export const spotifySearchMusic = async (query: string) => {
  try {
    const { data }: { data: { data: Track[] } } = await axios.get(`${endpoint}query=${query}`);

    if (!data.data) {
      return {
        status: false,
        data: 'Tidak ditemukan.',
      };
    }

    const list = data.data.map((m: Track, index: number) => {
      return `*${index + 1}.* ${m.title} - ${m.artist}`;
    }).join("\n\n")

    const musicIndex = data.data.map((m: Track, index: number) => index+1);

    return {
      status: true,
      data: list,
      musicIndex,
      musicLength: data.data.length,
      musicList: data.data,
    };
  } catch (err: any) {
    return {
      status: false,
      data: "Tidak ditemukan.",
    };
  }
};

export async function spotifyFetchURL(url: string) { 
     if (!url) return {status: false, message: 'No url requested'}; 
     const base = `${endpoint}url=${url}` 
     try { 
         try { 
             const {data}: any = await axios.get(base) 
             
             return data
  
         } catch (error) { 
             const res = await axios.get(base) 
             return res.data
  
         }
     } catch (error) { 
         return {status: false, message: 'Not Found'} 
     } 
  
}
