# **************************************************************************** #
#                                                                              #
#                                                         :::      ::::::::    #
#    Makefile                                           :+:      :+:    :+:    #
#                                                     +:+ +:+         +:+      #
#    By: ltouret <ltouret@student.42.fr>            +#+  +:+       +#+         #
#                                                 +#+#+#+#+#+   +#+            #
#    Created: 2021/12/16 19:31:14 by ltouret           #+#    #+#              #
#    Updated: 2022/12/15 00:21:42 by ltouret          ###   ########.fr        #
#                                                                              #
# **************************************************************************** #

dev:
	sudo docker-compose -f docker-compose.dev.yaml up --build

prod:
	sudo docker-compose up --build

clean:
	sudo docker rm $$(sudo docker ps -aq)

fclean:
	./fclean.sh

.PHONY: prod, dev, clean, fclean 
