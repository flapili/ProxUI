# ProxUI

**ProxUI is a responsive user interface build on top of the Proxmox API.**

⚠️ ProxUI need a configuration tuning to work well with the api (Cors Policy), the UI must be served on the same domain as the proxmox API in point of view of the webbrowser.


**example with Nginx :**

generate self signed certificate (PVEAuthCookie is a secure cookie, that mean I can only be sent with https)

```bash
sudo openssl req -x509 -nodes -days 36500 -newkey rsa:2048 -keyout /opt/www/ProxUI/selfsigned.key -out /opt/www/ProxUI/selfsigned.crt
```

```nginx
map $http_upgrade $connection_upgrade {
default upgrade;
'' close;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name your_nginx_ip;

    location /new-ui {
        alias /opt/www/ProxUI/dist/spa;
    }

    location / {
         proxy_set_header Upgrade $http_upgrade; # required for VNCproxy
         proxy_set_header Connection $connection_upgrade; # required for VNCproxy

        # proxmox_ip can be localhost if ProxUI is installed on the node (I don't recommend it)
        # you should use upstream server if you have more than 1 node
         proxy_pass https://proxmox_ip:8006$request_uri;
         include /etc/nginx/proxy_params;
     }

     ssl_certificate /opt/www/ProxUI/selfsigned.crt;
     ssl_certificate_key /opt/www/ProxUI/selfsigned.key;
}

```


## Used Technology
- [Quasar](https://quasar.dev/) (a [VueJS](https://vuejs.org/) framework)


## Screenshot
TODO


# Install (on Nginx)

copy the `dist/spa` folder to `/opt/www/ProxUI/dist/spa` (according to the nginx configuration given as example)


## Build from the source

⚠️ in order to build from the source you must have a Node LTS (recommenced), git and yarn installed

```bash
# install git (on debian like)
apt update && apt install git

# install yarn
$ npm -g i yarn

# install quasar CLI
$ yarn global add @quasar/cli
```

```bash
# clone the repo
$ git clone https://github.com/flapili/ProxUI.git

$ cd ProxUI

# install dependencies
$ yarn install

# build
$ quasar build
```




## Todo list

- [x] login
  - [ ] handle 2FA

- [ ] Datacenter
  - [ ] summary tab
  - [ ] cluster tab
  - [ ] option tab
  - [ ] storage tab
  - [ ] backup tab
  - [ ] replication tab
  - [ ] permission tab
  - [ ] HA tab
  - [ ] firewall tab
  - [ ] support tab

- [ ] nodes
  - [ ] node list tab
  - [ ] action dropdown (mass action + shell)
  - [ ] summary tab
  - [ ] note tab
  - [ ] system tab
    - [ ] network
    - [ ] DNS
    - [ ] hosts
    - [ ] times
    - [ ] syslog
  - [ ] update tab
  - [ ] firewall tab
    - [ ] options
    - [ ] logs
  - [ ] disks tab
    - [ ] LVM
    - [ ] LVM-thin
    - [ ] directory
    - [ ] ZFS
  - [ ] ceph tab
    - [ ] configuration
    - [ ] monitor
    - [ ] OSD
    - [ ] cephFS
    - [ ] pools
    - [ ] logs
  - [ ] replication tab
  - [ ] task history tab
  - [ ] subscription tab

- [ ] container
  - [ ] summary tab
  - [ ] action dropdown (start, stop, console, clone, convert to template, delete, ect)
  - [ ] ressources tab
  - [ ] network tab
  - [ ] DNS tab
  - [ ] options tab
  - [ ] task history tab
  - [ ] backup tab
  - [ ] replication tab
  - [ ] snapshots tab
  - [ ] firewall tab
    - [ ] options
    - [ ] alias
    - [ ] IPset
    - [ ] logs
  - [ ] Permissions tab



- [ ] VM
  - [ ] summary  tab
  - [ ] action dropdown (start, stop, console, clone, convert to template, delete, ect)
  - [ ] hardware tab
  - [ ] cloud-init tab
  - [ ] options tab
  - [ ] task history tab
  - [ ] monitor tab
  - [ ] backup tab
  - [ ] replication tab
  - [ ] snapshots tab
  - [ ] firewall tab
    - [ ] options
    - [ ] alias
    - [ ] IPset
    - [ ] logs
  - [ ] Permissions tab

- [ ] storage
  - [ ] summary tab
  - [ ] VM disks tab
  - [ ] CT volumes tab
  - [ ] permissions tab

- [ ] Pools tags (not in roadmap yet)