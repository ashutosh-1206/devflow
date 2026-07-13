import prisma from "../config/prisma";

export const getTaskPermission = async (
  taskId: string,
  userId: string
) => {
  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
    include: {
      project: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!task) {
    return {
      task: null,
      isAdmin: false,
      isAssigned: false,
    };
  }

  const member = task.project.members.find(
    (m) => m.userId === userId
  );

  return {
    task,
    isAdmin: member?.role === "ADMIN",
    isAssigned: task.assignedToId === userId,
  };
};