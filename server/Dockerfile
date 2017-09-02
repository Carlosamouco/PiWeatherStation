FROM arm32v7/node

RUN apt-get install -y wget

RUN wget http://archive.raspbian.org/raspbian.public.key -O - | apt-key add -

RUN echo "deb http://mirrordirector.raspbian.org/raspbian/ jessie main contrib non-free rpi" >> /etc/apt/sources.list

RUN apt-get update \
 && apt-get upgrade -y \
 && apt-get install -y 	python \
    			python3 \
			python-pil \
			python3-pil \
			python-numpy \
			python3-numpy
			

RUN wget -P /tmp https://archive.raspberrypi.org/debian/pool/main/p/python-sense-hat/python-sense-hat_2.1.0-1_armhf.deb \
 && wget -P /tmp https://archive.raspberrypi.org/debian/pool/main/r/rtimulib/python3-rtimulib_7.2.1-3_armhf.deb \
 && wget -P /tmp https://archive.raspberrypi.org/debian/pool/main/r/rtimulib/python-rtimulib_7.2.1-3_armhf.deb \
 && wget -P /tmp https://archive.raspberrypi.org/debian/pool/main/r/rtimulib/librtimulib7_7.2.1-3_armhf.deb	

RUN dpkg -i /tmp/librtimulib7_7.2.1-3_armhf.deb \
 && dpkg -i /tmp/python3-rtimulib_7.2.1-3_armhf.deb \
 && dpkg -i /tmp/python-rtimulib_7.2.1-3_armhf.deb \
 && dpkg -i /tmp/python-sense-hat_2.1.0-1_armhf.deb

RUN mkdir -p /usr/src/app

COPY package.json /usr/src/app/

WORKDIR /usr/src/app

RUN npm install

EXPOSE 3333

CMD ["npm", "run", "dev"]
