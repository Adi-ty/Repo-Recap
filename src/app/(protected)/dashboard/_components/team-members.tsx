"use client";

import useProject from "@/hooks/use-project";
import { api } from "@/trpc/react";
import {
  motion,
  useTransform,
  AnimatePresence,
  useMotionValue,
  useSpring,
} from "framer-motion";
import React from "react";

const TeamMembers = () => {
  const { projectId } = useProject();
  const { data: members } = api.Project.getTeamMembers.useQuery({ projectId });

  const [hoveredIndex, setHoveredIndex] = React.useState("");
  const springConfig = { stiffness: 100, damping: 5 };
  const x = useMotionValue(0); // going to set this value on mouse move
  // rotate the tooltip
  const rotate = useSpring(
    useTransform(x, [-100, 100], [-45, 45]),
    springConfig,
  );
  // translate the tooltip
  const translateX = useSpring(
    useTransform(x, [-100, 100], [-50, 50]),
    springConfig,
  );
  const handleMouseMove = (event: any) => {
    const halfWidth = event.target.offsetWidth / 2;
    x.set(event.nativeEvent.offsetX - halfWidth); // set the x value, which is then used in transform and rotate
  };

  return (
    <>
      <div className="flex items-center p-2">
        {members?.map((member, index) => (
          <div
            className="group relative -mr-4"
            key={member.id}
            onMouseEnter={() => setHoveredIndex(member.id)}
            onMouseLeave={() => setHoveredIndex("")}
          >
            <AnimatePresence mode="popLayout">
              {hoveredIndex === member.id && (
                <motion.div
                  initial={{ opacity: 0, y: -20, scale: 0.6 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: {
                      type: "spring",
                      stiffness: 260,
                      damping: 10,
                    },
                  }}
                  exit={{ opacity: 0, y: -20, scale: 0.6 }}
                  style={{
                    translateX: translateX,
                    rotate: rotate,
                    whiteSpace: "nowrap",
                  }}
                  className="absolute -left-1/2 top-10 z-50 flex translate-x-1/2 flex-col items-center justify-center rounded-md bg-black px-2 py-2 text-xs shadow-xl"
                >
                  <div className="relative z-30 text-xs font-bold text-white">
                    {member.user.firstName}
                  </div>
                  <div className="text-xs text-white">{member.user.email}</div>
                </motion.div>
              )}
            </AnimatePresence>
            <img
              onMouseMove={handleMouseMove}
              height={100}
              width={100}
              src={member.user.imageUrl || ""}
              alt={member.user.firstName || ""}
              className="relative !m-0 size-8 rounded-full border-2 border-white object-cover object-top !p-0 transition duration-500 group-hover:z-30 group-hover:scale-105"
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default TeamMembers;
