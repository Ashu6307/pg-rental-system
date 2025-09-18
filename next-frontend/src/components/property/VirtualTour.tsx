import React, { useState, useRef, useEffect } from 'react';
import { 
  FaPlay, 
  FaPause, 
  FaExpand, 
  FaCompress, 
  FaVolumeUp, 
  FaVolumeMute,
  FaRedo,
  FaUndo,
  FaSearchPlus,
  FaSearchMinus,
  FaHome,
  FaBed,
  FaBath,
  FaUtensils,
  FaCouch,
  FaTimes,
  FaInfoCircle
} from 'react-icons/fa';

interface VirtualTourProps {
  propertyId: string;
  propertyTitle: string;
  tourData: {
    id: string;
    title: string;
    thumbnail: string;
    panoramaUrl: string;
    roomType: string;
    description?: string;
  }[];
  isOpen: boolean;
  onClose: () => void;
}

interface Room {
  id: string;
  title: string;
  thumbnail: string;
  panoramaUrl: string;
  roomType: string;
  description?: string;
}

const VirtualTour: React.FC<VirtualTourProps> = ({
  propertyId,
  propertyTitle,
  tourData,
  isOpen,
  onClose
}) => {
  const [currentRoom, setCurrentRoom] = useState<Room>(tourData[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);

  const roomIcons = {
    living: FaCouch,
    bedroom: FaBed,
    bathroom: FaBath,
    kitchen: FaUtensils,
    entrance: FaHome,
    default: FaHome
  };

  useEffect(() => {
    if (isOpen && currentRoom) {
      // Simulate panorama loading
      const timer = setTimeout(() => {
        setIsPlaying(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, currentRoom]);

  const handleFullscreen = () => {
    if (!isFullscreen) {
      containerRef.current?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    setIsFullscreen(!isFullscreen);
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 90);
  };

  const getRoomIcon = (roomType: string) => {
    const IconComponent = roomIcons[roomType as keyof typeof roomIcons] || roomIcons.default;
    return <IconComponent />;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div ref={containerRef} className="flex-1 relative">
        {/* Header Controls */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/80 to-transparent p-4">
          <div className="flex items-center justify-between text-white">
            <div>
              <h2 className="text-xl font-bold">{propertyTitle}</h2>
              <p className="text-sm opacity-80">{currentRoom.title}</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                aria-label="Toggle info"
              >
                <FaInfoCircle />
              </button>
              <button
                onClick={handleFullscreen}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? <FaCompress /> : <FaExpand />}
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
                aria-label="Close virtual tour"
              >
                <FaTimes />
              </button>
            </div>
          </div>
        </div>

        {/* Panorama Viewer */}
        <div 
          ref={panoramaRef}
          className="w-full h-full bg-gray-900 flex items-center justify-center relative overflow-hidden"
        >
          <div 
            className="w-full h-full bg-cover bg-center transition-transform duration-300"
            style={{
              backgroundImage: `url(${currentRoom.panoramaUrl || currentRoom.thumbnail})`,
              transform: `scale(${zoom}) rotate(${rotation}deg)`,
            }}
          >
            {/* 360° Panorama placeholder - In real implementation, use a library like A-Frame or Three.js */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-white/50 rounded-full animate-spin border-t-white"></div>
                <p className="text-lg font-semibold">360° Virtual Tour</p>
                <p className="text-sm opacity-80">Use mouse to look around</p>
              </div>
            </div>
          </div>
        </div>

        {/* Room Info Overlay */}
        {showInfo && currentRoom.description && (
          <div className="absolute bottom-20 left-4 right-4 bg-black/80 text-white p-4 rounded-lg">
            <h3 className="font-semibold mb-2">{currentRoom.title}</h3>
            <p className="text-sm">{currentRoom.description}</p>
          </div>
        )}

        {/* Control Panel */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-6 py-3 rounded-full flex items-center gap-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label={isPlaying ? "Pause tour" : "Play tour"}
          >
            {isPlaying ? <FaPause /> : <FaPlay />}
          </button>
          
          <div className="w-px h-6 bg-white/30"></div>
          
          <button
            onClick={handleRotateLeft}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Rotate left"
          >
            <FaUndo />
          </button>
          
          <button
            onClick={handleRotateRight}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Rotate right"
          >
            <FaRedo />
          </button>
          
          <div className="w-px h-6 bg-white/30"></div>
          
          <button
            onClick={handleZoomOut}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Zoom out"
          >
            <FaSearchMinus />
          </button>
          
          <span className="text-sm min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
          
          <button
            onClick={handleZoomIn}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Zoom in"
          >
            <FaSearchPlus />
          </button>
          
          <div className="w-px h-6 bg-white/30"></div>
          
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <FaVolumeMute /> : <FaVolumeUp />}
          </button>
        </div>

        {/* Room Navigation */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-black/80 text-white p-2 rounded-lg">
            <h4 className="text-sm font-semibold mb-2">Rooms</h4>
            <div className="space-y-1">
              {tourData.map((room) => (
                <button
                  key={room.id}
                  onClick={() => setCurrentRoom(room)}
                  className={`flex items-center gap-2 w-full p-2 rounded text-left text-sm transition-colors ${
                    currentRoom.id === room.id 
                      ? 'bg-blue-500 text-white' 
                      : 'hover:bg-white/20'
                  }`}
                >
                  {getRoomIcon(room.roomType)}
                  <span>{room.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VirtualTour;