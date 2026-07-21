#!/bin/bash
# CouscousFlix — Lance tous les services backend en arrière-plan
# Usage : ./start-backend.sh
# Logs  : /tmp/couscousflix-*.log

PROJET="/home/yaxou/Documents/CouscousFlixOpenSource"

echo "🎬 Démarrage des services CouscousFlix..."

# Main API (Node.js)
node "$PROJET/API/Mainapi/server.js" > /tmp/couscousflix-mainapi.log 2>&1 &
MAINAPI_PID=$!
echo "✅ Main API        — PID $MAINAPI_PID  (port 25565)  → log: /tmp/couscousflix-mainapi.log"

# WatchParty API (Node.js)
node "$PROJET/API/watchpartyAPI/watchparty.js" > /tmp/couscousflix-watchparty.log 2>&1 &
WATCHPARTY_PID=$!
echo "✅ WatchParty API  — PID $WATCHPARTY_PID  (port 25566)  → log: /tmp/couscousflix-watchparty.log"

# Proxies Embed (Python)
"$PROJET/API/proxiesembed/.venv/bin/python3" "$PROJET/API/proxiesembed/server.py" > /tmp/couscousflix-proxiesembed.log 2>&1 &
PROXIES_PID=$!
echo "✅ Proxies Embed   — PID $PROXIES_PID  (port 25569)  → log: /tmp/couscousflix-proxiesembed.log"

# Bypass403 (Python Flask)
"$PROJET/API/miscs/.venv/bin/python3" "$PROJET/API/miscs/bypass403.py" > /tmp/couscousflix-bypass403.log 2>&1 &
BYPASS_PID=$!
echo "✅ Bypass403       — PID $BYPASS_PID  (port 25568)  → log: /tmp/couscousflix-bypass403.log"

echo ""
echo "⏳ Attente 5 secondes pour laisser les services démarrer..."
sleep 5

echo ""
echo "📡 Ports actifs :"
ss -tlnp 2>/dev/null | grep -E "25565|25566|25568|25569" || echo "(aucun port détecté — vérifiez les logs)"

echo ""
echo "📋 Résumé des logs :"
echo "--- Main API ---"   && tail -5 /tmp/couscousflix-mainapi.log 2>/dev/null
echo "--- WatchParty ---" && tail -3 /tmp/couscousflix-watchparty.log 2>/dev/null
echo "--- Proxies ---"    && tail -3 /tmp/couscousflix-proxiesembed.log 2>/dev/null
echo "--- Bypass403 ---"  && tail -3 /tmp/couscousflix-bypass403.log 2>/dev/null

echo ""
echo "🌐 Maintenant lance le frontend dans un autre terminal :"
echo "   cd $PROJET && npm run dev"
echo ""
echo "Puis ouvre http://localhost:3000 dans ton navigateur 🎉"
