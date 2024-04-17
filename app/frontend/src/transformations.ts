import { database } from "../wailsjs/go/models";

export interface Item {
  id: number;
  url: string;
  title: string;
  from?: string;
  to?: string;
}

export async function trackToItem(track: database.Track): Promise<Item> {
  const embed = await fetch(
    `https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=${track.video_id}&format=json`
  );
  const embedData = await embed.json();

  return {
    id: track.id,
    url: `https://www.youtube.com/watch?v=${track.video_id}`,
    title: embedData.title,
    from: track.from_user || undefined,
    to: track.to_user || undefined,
  };
}
