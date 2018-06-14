# -*- mode: ruby -*-
# vi: set ft=ruby ts=2 sw=2 expandtab :

PROJECT = "maptiler_openlayer_osm_map"

ENV['VAGRANT_NO_PARALLEL'] = 'yes'
ENV['VAGRANT_DEFAULT_PROVIDER'] = 'docker'
Vagrant.configure(2) do |config|

  config.vm.define "nominatim" do |nominatim|
    nominatim.vm.provider "docker" do |d|
      d.image = "nominatim" # you must build the image before (check README.md)
      d.name = "#{PROJECT}_nominatim"
    end
    nominatim.vm.network "forwarded_port", guest: 8080, host: 8001
  end

  config.ssh.insert_key = false
  config.vm.define "dev", primary: true do |app|
    app.vm.provider "docker" do |d|
      d.image = "allansimon/allan-docker-dev-python"
      d.name = "#{PROJECT}_dev"
      d.has_ssh = true
      d.env = {
        "HOST_USER_UID" => Process.euid,
      }
    end
    app.ssh.username = "vagrant"

    app.vm.network "forwarded_port", guest: 80, host: 8000
    app.vm.network "forwarded_port", guest: 443, host: 8003
  end

  config.vm.provision "file", source: "build_scripts/nginx.conf", destination: "/tmp/nginx.conf"

  config.vm.provision "installs", "type": "shell" do |installs|
    installs.inline = "
      pip3 install -r /vagrant/build_scripts/requirements.txt
      sudo apt-get update
      sudo apt-get install nginx -y
      echo 'cd /vagrant' >> /home/vagrant/.zshrc
      sudo cp /tmp/nginx.conf /etc/nginx/nginx.conf
      sudo service nginx restart
    "
  end
end
