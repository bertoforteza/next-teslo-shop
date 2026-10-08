"use server";

import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const registerUser = async (
  name: string,
  email: string,
  password: string,
) => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: bcrypt.hashSync(password),
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    return {
      ok: true,
      user,
    };
  } catch (error) {
    console.error(error);
    return {
      ok: false,
      message: "No se pudo crear el usuario",
    };
  }
};
