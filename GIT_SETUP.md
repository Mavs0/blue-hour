# Guia para fazer Commit e Push para o GitHub

## Passo 1: Inicializar o repositório Git (se ainda não foi feito)

```bash
cd /Users/manuelavieira/Documents/projects/blue-hour
git init
```

## Passo 2: Adicionar todos os arquivos ao staging

```bash
git add .
```

## Passo 3: Fazer o primeiro commit

```bash
git commit -m "feat: projeto inicial Blue Hour - sistema de venda de ingressos TXT"
```

## Passo 4: Criar repositório no GitHub

1. Acesse https://github.com
2. Clique no botão "+" no canto superior direito
3. Selecione "New repository"
4. Nome: `blue-hour`
5. Descrição: "Sistema de venda de ingressos para eventos exclusivos do TXT em Manaus"
6. Escolha se será público ou privado
7. **NÃO** marque "Initialize this repository with a README" (já temos um)
8. Clique em "Create repository"

## Passo 5: Conectar o repositório local ao GitHub

```bash
git remote add origin https://github.com/SEU_USUARIO/blue-hour.git
```

(Substitua `SEU_USUARIO` pelo seu username do GitHub)

## Passo 6: Renomear branch para main (se necessário)

```bash
git branch -M main
```

## Passo 7: Fazer push para o GitHub

```bash
git push -u origin main
```

## Comandos úteis para o futuro

### Ver status dos arquivos
```bash
git status
```

### Adicionar arquivos específicos
```bash
git add arquivo.tsx
```

### Fazer commit
```bash
git commit -m "descrição da mudança"
```

### Fazer push
```bash
git push
```

### Ver histórico de commits
```bash
git log
```

## Dica: Adicionar arquivo .env ao .gitignore

Certifique-se de que o arquivo `.env` está no `.gitignore` (já está configurado) para não commitar informações sensíveis.

