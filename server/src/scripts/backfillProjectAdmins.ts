import prisma from "../config/prisma"

const backfillProjectAdmins = async () => {
  const projects = await prisma.project.findMany({
    include: {
      members: true,
    },
  })

  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: "asc",
    },
  })

  const fallbackUser = users[0]

  if (!fallbackUser) {
    console.log("No users found")
    return
  }

  for (const project of projects) {
    const hasAdmin = project.members.some(
      (member) => member.role === "ADMIN"
    )

    if (!hasAdmin) {
      await prisma.projectMember.create({
        data: {
          projectId: project.id,
          userId: fallbackUser.id,
          role: "ADMIN",
        },
      })

      console.log(
        `Added ${fallbackUser.email} as ADMIN to ${project.title}`
      )
    }
  }
}

backfillProjectAdmins()
  .catch((error) => {
    console.log(error)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })