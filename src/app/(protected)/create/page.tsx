"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type FormInput = {
  projectName: string;
  repoUrl: string;
  githubToken?: string;
};

const CreatePage = () => {
  const { register, handleSubmit, reset } = useForm<FormInput>();
  const createProject = api.Project.createProject.useMutation();
  const refetch = useRefetch();

  function onSubmit(data: FormInput) {
    createProject.mutate(
      {
        name: data.projectName,
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
          refetch();
          reset();
        },
        onError: () => {
          toast.error("Failed to create project");
        },
      },
    );
    return true;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <div className="flex flex-col items-center">
        <h1 className="text-2xl font-semibold">Link your GitHub repository</h1>
        <p className="text-sm text-muted-foreground">
          Link your GitHub repository to get started
        </p>
      </div>
      <div className="h-4"></div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register("projectName", { required: true })}
            placeholder="Project Name"
            required
          />
          <div className="h-2"></div>
          <Input
            {...register("repoUrl", { required: true })}
            placeholder="Github Repo URL"
            type="url"
            required
          />
          <div className="h-2"></div>
          <Input
            {...register("githubToken")}
            placeholder="Github Token (Optional)"
          />
          <div className="h-4"></div>
          <Button type="submit" disabled={createProject.isPending}>
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
