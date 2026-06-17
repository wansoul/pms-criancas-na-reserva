import type { Meta, StoryObj } from "@storybook/react"

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../components/accordion"

const meta: Meta<typeof Accordion> = {
  title: "Components/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="w-[480px]">
        <Story />
      </div>
    ),
  ],
}

export default meta
type Story = StoryObj<typeof Accordion>

export const Default: Story = {
  render: () => (
    <Accordion>
      <AccordionItem value="item-1">
        <AccordionTrigger>O que está incluído no café da manhã?</AccordionTrigger>
        <AccordionContent>
          Café da manhã inclui frutas da estação, pães artesanais, frios, sucos naturais e bebidas quentes. Servido das 7h às 10h.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Qual a política de cancelamento?</AccordionTrigger>
        <AccordionContent>
          Cancelamento gratuito até 3 dias antes do check-in. Após esse prazo, será cobrada uma diária como multa.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Aceita animais de estimação?</AccordionTrigger>
        <AccordionContent>
          Aceitamos animais de pequeno porte (até 10 kg) mediante taxa adicional de R$ 50/noite. É necessário informar no momento da reserva.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const MultiploAberto: Story = {
  name: "Múltiplos abertos",
  render: () => (
    <Accordion openMultiple defaultValue={["item-1", "item-2"]}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Check-in e check-out</AccordionTrigger>
        <AccordionContent>
          Check-in a partir das 14h. Check-out até as 12h. Early check-in e late check-out sujeitos a disponibilidade.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Estacionamento</AccordionTrigger>
        <AccordionContent>
          Estacionamento gratuito para hóspedes, com vagas cobertas e descobertas. Não é necessário reservar com antecedência.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Wi-Fi</AccordionTrigger>
        <AccordionContent>
          Wi-Fi gratuito em todas as áreas da pousada. Velocidade de 100 Mbps. Senha disponível na recepção.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
