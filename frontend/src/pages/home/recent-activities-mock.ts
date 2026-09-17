import type { ActivityItemProps } from "../../components/activity-item/activity-item";

export const recentActivitiesMock = [
  {
    id: "1",
    userName: "Maria",
    avatarFallback: "M",
    description: 'moveu "Furadeira" para Garagem › Caixa de ferramentas',
    time: "há 12 minutos",
  },
  {
    id: "2",
    userName: "Você",
    avatarFallback: "TB",
    description: 'adicionou "Passaporte" em Quarto › Caixa 1',
    time: "há 2 horas",
  },
  {
    id: "3",
    userName: "João",
    avatarFallback: "J",
    description: 'adicionou "Cabo HDMI" em Escritório › Gaveta 2',
    time: "há 5 horas",
  },
] satisfies (ActivityItemProps & { id: string })[];
