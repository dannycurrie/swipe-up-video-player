import { useCallback, useEffect, useState } from "react";

const mockVideo = {
  id: "1",
  title: "JAQ Video",
  url: "https://www.youtube.com/watch?v=4PGX9taVZKE",
  thumbnail: "https://via.placeholder.com/150",
  favourite: false,
};

type Video = {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  favourite: boolean;
};

const API_KEY = "AIzaSyAl8PncnMEYO_fPBxH-PXlxCwfwBknFb_Y";
const chunksize = 5;
let pageToken = "";

const getYouTubeVideos = async (
  number: Number,
  setVideos: (videos: Video[]) => void
): Promise<void> => {
  const response = await fetch(
    `https://youtube.googleapis.com/youtube/v3/videos?chart=mostPopular&part=snippet&maxResults=${number}&q=react&key=${API_KEY}&pageToken=${pageToken}`
  );
  const data = await response.json();
  const videos = data.items.map((item: any) => ({
    id: item.id,
    title: item.snippet.title,
    url: `https://www.youtube.com/watch?v=${item.id}`,
    thumbnail: item.snippet.thumbnails.high.url,
    favourite: false,
  }));
  pageToken = data.nextPageToken;
  setVideos(videos);
};

type UseVideos = [
  Video[],
  (videos: Video[]) => void,
  number,
  (nextVideoIndex: number) => void
];

export default function useVideos(): UseVideos {
  const [videos, setVideos] = useState([mockVideo]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const addVideos = (newVideos: Video[]) =>
    setVideos([...videos, ...newVideos]);

  useEffect(() => {
    getYouTubeVideos(chunksize, addVideos);
  }, []);

  const loadNextVideo = (nextVideoIndex: number) => {
    setCurrentVideoIndex(nextVideoIndex);
    // if we are near the end of the queue, load more videos
    if (nextVideoIndex >= videos.length - 3) {
      getYouTubeVideos(chunksize, addVideos);
    }
  };

  return [videos, setVideos, currentVideoIndex, loadNextVideo];
}
