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
import { getCroppedImg } from "@/lib/cropImage";
import { Check, RotateCw, Upload, X, ZoomIn, ZoomOut } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import Cropper, { Area } from "react-easy-crop";

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
  const [imageEditorOpen, setImageEditorOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [processingImage, setProcessingImage] = useState(false);

  // Crop state
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Size mapping for avatar
  const sizeClasses = {
    sm: "h-16 w-16",
    md: "h-24 w-24",
    lg: "h-32 w-32",
    xl: "h-40 w-40",
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreviewImage(e.target?.result as string);
        setImageEditorOpen(true);
        setZoom(1);
        setRotation(0);
        setCrop({ x: 0, y: 0 });
      };
      reader.readAsDataURL(file);
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

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const applyImageEdit = async () => {
    if (!previewImage || !croppedAreaPixels) return;

    setProcessingImage(true);
    try {
      const croppedImageData = await getCroppedImg(
        previewImage,
        croppedAreaPixels,
      );

      setCroppedImage(croppedImageData.url);

      const newFile = new File([croppedImageData.file], "profile-picture.jpg", {
        type: "image/jpeg",
      });
      
      if (onImageChange) {
        onImageChange(newFile, croppedImageData.url);
      }
      
      // Close the dialog after successful crop
      setImageEditorOpen(false);
      setPreviewImage(null);
    } catch (e) {
      console.error("Error cropping image", e);
    } finally {
      setProcessingImage(false);
    }
  };

  const cancelImageEdit = () => {
    setImageEditorOpen(false);
    setPreviewImage(null);
    setProcessingImage(false);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
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
              className="object-cover"
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
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Profile Picture</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col items-center gap-4">
            {/* Image cropping area */}
            <div className="relative w-64 h-64">
              {previewImage && (
                <Cropper
                  image={previewImage}
                  crop={crop}
                  zoom={zoom}
                  rotation={rotation}
                  aspect={1}
                  onCropChange={setCrop}
                  onCropComplete={onCropComplete}
                  onZoomChange={setZoom}
                  cropShape="round"
                  showGrid={false}
                />
              )}
            </div>

            {/* Controls */}
            <div className="space-y-4 w-full">
              <div className="flex items-center gap-2">
                <ZoomOut className="h-4 w-4 text-muted-foreground" />
                <Slider
                  value={[zoom]}
                  min={1}
                  max={3}
                  step={0.1}
                  onValueChange={(value) => setZoom(value[0])}
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
            <Button onClick={applyImageEdit} disabled={processingImage}>
              <Check className="h-4 w-4 mr-2" />
              {processingImage ? "Processing..." : "Apply"}
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
              className="object-cover rounded-full"
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