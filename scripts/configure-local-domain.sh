#!/bin/bash

# Configuration domaine local pour Quiz App
echo "🔧 Configuration du domaine local quiz.local"

# Mise à jour du fichier hosts local
echo "127.0.0.1 quiz.local" >> /etc/hosts

# Configuration DNS local
echo "📡 Configuration DNS..."
echo "nameserver 192.168.1.48" > /etc/resolv.conf.quiz
echo "search quiz.local" >> /etc/resolv.conf.quiz

# Test de résolution
echo "🧪 Test de résolution DNS..."
nslookup quiz.local

echo "✅ Configuration terminée !"
echo "Testez maintenant : http://quiz.local:8080"