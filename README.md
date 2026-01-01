# 🛡️ LugoVPN

LugoVPN é uma solução VPN open-source moderna, rápida e intuitiva baseada em **WireGuard®**. Nosso objetivo é fornecer uma experiência de conexão "um clique" com paridade total entre Web e Desktop.

> [!WARNING]
> **ESTADO DO PROJETO:** Atualmente em desenvolvimento ativo (Fase 8 - Estabilização). Sinta-se à vontade para testar, "brincar" e contribuir, mas use com cautela em ambientes de produção.

---

## 🚀 Características

- **Simplicidade Extrema**: Interface limpa e status óbvio em 1 segundo.
- **Performance**: Baseado em WireGuard para conexões rápidas e estáveis.
- **Arquitetura Desacoplada**: Daemon privilegiado (`lugovpnd`) separado da interface de usuário (Wails).
- **Paridade Total**: Mesma lógica e UI no Desktop e na Web.
- **Open Source**: Gratuito para sempre sob a licença MIT.

---

## 🏗️ Arquitetura

LugoVPN utiliza uma arquitetura em camadas para garantir segurança e flexibilidade:

1.  **Core Daemon (`lugovpnd`)**: Escrito em Go, roda como root para gerenciar as interfaces WireGuard.
2.  **Desktop Client**: Construído com **Wails (Go + Vite/JS)**, funciona como um container para a UI.
3.  **Local API**: Comunicação segura via HTTP IPC entre a UI e o Daemon, protegida por tokens.

---

## 🛠️ Pré-requisitos

Para rodar ou desenvolver o LugoVPN, você precisará de:

- **Go** (v1.21+)
- **Node.js** & **npm** (para o frontend)
- **Wails v2** (`go install github.com/wailsapp/wails/v2/cmd/wails@latest`)
- **WireGuard Tools** (`wg`, `wg-quick`) instalados no sistema.
- **Linux** (Suporte inicial focado em distribuições Linux).

---

## 🚦 Como Iniciar

### 1. Preparar o Daemon
O daemon precisa ser compilado e instalado para gerenciar a rede:

```bash
# No diretório raiz
cd core
go build -o ../bin/lugovpnd ./daemon
sudo cp ../bin/lugovpnd /usr/local/bin/
```

### 2. Inicializar Configurações
Rode o script de inicialização para configurar o estado inicial do WireGuard:

```bash
chmod +x scripts/init-daemon.sh
./scripts/init-daemon.sh
```

### 3. Rodar em Modo Desenvolvimento (Wails)
Para ver a interface e testar alterações em tempo real:

```bash
cd desktop
wails dev
```


https://github.com/user-attachments/assets/ddd605a4-ee2e-4898-a32a-31e743bd5a3c


---

## 📄 Licença

Este projeto está licenciado sob a **Licença MIT** - veja o arquivo [LICENSE](LICENSE) para detalhes. É gratuito, open-source e livre para qualquer tipo de uso.

---

## 🤝 Contribuições

LugoVPN é um projeto comunitário. Pull requests são bem-vindos! Se você encontrar um bug ou tiver uma sugestão de melhoria, abra uma Issue.

---
*LugoVPN - Conectando você com simplicidade e segurança.*
