#!/bin/sh
set -e

# 1. Allow privileged ports (port 80) for Docker Rootless
echo "net.ipv4.ip_unprivileged_port_start=80" | sudo tee /etc/sysctl.d/99-docker-rootless.conf
sudo sysctl --system

if [ -f ~/.local/bin/rootlesskit ]; then
    sudo setcap cap_net_bind_service=+ep ~/.local/bin/rootlesskit
fi

# 2. Enable I2C in boot configuration and load kernel module
if [ -f /boot/firmware/config.txt ]; then
    CONFIG_FILE="/boot/firmware/config.txt"
else
    CONFIG_FILE="/boot/config.txt"
fi

if ! grep -q "dtparam=i2c_arm=on" "$CONFIG_FILE"; then
    echo "dtparam=i2c_arm=on" | sudo tee -a "$CONFIG_FILE"
fi

sudo modprobe i2c-dev

# 3. Create permanent udev rule for BME280 sensor access
echo 'KERNEL=="i2c-[0-9]*", MODE="0666"' | sudo tee /etc/udev/rules.d/99-i2c.rules
sudo udevadm control --reload-rules
sudo udevadm trigger

# 4. Restart user-level Docker service
systemctl --user restart docker
