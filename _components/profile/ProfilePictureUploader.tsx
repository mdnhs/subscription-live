"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Check, RotateCw, Upload, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ProfilePictureUploaderProps {
  currentImageUrl?: string;
  fallbackInitial?: string;
  size?: "sm" | "md" | "lg" | "xl";
  onImageChange?: (file: File, previewUrl: string) => void;
  disabled?: boolean;
  isEditing?: boolean;
}

const ProfilePictureUploader = ({
  currentImageUrl,
  fallbackInitial = "U",
  size = "lg",
  onImageChange,
  disabled = false,
  isEditing = false,
}: ProfilePictureUploaderProps) => {
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);

  // Image Editor State
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Size mapping for avatar
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-40 w-40",
  };

  useEffect(() => {
    // Only process the file and open editor if we have a profilePic and not currently processing
    if (profilePic && !processingImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
        setImageEditorOpen(true);
        // Reset editing state
        setZoom(1);
        setRotation(0);
        setPosition({ x: 0, y: 0 });
      };
      reader.readAsDataURL(profilePic);
    }
  }, [profilePic, processingImage]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      setProcessingImage(false);
      setProfilePic(file);
    }
  };

  const handleUploadClick = () => {
    if (!disabled && isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAvatarClick = () => {
    if (!isEditing && (croppedImage || currentImageUrl)) {
      setPreviewDialogOpen(true);
    }
  };

  const handleDragStart = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleDragMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleZoomChange = (value: number[]) => {
    setZoom(value[0]);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const applyImageEdit = () => {
    if (!previewImage || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    setProcessingImage(true);

    // Set canvas dimensions to match desired output
    canvas.width = 300;
    canvas.height = 300;

    const img = new window.Image();
    img.onload = () => {
      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate the size of the image to fit within the canvas
      const canvasSize = Math.min(canvas.width, canvas.height);
      const imgAspect = img.width / img.height;
      let drawWidth = img.width * zoom;
      let drawHeight = img.height * zoom;

      // Ensure the image fits within the circular crop area
      if (imgAspect > 1) {
        drawHeight = canvasSize / zoom;
        drawWidth = drawHeight * imgAspect;
      } else {
        drawWidth = canvasSize / zoom;
        drawHeight = drawWidth / imgAspect;
      }

      // Center the image on the canvas
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.drawImage(
        img,
        -drawWidth / 2 + position.x / zoom,
        -drawHeight / 2 + position.y / zoom,
        drawWidth,
        drawHeight
      );
      ctx.restore();

      const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
      setCroppedImage(dataUrl);

      fetch(dataUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const newFile = new File([blob], "profile-picture.jpg", {
            type: "image/jpeg",
          });
          setProfilePic(newFile);
          setImageEditorOpen(false);
          setPreviewImage(null);
          if (onImageChange) {
            onImageChange(newFile, dataUrl);
          }
        });
    };
    img.src = previewImage;
  };

  const cancelImageEdit = () => {
    setImageEditorOpen(false);
    // Reset states if no cropped image exists
    if (!croppedImage) {
      setProfilePic(null);
    }
    setPreviewImage(null);
    setProcessingImage(false);
  };

  return (
    <>
      <div className="flex flex-col items-center gap-3">
        <div className="relative">
          <Avatar
            className={`${sizeClasses[size]} border-4 border-primary/10 cursor-pointer`}
            onClick={handleAvatarClick}
          >
            <AvatarImage
              src={croppedImage || currentImageUrl}
              className="object-contain"
            />
            <AvatarFallback className="text-3xl font-bold bg-gradient-to-br from-primary/70 to-primary/30 text-white">
              {fallbackInitial}
            </AvatarFallback>
          </Avatar>

          {isEditing && (
            <>
              <Input
                ref={fileInputRef}
                type="file"
                id="profile-pic"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                disabled={disabled}
              />

              <div
                className={`absolute inset-0 rounded-full flex items-center justify-center cursor-pointer transition-opacity duration-200 opacity-100`}
                style={{ backdropFilter: "blur(2px)" }}
                onClick={handleUploadClick}
              >
                <div className="bg-black/30 rounded-full flex items-center justify-center w-full h-full">
                  <Upload className="text-white w-8 h-8" />
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Image Editor Dialog */}
      <Dialog
        open={imageEditorOpen}
        onOpenChange={(open) => {
          if (!open) {
            cancelImageEdit();
          }
          setImageEditorOpen(open);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            {/* Hidden canvas for cropping */}
            <canvas
              ref={canvasRef}
              className="hidden"
              width="300"
              height="300"
            ></canvas>

            {/* Image preview container */}
            <div className="relative w-64 h-64 overflow-hidden rounded-full border-2 border-primary/20">
              <div
                ref={imageRef}
                className="absolute cursor-move"
                style={{
                  transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  transformOrigin: "center",
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                onMouseDown={handleDragStart}
                onMouseMove={handleDragMove}
                onMouseUp={handleDragEnd}
                onMouseLeave={handleDragEnd}
              >
                {previewImage && (
                  <Image
                    src={previewImage}
                    alt="Preview"
                    width={512}
                    height={512}
                    style={{
                      maxHeight: "200%",
                      maxWidth: "200%",
                    }}
                    objectFit="contain"
                  />
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="space-y-4 w-full">
              <div className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[zoom]}
                  min={0.5}
                  max={3}
                  step={0.1}
                  onValueChange={handleZoomChange}
                />
                <ZoomIn className="h-4 w-4 text-muted-foreground" />
              </div>

              <div className="flex justify-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRotate}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotate
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter className="flex justify-between">
            <Button variant="outline" onClick={cancelImageEdit}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={applyImageEdit}>
              <Check className="h-4 w-4 mr-2" />
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Profile Picture Preview Dialog */}
      <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Profile Picture</DialogTitle>
          </DialogHeader>

          <div className="flex justify-center items-center">
            <Image
              src={croppedImage || currentImageUrl || ""}
              alt="Profile Picture"
              width={400}
              height={400}
              style={{ objectFit: "contain" }}
              className="rounded-full"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setPreviewDialogOpen(false)}
            >
              <X className="h-4 w-4 mr-2" />
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProfilePictureUploader;
