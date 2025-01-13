"use client";
import useProject from "@/hooks/use-project";

const DashboardPage = () => {
  const { project } = useProject();

  return <div>{project?.name}</div>;
};

export default DashboardPage;
