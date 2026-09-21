import type { ActivityItemProps } from "../../components/activity-item/activity-item";

export const spaceActivitiesMock = [
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
  {
    id: "4",
    userName: "Ana",
    avatarFallback: "A",
    description: 'moveu "Panelas" para Cozinha › Armário 3',
    time: "há 1 dia",
  },
  {
    id: "5",
    userName: "Você",
    avatarFallback: "TB",
    description: 'atualizou as informações de "Livro: Clean Code"',
    time: "há 1 dia",
  },
] satisfies (ActivityItemProps & { id: string })[];
