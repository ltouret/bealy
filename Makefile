# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ltouret <ltouret@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2021/12/16 19:31:14 by ltouret           #+#    #+#              #
#    Updated: 2022/12/15 14:50:14 by ltouret          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

dev:
	sudo docker-compose -f docker-compose.dev.yaml up --build

prod:
	sudo docker-compose up --build

clean:
	sudo docker rm $$(sudo docker ps -aq)
	sudo docker volume prune -f

fclean:
	sudo ./fclean.sh

clean_modules:
	sudo rm -rf server/dist server/node_modules

.PHONY: prod, dev, clean, fclean 
