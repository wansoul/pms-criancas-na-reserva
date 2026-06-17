import type { Preview } from "@storybook/react"
import "../src/styles/globals.css"

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: "centered",
  },
  globalTypes: {
    density: {
      description: "Densidade da interface",
      defaultValue: "comfortable",
      toolbar: {
        title: "Densidade",
        icon: "ruler",
        items: [
          { value: "comfortable", title: "Confortável" },
          { value: "compact", title: "Compacta" },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      description: "Tema",
      defaultValue: "light",
      toolbar: {
        title: "Tema",
        icon: "circlehollow",
        items: [
          { value: "light", title: "Claro" },
          { value: "dark", title: "Escuro" },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const density = context.globals.density ?? "comfortable"
      const theme = context.globals.theme ?? "light"
      document.documentElement.setAttribute("data-density", density)
      document.documentElement.classList.toggle("dark", theme === "dark")
      return Story()
    },
  ],
}

export default preview
