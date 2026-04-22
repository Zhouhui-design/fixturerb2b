#!/bin/bash
# Script to properly initialize gnome-keyring

# Check if already running
if pgrep -x "gnome-keyring-daemon" > /dev/null; then
    echo "gnome-keyring-daemon is already running"
    exit 0
fi

# Create keyring directory if it doesn't exist
mkdir -p /run/user/$(id -u)/keyring
chmod 700 /run/user/$(id -u)/keyring

# Start gnome-keyring-daemon with secrets component
eval $(gnome-keyring-daemon --start --components=secrets,pkcs11,ssh,gpg)

export GNOME_KEYRING_CONTROL
export SSH_AUTH_SOCK
export GPG_AGENT_INFO

echo "gnome-keyring-daemon started successfully"
echo "GNOME_KEYRING_CONTROL=$GNOME_KEYRING_CONTROL"
echo "SSH_AUTH_SOCK=$SSH_AUTH_SOCK"
