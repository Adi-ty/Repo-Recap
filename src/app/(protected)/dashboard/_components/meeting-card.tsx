"use client";

import { Card } from "@/components/ui/card";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { useDropzone } from "react-dropzone";
import React from "react";
import { uploadFile } from "@/lib/firebase";
import { Presentation, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { api } from "@/trpc/react";
import useProject from "@/hooks/use-project";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const MeetingCard = () => {
  const router = useRouter();
  const processMeeting = useMutation({
    mutationFn: async (data: { meetingUrl: string; meetingId: string }) => {
      const { meetingUrl, meetingId } = data;
      const response = await axios.post("/api/process-meeting", {
        meetingUrl,
        meetingId,
      });
      return response.data;
    },
  });

  const { project } = useProject();
  const [isUploading, setIsUploading] = React.useState(false);
  const [progress, setProgress] = React.useState(0);
  const uploadMeeting = api.Project.uploadMeeting.useMutation();
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "audio/*": [".mp3", ".wav", ".m4a"],
    },
    multiple: false,
    maxSize: 25_000_000,
    onDrop: async (acceptedFiles) => {
      if (!project) return;
      setIsUploading(true);
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (!file) return;

      const downloadUrl = (await uploadFile(
        file as File,
        setProgress,
      )) as string;

      uploadMeeting.mutate(
        {
          projectId: project.id,
          meetingUrl: downloadUrl,
          name: file.name,
        },
        {
          onSuccess: (meeting) => {
            toast.success("Meeting uploaded successfully");
            router.push("/meetings");
            processMeeting.mutateAsync({
              meetingUrl: downloadUrl,
              meetingId: meeting.id,
            });
          },
          onError: () => {
            toast.error("Failed to upload meeting");
          },
        },
      );

      setIsUploading(false);
    },
  });
  return (
    <Card
      className="col-span-2 flex flex-col items-center justify-center p-10"
      {...getRootProps()}
    >
      {!isUploading && (
        <>
          <Presentation className="size-10 animate-bounce" />
          <h3 className="mt-2 text-sm font-semibold text-gray-900">
            Create a new meeting
          </h3>
          <p className="mt-1 text-center text-sm text-gray-500">
            Analyze your meeting with Repo Recap
          </p>
          <div className="mt-6">
            <Button disabled={isUploading}>
              <Upload className="-ml-0.5 mr-1.5 size-5" aria-hidden="true" />
              Upload Meeting
              <input className="hidden" {...getInputProps()} />
            </Button>
          </div>
        </>
      )}
      {isUploading && (
        <div>
          <CircularProgressbar
            value={progress}
            text={`${progress}%`}
            className="size-20"
            styles={buildStyles({
              textColor: "#31c96e",
              pathColor: "#31c96e",
            })}
          />
          <p className="text-center text-sm text-gray-500">
            Uplaoding your meeting...
          </p>
        </div>
      )}
    </Card>
  );
};

export default MeetingCard;
