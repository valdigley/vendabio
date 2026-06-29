#!/bin/bash
# ===========================================
# VendaBio - Setup na VPS (rodar apenas 1 vez)
# ===========================================
# Este script:
# 1. Clona o repositório
# 2. Instala dependências
# 3. Faz build e inicia com PM2
# 4. Configura auto-deploy (watch a cada 2 min)
# 5. Configura Nginx como proxy reverso
# ===========================================

set -e

APP_NAME="vendabio"
APP_DIR="/opt/vendabio"
BRANCH="claude/video-product-sales-syqlvy"
REPO="https://github.com/valdigley/vendabio.git"
PORT=3000

echo ""
echo "=============================="
echo "  VendaBio - Setup na VPS"
echo "=============================="
echo ""

# Verificar se é root
if [ "$EUID" -ne 0 ]; then
  echo "Execute como root: sudo bash setup-vps.sh"
  exit 1
fi

# 1. Instalar Node.js se necessário
if ! command -v node &> /dev/null; then
  echo "[1/6] Instalando Node.js 22..."
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
else
  echo "[1/6] Node.js já instalado: $(node -v)"
fi

# 2. Instalar PM2 se necessário
if ! command -v pm2 &> /dev/null; then
  echo "[2/6] Instalando PM2..."
  npm install -g pm2
else
  echo "[2/6] PM2 já instalado"
fi

# 3. Clonar ou atualizar repositório
if [ -d "$APP_DIR" ]; then
  echo "[3/6] Repositório já existe, atualizando..."
  cd "$APP_DIR"
  git fetch origin "$BRANCH"
  git checkout "$BRANCH"
  git reset --hard "origin/$BRANCH"
else
  echo "[3/6] Clonando repositório..."
  git clone -b "$BRANCH" "$REPO" "$APP_DIR"
  cd "$APP_DIR"
fi

# 4. Instalar dependências e build
echo "[4/6] Instalando dependências e fazendo build..."
npm install
npm run build

# 5. Iniciar com PM2
echo "[5/6] Configurando PM2..."
pm2 delete "$APP_NAME" 2>/dev/null || true
pm2 start npm --name "$APP_NAME" -- start
pm2 save
pm2 startup systemd -u root --hp /root 2>/dev/null || true

# 6. Criar script de auto-deploy
echo "[6/6] Configurando auto-deploy..."
cat > /opt/vendabio-autodeploy.sh << 'DEPLOY_SCRIPT'
#!/bin/bash
cd /opt/vendabio
BRANCH="claude/video-product-sales-syqlvy"

# Buscar atualizações
git fetch origin "$BRANCH" 2>/dev/null

LOCAL=$(git rev-parse HEAD)
REMOTE=$(git rev-parse "origin/$BRANCH")

if [ "$LOCAL" != "$REMOTE" ]; then
  echo "$(date): Nova versão detectada, atualizando..."
  git reset --hard "origin/$BRANCH"
  npm install --production 2>/dev/null
  npm run build
  pm2 restart vendabio
  echo "$(date): Deploy concluído!"
fi
DEPLOY_SCRIPT
chmod +x /opt/vendabio-autodeploy.sh

# Criar cron job (a cada 2 minutos)
CRON_LINE="*/2 * * * * /opt/vendabio-autodeploy.sh >> /var/log/vendabio-deploy.log 2>&1"
(crontab -l 2>/dev/null | grep -v vendabio-autodeploy; echo "$CRON_LINE") | crontab -

# Configurar Nginx (se instalado)
if command -v nginx &> /dev/null; then
  echo ""
  echo "Nginx detectado. Configurando proxy reverso..."
  cat > /etc/nginx/sites-available/vendabio << NGINX_CONF
server {
    listen 80;
    server_name _;

    location / {
        proxy_pass http://127.0.0.1:$PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
NGINX_CONF
  ln -sf /etc/nginx/sites-available/vendabio /etc/nginx/sites-enabled/vendabio
  rm -f /etc/nginx/sites-enabled/default 2>/dev/null
  nginx -t && systemctl reload nginx
  echo "Nginx configurado!"
else
  echo ""
  echo "DICA: Instale o Nginx para acessar pela porta 80:"
  echo "  apt install nginx -y"
  echo "  Depois rode este script novamente."
fi

echo ""
echo "=============================="
echo "  Setup concluído!"
echo "=============================="
echo ""
echo "  App rodando em: http://$(hostname -I | awk '{print $1}'):$PORT"
echo "  Admin:          http://$(hostname -I | awk '{print $1}'):$PORT/admin"
echo ""
echo "  Auto-deploy ativo: verifica atualizações a cada 2 min"
echo "  Log do deploy:     tail -f /var/log/vendabio-deploy.log"
echo ""
echo "  Comandos úteis:"
echo "    pm2 status          - ver status"
echo "    pm2 logs vendabio   - ver logs"
echo "    pm2 restart vendabio - reiniciar"
echo ""
