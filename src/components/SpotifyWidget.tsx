'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Music, Play, Pause, ExternalLink } from 'lucide-react';
import Image from 'next/image';

interface SpotifyTrack {
  isPlaying: boolean;
  title: string;
  artist: string;
  album: string;
  albumImageUrl: string;
  songUrl: string;
}

export default function SpotifyWidget() {
  const [track, setTrack] = useState<SpotifyTrack | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchNowPlaying();
    // Poll every 30 seconds
    const interval = setInterval(fetchNowPlaying, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchNowPlaying = async () => {
    try {
      // This would connect to your Spotify API endpoint
      // For now, we'll use mock data
      // TODO: Replace with actual API call to /api/spotify/now-playing
      
      // Mock data for demonstration
      const mockTrack: SpotifyTrack = {
        isPlaying: Math.random() > 0.5,
        title: 'The Less I Know The Better',
        artist: 'Tame Impala',
        album: 'Currents',
        albumImageUrl: 'https://placehold.co/300x300/3b82f6/ffffff?text=Album+Art',
        songUrl: 'https://open.spotify.com/track/6K4t31amVTZDgR3sKmwUJJ',
      };
      
      setTrack(mockTrack);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching Spotify data:', err);
      setError(true);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-green-500/10 to-emerald-500/10 p-6">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !track) {
    return (
      <motion.div
        className="rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
          <Music className="w-6 h-6" />
          <div>
            <p className="font-semibold">Not Playing</p>
            <p className="text-sm">Currently offline</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="group relative rounded-xl border border-slate-200 dark:border-slate-700 bg-gradient-to-br from-green-500/10 via-emerald-500/10 to-teal-500/10 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20 p-6 overflow-hidden backdrop-blur-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      {/* Animated Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative flex items-center gap-4">
        {/* Album Art */}
        <div className="relative">
          <div className="relative w-20 h-20 rounded-lg overflow-hidden shadow-lg ring-2 ring-green-500/20">
            <Image
              src={track.albumImageUrl}
              alt={`${track.album} cover`}
              width={80}
              height={80}
              className="object-cover"
            />
            
            {/* Playing Indicator */}
            {track.isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Play className="w-6 h-6 text-green-400 fill-current" />
                </motion.div>
              </div>
            )}
            
            {!track.isPlaying && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <Pause className="w-6 h-6 text-slate-400" />
              </div>
            )}
          </div>
          
          {/* Spotify Logo */}
          <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
            <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
          </div>
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="font-bold text-slate-800 dark:text-white truncate text-lg mb-1">
                {track.title}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                {track.artist}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-500 truncate mt-1">
                {track.album}
              </p>
            </div>

            {/* External Link */}
            <motion.a
              href={track.songUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors shadow-lg"
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              title="Open in Spotify"
            >
              <ExternalLink className="w-4 h-4" />
            </motion.a>
          </div>

          {/* Status Badge */}
          <div className="mt-3 flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
              track.isPlaying
                ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
            }`}>
              {track.isPlaying ? (
                <>
                  <motion.div
                    className="w-2 h-2 rounded-full bg-green-500"
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  />
                  <span>Now Playing</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Last Played</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Equalizer Animation (only when playing) */}
      {track.isPlaying && (
        <div className="absolute top-4 right-4 flex items-end gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1 bg-green-500 rounded-full"
              animate={{
                height: ['8px', '16px', '8px'],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

// Instructions for setting up Spotify API:
/*
1. Create a Spotify App at https://developer.spotify.com/dashboard
2. Get your Client ID and Client Secret
3. Set up redirect URI (your website URL)
4. Create an API route at /api/spotify/now-playing
5. Implement OAuth flow to get access token
6. Use Spotify Web API to fetch currently playing track
7. Cache the result for ~30 seconds

Example API endpoint code (save as /api/spotify/now-playing/route.ts):

// import { NextResponse } from 'next/server';
//
// const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
// const SPOTIFY_NOW_PLAYING_URL = 'https://api.spotify.com/v1/me/player/currently-playing';
//
// const client_id = process.env.SPOTIFY_CLIENT_ID;
// const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
// const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;
//
// export async function GET() {
//   // Implementation here...
// }
*/

