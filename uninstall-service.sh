#!/bin/bash

sudo systemctl daemon-reload

sudo systemctl stop dota2dbot.service
sudo systemctl disable $PWD/dota2dbot.service


