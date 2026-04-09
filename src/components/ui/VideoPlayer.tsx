"use client";

import { useState } from "react";
import { FaExclamationTriangle } from "react-icons/fa";

interface VideoPlayerProps {
  videoId: string; // YouTube video ID (e.g., "AYpftDFiIgk") or full URL
  title?: string;
}

export default function VideoPlayer({ videoId, title = "Course Video" }: VideoPlayerProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  // Extract video ID from various YouTube URL formats
  const extractVideoId = (input: string): string | null => {
    if (!input) return null;
    
    // If it's already just an ID (11 characters)
    if (input.match(/^[a-zA-Z0-9_-]{11}$/)) {
      return input;
    }
    
    // Handle various YouTube URL formats
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/,
      /youtube\.com\/shorts\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = input.match(pattern);
      if (match) return match[1];
    }
    
    return null;
  };

  const extractedId = extractVideoId(videoId);
  const isValidId = extractedId !== null;
  const embedUrl = isValidId 
    ? `https://www.youtube.com/embed/${extractedId}?rel=0&modestbranding=1&enablejsapi=1`
    : null;

  if (!isValidId || !embedUrl) {
    return (
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-red-500/30 bg-slate-900 flex items-center justify-center">
        <div className="text-center p-6">
          <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
          <p className="text-red-400 font-medium">Invalid Video URL or ID</p>
          <p className="text-slate-400 text-sm mt-2">Please check the video link and try again.</p>
          <p className="text-slate-500 text-xs mt-2">Video ID attempted: {videoId}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.15)] bg-slate-900">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900 z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      )}
      
      <iframe
        className="absolute top-0 left-0 w-full h-full"
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true);
          setLoading(false);
        }}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 backdrop-blur-sm">
          <div className="text-center p-6">
            <FaExclamationTriangle className="text-5xl text-red-500 mx-auto mb-4" />
            <p className="text-red-400 font-medium">Failed to load video</p>
            <p className="text-slate-400 text-sm mt-2">The video may be unavailable or has embedding disabled.</p>
          </div>
        </div>
      )}
    </div>
  );
}