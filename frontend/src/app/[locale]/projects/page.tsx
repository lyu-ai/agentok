"use client";

import { useRouter } from "next/navigation";
import ProjectList from "../components/ProjectList";
import { initialEdges, initialNodes, useProjects } from "@/hooks";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { RiSwap3Line, RiShoppingBag4Line } from "react-icons/ri";
import Link from "next/link";
import Image from "next/image";
import TemplateList from "../components/TemplateList";
import { useEffect } from "react";

const Page = () => {
  const t = useTranslations("page.Projects");
  const router = useRouter();
  const { createProject, setActiveProjectId } = useProjects();
  useEffect(() => {
    setActiveProjectId(-1);
  }, []);
  const onCreateProject = async () => {
    const project = await createProject({
      id: -1, // Will be replaced by actual id from server side
      name: "New Project",
      description: "A new project with sample flow.",
      flow: {
        nodes: initialNodes,
        edges: initialEdges,
      },
    });
    if (!project) {
      toast.error("Failed to create project");
      return;
    }
    toast.success("Project created. Now jumping to project page.");
    router.push(`/projects/${project.id}/flow`);
  };
  return (
    <div className="flex flex-col w-full gap-2">
      <title>Projects | Agentok Studio</title>
      <div className="flex flex-col items-center justify-center gap-4 text-sm p-2">
        <Image
          priority
          src="/logo.svg"
          width={100}
          height={100}
          alt="logo"
          className="mt-8"
        />
        <span className="text-5xl font-bold font-arial p-4">{t("title")}</span>
        <span className="text-lg p-4">{t("description")}</span>
        <ProjectList />
        <button onClick={onCreateProject} className="btn btn-primary">
          <RiSwap3Line className="w-7 h-7" />
          {t("create-project")}
        </button>
      </div>
      <div className="divider text-2xl">Or</div>
      <div className="flex flex-col items-center justify-center gap-2 text-sm py-8 mb-12">
        <RiShoppingBag4Line className="w-16 h-16 text-primary" />
        <span className="text-2xl p-4">{t("start-from-template")}</span>
        <TemplateList maxCount={3} />
        <Link
          href="/discover"
          className="btn btn-primary btn-lg btn-outline text-lg mt-8"
        >
          {t("discover")}
        </Link>
      </div>
    </div>
  );
};

export default Page;
