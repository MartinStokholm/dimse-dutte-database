import { prisma } from './database';

export const householdService = {
  create: async (data: { name: string; description?: string }) => {
    return prisma.household.create({ data });
  },

  findAll: async () => {
    return prisma.household.findMany();
  },

  findById: async (id: string) => {
    return prisma.household.findUnique({
      where: { id },
      include: {
        users: true,
        rooms: true,
        items: true,
      },
    });
  },

  update: async (id: string, data: { name?: string; description?: string }) => {
    return prisma.household.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.household.delete({
      where: { id },
    });
  },
};

export const roomService = {
  create: async (data: { householdId: string; name: string; description?: string }) => {
    return prisma.room.create({ data });
  },

  findAll: async (householdId?: string) => {
    return prisma.room.findMany({
      where: householdId ? { householdId } : undefined,
      include: { items: true },
    });
  },

  findById: async (id: string) => {
    return prisma.room.findUnique({
      where: { id },
      include: {
        items: true,
        media: true,
      },
    });
  },

  update: async (id: string, data: { name?: string; description?: string }) => {
    return prisma.room.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.room.delete({
      where: { id },
    });
  },
};

export const itemService = {
  create: async (data: {
    householdId: string;
    roomId: string;
    categoryId?: string;
    name: string;
    description?: string;
    quantity?: number;
    notes?: string;
    attributes?: any;
  }) => {
    return prisma.item.create({
      data: {
        ...data,
        quantity: data.quantity || 1,
      },
    });
  },

  findAll: async (filters?: { householdId?: string; roomId?: string }) => {
    return prisma.item.findMany({
      where: {
        householdId: filters?.householdId,
        roomId: filters?.roomId,
        archivedAt: null,
      },
      include: {
        tags: true,
        media: true,
      },
    });
  },

  findById: async (id: string) => {
    return prisma.item.findUnique({
      where: { id },
      include: {
        tags: true,
        media: true,
        transactions: true,
        locationHistory: true,
      },
    });
  },

  update: async (
    id: string,
    data: {
      name?: string;
      description?: string;
      quantity?: number;
      notes?: string;
      attributes?: any;
      categoryId?: string;
    }
  ) => {
    return prisma.item.update({
      where: { id },
      data,
    });
  },

  archive: async (id: string) => {
    return prisma.item.update({
      where: { id },
      data: { archivedAt: new Date() },
    });
  },

  addTransaction: async (data: {
    itemId: string;
    change: number;
    reason: string;
    createdBy: string;
  }) => {
    const transaction = await prisma.inventoryTransaction.create({
      data,
    });

    const item = await prisma.item.findUnique({ where: { id: data.itemId } });
    if (item) {
      await prisma.item.update({
        where: { id: data.itemId },
        data: { quantity: item.quantity + data.change },
      });
    }

    return transaction;
  },
};

export const categoryService = {
  create: async (data: { name: string; description?: string; parentCategoryId?: string }) => {
    return prisma.category.create({ data });
  },

  findAll: async () => {
    return prisma.category.findMany({
      include: {
        children: true,
        parent: true,
      },
    });
  },

  findById: async (id: string) => {
    return prisma.category.findUnique({
      where: { id },
      include: {
        items: true,
        children: true,
        parent: true,
      },
    });
  },

  update: async (
    id: string,
    data: { name?: string; description?: string; parentCategoryId?: string | null }
  ) => {
    return prisma.category.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.category.delete({
      where: { id },
    });
  },
};

export const tagService = {
  create: async (data: { name: string }) => {
    return prisma.tag.create({ data });
  },

  findAll: async () => {
    return prisma.tag.findMany({
      include: {
        items: true,
      },
    });
  },

  findById: async (id: string) => {
    return prisma.tag.findUnique({
      where: { id },
      include: {
        items: true,
      },
    });
  },

  update: async (id: string, data: { name: string }) => {
    return prisma.tag.update({
      where: { id },
      data,
    });
  },

  delete: async (id: string) => {
    return prisma.tag.delete({
      where: { id },
    });
  },
};
