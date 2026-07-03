---
title: Linux essentials
description: File permissions, process management, and networking commands used daily.
pubDate: 2025-06-10
tags: [Linux]
---

## Permissions

```bash
chmod 750 file        # rwx for owner, rx for group, none for others
chown user:group file
```

## Processes

```bash
ps aux | grep name
kill -9 PID
top                    # or htop
nohup command &        # survive shell exit
```

## Disk & files

```bash
df -h                  # disk usage by filesystem
du -sh *                # size of each item in current dir
find . -name "*.log" -mtime +7 -delete
```

## Networking

```bash
ss -tulpn               # listening ports
curl -I https://example.com   # headers only
dig example.com
```
