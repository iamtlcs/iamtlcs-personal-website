'use client';

export default function SpotifyWidget() {
  return (
    <div className="w-full">
      <iframe 
        data-testid="embed-iframe" 
        style={{ borderRadius: '12px' }} 
        src="https://open.spotify.com/embed/artist/2QcZxAgcs2I1q7CtCkl6MI?utm_source=generator&theme=0" 
        width="100%" 
        height="352" 
        frameBorder="0" 
        allowFullScreen={true}
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy"
      />
    </div>
  );
}

