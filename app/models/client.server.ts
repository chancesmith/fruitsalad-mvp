import type { Client, User } from "@prisma/client";

import { prisma } from "~/db.server";

export function getClient({ id }: Pick<Client, "id">) {
  return prisma.client.findFirst({
    select: { id: true, firstName: true, lastName: true, email: true },
    where: { id },
  });
}

export function getClientListItems({ search }: { search?: string }) {
  // TODO: check is user has rights - Chance Smith 2/8/2023
  return prisma.client.findMany({
    // where: {
    //   firstName: {
    //     contains: search,
    //   },
    //   lastName: {
    //     contains: search,
    //   },
    // },
    select: { id: true, firstName: true, lastName: true },
    // orderBy: { lastName: "desc" },
  });
}

export function createClient({
  firstName,
  lastName,
  userId,
  email,
}: Pick<Client, "firstName" | "lastName" | "email"> & {
  userId: User["id"];
}) {
  return prisma.client.create({
    data: {
      firstName,
      lastName,
      email,
      createdBy: {
        connect: {
          id: userId,
        },
      },
    },
  });
}

export function deleteClient({ id }: Pick<Client, "id">) {
  return prisma.client.deleteMany({
    where: { id },
  });
}
