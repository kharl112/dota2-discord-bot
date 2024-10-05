#!/bin/bash

sudo systemctl daemon-reload
sudo systemctl enable $PWD/dota2dbot.service

sudo systemctl start dota2dbot.service

