"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { Info } from "lucide-react";
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
  const checkCredits = api.Project.checkCredits.useMutation();
  const refetch = useRefetch();

  function onSubmit(data: FormInput) {
    if (!!checkCredits.data) {
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
    } else {
      checkCredits.mutate({
        githubUrl: data.repoUrl,
        githubToken: data.githubToken,
      });
    }
  }

  const hasEnoughCredits = checkCredits?.data?.userCredits
    ? checkCredits.data.fileCount <= checkCredits.data.userCredits
    : true;

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
          {!!checkCredits.data && (
            <>
              <div className="mt-4 rounded-md border border-orange-200 bg-orange-50 px-4 py-2 text-orange-500">
                <div className="flex items-center gap-2">
                  <Info className="size-4" />
                  <p className="text-sm">
                    You will be charged{" "}
                    <strong>{checkCredits.data?.fileCount}</strong> credits for
                    this repository.
                  </p>
                </div>
                <p className="ml-6 text-sm text-blue-600">
                  You have <strong>{checkCredits.data?.userCredits}</strong>{" "}
                  credits remaining.
                </p>
              </div>
            </>
          )}
          <div className="h-4"></div>
          <Button
            type="submit"
            disabled={
              createProject.isPending ||
              checkCredits.isPending ||
              !hasEnoughCredits
            }
          >
            {!!checkCredits.data ? "Create Project" : "Check Credits"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreatePage;
