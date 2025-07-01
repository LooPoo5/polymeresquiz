
# Configuration du Routeur pour WireGuard

## 🌐 Redirection de Port (Port Forwarding)

### Paramètres à configurer sur votre box :
- **Port externe** : 51820
- **Port interne** : 51820
- **Protocole** : UDP
- **IP de destination** : 192.168.1.48 (votre NAS)

### Instructions par opérateurs :

#### 📱 Box SFR
1. Accéder à http://192.168.1.1
2. Aller dans "Réseau" > "NAT/PAT"
3. Ajouter une règle :
   - Port début : 51820
   - Port fin : 51820
   - IP locale : 192.168.1.48
   - Protocole : UDP

#### 📱 Freebox
1. Accéder à http://mafreebox.freebox.fr
2. "Paramètres de la Freebox" > "Mode avancé" > "Redirections de ports"
3. Ajouter :
   - Port externe : 51820
   - Port interne : 51820
   - IP de destination : 192.168.1.48
   - Protocole : UDP

#### 📱 Livebox Orange
1. Accéder à http://192.168.1.1
2. "Réseau" > "NAT/PAT"
3. "Ajouter une règle"
4. Configurer la redirection UDP 51820

#### 📱 Box Bouygues
1. Interface d'administration
2. "NAT" > "Serveurs virtuels"
3. Ajouter le port UDP 51820

## ✅ Test de Configuration

Après configuration, testez avec :
```bash
# Depuis l'extérieur de votre réseau
nmap -sU -p 51820 [VOTRE_IP_PUBLIQUE]
```

Le port doit apparaître comme ouvert.
