import prisma from "../config/prisma"

const logActivity = async (
  projectId: string,
  userId: string,
  message: string
) => {

  try {

    await prisma.activityLog.create({
      data: {
        projectId,
        userId,
        message,
      },
    })

  } catch (error) {

    console.log(
      "Activity log error:",
      error
    )
  }
}

export default logActivity